import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { BASE_URL } from "../constants/baseUrl";
import ProfileForm from "../components/profile/update_profile/ProfileForm";

const UpdateProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = () => {
    const token = localStorage.getItem("token");

    // If token doesn't exist, go to login
    if (!token) {
      navigate("/login");
      return;
    }

    setFormData({
      name: localStorage.getItem("fullName") || "",
      mobile: localStorage.getItem("mobileNo") || "",
      password: "",
      role: localStorage.getItem("role") || "",
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // Backend expects these exact field names
      const payload = {
        fullName: formData.name,
        mobileNo: formData.mobile,
      };

      // Send password only if user entered a new password
      if (formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      const res = await axios.patch(
        `${BASE_URL}/user/v1/update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update response:", res.data);

      // Update localStorage with the new values
      localStorage.setItem("fullName", formData.name);
      localStorage.setItem("mobileNo", formData.mobile);

      // Don't store password in localStorage
      setFormData((prev) => ({
        ...prev,
        password: "",
      }));

      alert(res.data.message || res.data.MESSAGE || "Profile updated successfully.");

      navigate("/profile");
    } catch (error) {
      console.error("Update profile error:", error);

      // Token expired / unauthorized
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
        error.response?.data?.MESSAGE ||
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b h-16 flex items-center justify-between px-5">

        <button
          onClick={() => navigate("/profile")}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={22} />
        </button>

        <h1 className="text-xl font-bold text-teal-800">
          Update Profile
        </h1>

        <div className="w-8" />
      </header>

      {/* Body */}
      <div className="max-w-md mx-auto px-5 py-6">

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">

          <div className="w-24 h-24 rounded-full bg-teal-200 flex items-center justify-center">
            <User size={46} className="text-teal-800" />
          </div>

          <p className="mt-4 text-sm uppercase tracking-widest text-teal-700 font-semibold">
            {formData.role}
          </p>

          <h2 className="text-2xl font-bold mt-1">
            {formData.name}
          </h2>

        </div>

        {/* Form */}
        <ProfileForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={updateProfile}
          loading={loading}
        />

      </div>
    </div>
  );
};

export default UpdateProfile;

