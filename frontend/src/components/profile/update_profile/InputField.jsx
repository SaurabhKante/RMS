import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium">
        {label}
      </label>

      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <Icon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}

        {/* Input */}
        <input
          type={isPassword && showPassword ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full h-12 rounded-xl border border-gray-300 bg-white transition-all
            focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700
            ${Icon ? "pl-12" : "pl-4"} ${isPassword ? "pr-12" : "pr-4"}`}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-800"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;