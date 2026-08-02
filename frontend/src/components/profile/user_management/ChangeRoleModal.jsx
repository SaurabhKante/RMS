import { useState, useEffect } from "react";
import { ShieldCheck, User, Check } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../constants/baseUrl";

const ChangeRoleModal = ({
  isOpen,
  onClose,
  selectedUser,
  onSuccess,
}) => {
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setRole(selectedUser.role);
    }
  }, [selectedUser]);

  if (!isOpen || !selectedUser) return null;

  const handleUpdateRole = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.patch(
        `${BASE_URL}/user/v1/change-role/${selectedUser.userId}`,
        {
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Role updated successfully.");

      onClose();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.MESSAGE ||
          "Failed to update user role."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900">
          Change Role
        </h2>

        <p className="text-gray-500 mt-2">
          Select a role for{" "}
          <span className="font-semibold text-gray-800">
            {selectedUser.fullName}
          </span>
        </p>

        {/* ADMIN */}
        <button
          onClick={() => setRole("ADMIN")}
          className={`w-full mt-6 border rounded-2xl p-4 flex justify-between items-center transition ${
            role === "ADMIN"
              ? "border-teal-800 bg-teal-50"
              : "border-gray-200 hover:border-teal-300"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <ShieldCheck className="text-teal-800" size={22} />
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-gray-900">
                ADMIN
              </h3>

              <p className="text-sm text-gray-500">
                Full system access
              </p>
            </div>
          </div>

          {role === "ADMIN" && (
            <Check className="text-teal-800" size={22} />
          )}
        </button>

        {/* USER */}
        <button
          onClick={() => setRole("USER")}
          className={`w-full mt-4 border rounded-2xl p-4 flex justify-between items-center transition ${
            role === "USER"
              ? "border-teal-800 bg-teal-50"
              : "border-gray-200 hover:border-teal-300"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-3 rounded-full">
              <User className="text-gray-700" size={22} />
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-gray-900">
                USER
              </h3>

              <p className="text-sm text-gray-500">
                Regular application access
              </p>
            </div>
          </div>

          {role === "USER" && (
            <Check className="text-teal-800" size={22} />
          )}
        </button>

        {/* Footer */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-12 rounded-xl border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdateRole}
            disabled={loading}
            className="flex-1 h-12 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-semibold transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Role"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeRoleModal;