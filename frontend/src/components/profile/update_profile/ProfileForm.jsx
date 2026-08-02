import { useState } from "react";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";

const ProfileForm = ({
  formData,
  setFormData,
  onSubmit,
  loading,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Full Name */}
      <div>
        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
          Full Name
        </label>

        <div className="relative">
          <User
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
        </div>
      </div>

      {/* Mobile */}
      <div>
        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
          Mobile Number
        </label>

        <div className="relative">
          <Phone
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter mobile number"
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
        </div>
      </div>

      {/* Email */}
      {/* <div>
        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
          Email Address
        </label>

        <div className="relative">
          <Mail
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
        </div>
      </div> */}

      {/* Password */}
      <div>
        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
          New Password
        </label>

        <div className="relative">
          <Lock
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
            className="w-full h-12 pl-12 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 mt-4 rounded-xl bg-teal-700 text-white font-semibold hover:bg-teal-800 transition disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default ProfileForm;