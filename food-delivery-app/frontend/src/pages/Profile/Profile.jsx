import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (user) setForm({ name: user.name || "", email: user.email || "" });
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    const res = await updateProfile(form);
    if (res.success) {
      setStatus("Profile updated");
    } else {
      setStatus(res.message || "Update failed");
    }
  };

  if (!user)
    return (
      <div className="page profile">You need to login to view profile.</div>
    );

  return (
    <div className="page profile">
      <h1>Profile</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
        <label>
          Email
          <input name="email" value={form.email} onChange={handleChange} />
        </label>
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </form>
      {status && <p className="status">{status}</p>}
    </div>
  );
};

export default Profile;
