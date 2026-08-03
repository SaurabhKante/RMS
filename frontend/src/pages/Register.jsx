import { useState } from "react";
import {
  ArrowRight,
  BarChart,
  Eye,
  EyeOff,
  Rocket,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { BASE_URL } from "../constants/baseUrl";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNo: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Basic Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = "Enter a valid 10-digit mobile number.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Register User
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

     const token = localStorage.getItem("token");

const response = await axios.post(
  `${BASE_URL}/user/v1/register`,
  {
    fullName: formData.fullName,
    mobileNo: formData.mobileNo,
    email: formData.email,
    password: formData.password,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      // Backend response
      if (response.data?.success) {
        alert(
          response.data?.message ||
            "User Registered Successfully."
        );

        // Go back to previous page
        navigate(-1);
      }
    } catch (error) {
      console.error("Registration error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.MESSAGE ||
        "Registration failed. Please try again.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-teal-900 to-teal-700 relative overflow-hidden text-white p-12 items-center">

        {/* Blur Effect */}
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-orange-400/20 blur-[120px] rounded-full" />

        <div className="relative z-10 max-w-xl ml-10">

          {/* Logo */}
          <div className="w-16 h-16 bg-white rounded-2xl mb-8" />

          <h1 className="text-4xl font-bold leading-tight mb-6">
            Elevate Your Restaurant
            <br />
            Operations with Hotelix.
          </h1>

          <p className="text-lg text-gray-200 leading-8 mb-6">
            Join thousands of high-performing restaurants that use our RMS
            to streamline workflows, manage inventory, and boost guest
            satisfaction.
          </p>

          {/* Card 1 */}
          <div className="flex gap-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 mb-5">

            <div className="text-2xl mt-1">
              <Rocket />
            </div>

            <div>
              <h3 className="font-bold text-lg mb-1">
                Fast Deployment
              </h3>

              <p className="text-sm text-gray-200 leading-6">
                Get your system up and running in less than 24 hours with
                guided onboarding.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex gap-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">

            <div className="text-2xl mt-1">
              <BarChart />
            </div>

            <div>
              <h3 className="font-bold text-lg mb-1">
                Real-time Analytics
              </h3>

              <p className="text-sm text-gray-200 leading-6">
                Track sales, waste, and staff performance with live
                dashboard updates.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-8 bg-gray-50 overflow-y-auto">

        <div className="w-full max-w-md">

          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>

          <p className="text-gray-500 mb-8">
            Start managing your restaurant with Hotelix.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Manager Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                MANAGER NAME
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter manager's full name"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.fullName
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-teal-700`}
              />

              {errors.fullName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  EMAIL ADDRESS
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-teal-700`}
                />

                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  PHONE NUMBER
                </label>

                <input
                  type="text"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.mobileNo
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-teal-700`}
                />

                {errors.mobileNo && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.mobileNo}
                  </p>
                )}
              </div>

            </div>

            {/* Password */}
            <div>

              <label className="block text-xs font-bold text-gray-700 mb-2">
                PASSWORD
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-teal-700`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

              {errors.password ? (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password}
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  Must be at least 6 characters long.
                </p>
              )}

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? "bg-teal-700 cursor-not-allowed"
                  : "bg-teal-900 hover:bg-teal-800"
              } text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all`}
            >

              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}

            </button>

          </form>

          <footer className="text-center text-sm text-gray-400 mt-5">
            © 2026 Hotelix Technologies. All rights reserved.
          </footer>

        </div>

      </div>

    </div>
  );
};

export default Register;

