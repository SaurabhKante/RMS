import { useState } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants/baseUrl";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/user/v1/login`,
        {
          email: email.trim(),
          password: password,
        }
      );

      console.log("Login Response:", response.data);

      if (response.data.success) {
        const userData = response.data.data;

        // Extract data from backend response
        const {
          userId,
          fullName,
          email: userEmail,
          role,
          mobile : userMobile,
          token,
        } = userData;

        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", role);
        localStorage.setItem("fullName", fullName);
        localStorage.setItem("email", userEmail);
        localStorage.setItem("mobileNo", userMobile);

        navigate("/");
      } else {
        setError(
          response.data.message || "Login failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        setError(
          error.response.data?.message ||
            "Invalid email or password."
        );
      } else if (error.request) {
        setError(
          "Unable to connect to the server. Please try again later."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">

      {/* LEFT SECTION */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-teal-900">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1400')",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950/90 to-orange-900/50" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">

          <div>
            <h1 className="text-5xl font-bold mb-4">
              The Quiet Engine
              <br />
              of Excellence.
            </h1>

            <p className="text-lg text-slate-200 max-w-lg">
              Streamlining high-volume hospitality with data-driven precision
              and intuitive restaurant management.
            </p>
          </div>

          <div className="space-y-5">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5">
              <p className="text-sm uppercase tracking-widest text-teal-100">
                Global Reach
              </p>

              <h3 className="text-xl font-semibold mt-2">
                Powering 2,500+ Kitchens Worldwide
              </h3>
            </div>
          </div>

        </div>
      </section>

      {/* RIGHT SECTION */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6">

        <div className="w-full max-w-md">

          <div className="mb-10">
            <h2 className="text-4xl font-bold text-slate-900 mb-2">
              Welcome Back
            </h2>

            <p className="text-slate-500">
              Log in to manage your branch operations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email or Username
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@hotelix.com"
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />

              </div>
            </div>

            {/* Password */}
            <div>

              <div className="flex justify-between mb-2">

                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>

                <button
                  type="button"
                  className="text-sm text-teal-800 hover:underline"
                >
                  Forgot Password?
                </button>

              </div>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">

              <input
                type="checkbox"
                className="h-4 w-4"
              />

              <span className="text-sm text-slate-600">
                Remember this device for 30 days
              </span>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? "bg-teal-700 cursor-not-allowed"
                  : "bg-teal-900 hover:bg-teal-800"
              } text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition`}
            >
              {loading ? "Signing In..." : "Access Dashboard"}

              {!loading && <ArrowRight size={18} />}
            </button>

          </form>

          <footer className="mt-10 flex justify-center gap-6 text-sm text-slate-400">
            <button>Privacy Policy</button>
            <button>Terms</button>
            <button>Status</button>
          </footer>

        </div>

      </section>

    </div>
  );
};

export default Login;

