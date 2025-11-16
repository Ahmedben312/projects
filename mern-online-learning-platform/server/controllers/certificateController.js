import puppeteer from "puppeteer";
import Certificate from "../models/Certificate.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Generate certificate
// @route   POST /api/certificates/generate
// @access  Private
export const generateCertificate = async (req, res) => {
  try {
    const { enrollmentId } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate("course")
      .populate("student");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // Check if user owns the enrollment
    if (enrollment.student._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Check if course is completed
    if (!enrollment.completedAt) {
      return res.status(400).json({
        success: false,
        message: "Course must be completed to generate certificate",
      });
    }

    // Check if certificate already exists
    let certificate = await Certificate.findOne({ enrollment: enrollmentId });

    if (certificate) {
      return res.json({
        success: true,
        data: certificate,
      });
    }

    // Generate certificate
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .certificate {
              background: white;
              padding: 50px;
              border: 20px solid #f4a261;
              border-image: linear-gradient(45deg, #f4a261, #e76f51) 1;
              text-align: center;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              max-width: 800px;
              position: relative;
            }
            .header {
              margin-bottom: 40px;
            }
            .header h1 {
              color: #2a9d8f;
              font-size: 48px;
              margin: 0;
              font-weight: bold;
            }
            .header p {
              color: #264653;
              font-size: 20px;
              margin: 10px 0;
            }
            .content {
              margin: 40px 0;
            }
            .student-name {
              font-size: 36px;
              color: #e76f51;
              margin: 20px 0;
              font-weight: bold;
            }
            .course-name {
              font-size: 24px;
              color: #264653;
              margin: 20px 0;
            }
            .completion-date {
              font-size: 18px;
              color: #666;
              margin: 20px 0;
            }
            .footer {
              margin-top: 40px;
              border-top: 2px solid #ddd;
              padding-top: 20px;
            }
            .signatures {
              display: flex;
              justify-content: space-around;
              margin-top: 40px;
            }
            .signature {
              text-align: center;
            }
            .verification {
              margin-top: 30px;
              font-size: 14px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <h1>CERTIFICATE OF COMPLETION</h1>
              <p>This is to certify that</p>
            </div>
            
            <div class="content">
              <div class="student-name">${enrollment.student.name}</div>
              <p>has successfully completed the course</p>
              <div class="course-name">${enrollment.course.title}</div>
              <div class="completion-date">
                Completed on ${new Date(
                  enrollment.completedAt
                ).toLocaleDateString()}
              </div>
            </div>
            
            <div class="footer">
              <div class="signatures">
                <div class="signature">
                  <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 10px;"></div>
                  <p>Instructor</p>
                </div>
                <div class="signature">
                  <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 10px;"></div>
                  <p>Date</p>
                </div>
              </div>
              
              <div class="verification">
                <p>Verification Code: ${Math.random()
                  .toString(36)
                  .substr(2, 12)
                  .toUpperCase()}</p>
                <p>Certificate ID: CERT-${Date.now()}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    });

    await browser.close();

    // Create certificate record
    certificate = await Certificate.create({
      student: enrollment.student._id,
      course: enrollment.course._id,
      enrollment: enrollmentId,
      issueDate: new Date(),
      pdfUrl: `certificate-${enrollmentId}.pdf`,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=certificate-${enrollment.student.name}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Certificate generation error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating certificate",
    });
  }
};

// @desc    Get user certificates
// @route   GET /api/certificates/my-certificates
// @access  Private
export const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user.id })
      .populate("course", "title thumbnail")
      .sort({ issueDate: -1 });

    res.json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
