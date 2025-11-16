import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";
import EmptyState from "../../components/common/EmptyState";

const MyCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      // Mock certificates for demo
      const mockCertificates = [
        {
          _id: "1",
          course: {
            title: "React Fundamentals",
            thumbnail:
              "https://via.placeholder.com/300x200/007bff/ffffff?text=React+Course",
          },
          issueDate: new Date("2024-01-15"),
          certificateId: "CERT-001",
        },
        {
          _id: "2",
          course: {
            title: "Node.js Backend Development",
            thumbnail:
              "https://via.placeholder.com/300x200/28a745/ffffff?text=Node.js+Course",
          },
          issueDate: new Date("2024-02-20"),
          certificateId: "CERT-002",
        },
      ];
      setCertificates(mockCertificates);

      // Uncomment when server is ready:
      // const response = await API.get('/certificates/my-certificates');
      // setCertificates(response.data.data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = (certificateId) => {
    alert(`Downloading certificate ${certificateId}`);
    // Implementation for certificate download
  };

  if (loading) {
    return <div className="loading">Loading certificates...</div>;
  }

  return (
    <div className="container">
      <h1>My Certificates</h1>

      {certificates.length === 0 ? (
        <EmptyState
          title="No certificates yet"
          message="Complete courses to earn certificates that showcase your achievements."
          actionText="Browse Courses"
          actionLink="/"
          showAction={true}
        />
      ) : (
        <div className="certificates-grid">
          {certificates.map((certificate) => (
            <div key={certificate._id} className="certificate-card">
              <div className="certificate-header">
                <img
                  src={certificate.course.thumbnail}
                  alt={certificate.course.title}
                  className="certificate-thumbnail"
                />
                <div className="certificate-badge">🏆</div>
              </div>
              <div className="certificate-content">
                <h3>{certificate.course.title}</h3>
                <p>
                  Issued on:{" "}
                  {new Date(certificate.issueDate).toLocaleDateString()}
                </p>
                <p className="certificate-id">
                  ID: {certificate.certificateId}
                </p>
                <button
                  onClick={() => handleDownloadCertificate(certificate._id)}
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "1rem" }}
                >
                  Download Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCertificates;
