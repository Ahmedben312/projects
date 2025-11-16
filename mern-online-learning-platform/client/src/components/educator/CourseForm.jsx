import React, { useState } from "react";
import API from "../../utils/api";

const CourseForm = ({ course, onSave }) => {
  const [formData, setFormData] = useState({
    title: course?.title || "",
    description: course?.description || "",
    shortDescription: course?.shortDescription || "",
    category: course?.category || "web-development",
    price: course?.price || 0,
    level: course?.level || "beginner",
    requirements: course?.requirements || [""],
    learningOutcomes: course?.learningOutcomes || [""],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const addArrayField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    });
  };

  const removeArrayField = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty strings from arrays
      const submitData = {
        ...formData,
        requirements: formData.requirements.filter((req) => req.trim() !== ""),
        learningOutcomes: formData.learningOutcomes.filter(
          (outcome) => outcome.trim() !== ""
        ),
      };

      let response;
      if (course) {
        response = await API.put(`/courses/${course._id}`, submitData);
      } else {
        response = await API.post("/courses", submitData);
      }

      onSave(response.data.data);
    } catch (error) {
      console.error("Error saving course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="course-form">
      <div className="form-group">
        <label>Course Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter course title"
        />
      </div>

      <div className="form-group">
        <label>Short Description</label>
        <textarea
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          placeholder="Brief description (max 200 characters)"
          maxLength="200"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Full Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Detailed course description"
          rows="6"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="web-development">Web Development</option>
            <option value="data-science">Data Science</option>
            <option value="mobile-development">Mobile Development</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
            <option value="music">Music</option>
            <option value="photography">Photography</option>
          </select>
        </div>

        <div className="form-group">
          <label>Level</label>
          <select name="level" value={formData.level} onChange={handleChange}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className="form-group">
          <label>Price ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Requirements</label>
        {formData.requirements.map((requirement, index) => (
          <div key={index} className="array-field">
            <input
              type="text"
              value={requirement}
              onChange={(e) =>
                handleArrayChange(index, e.target.value, "requirements")
              }
              placeholder={`Requirement ${index + 1}`}
            />
            {formData.requirements.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayField(index, "requirements")}
                className="btn btn-danger"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayField("requirements")}
          className="btn btn-outline"
        >
          Add Requirement
        </button>
      </div>

      <div className="form-group">
        <label>Learning Outcomes</label>
        {formData.learningOutcomes.map((outcome, index) => (
          <div key={index} className="array-field">
            <input
              type="text"
              value={outcome}
              onChange={(e) =>
                handleArrayChange(index, e.target.value, "learningOutcomes")
              }
              placeholder={`Outcome ${index + 1}`}
            />
            {formData.learningOutcomes.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayField(index, "learningOutcomes")}
                className="btn btn-danger"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayField("learningOutcomes")}
          className="btn btn-outline"
        >
          Add Outcome
        </button>
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? "Saving..." : course ? "Update Course" : "Create Course"}
      </button>
    </form>
  );
};

export default CourseForm;
