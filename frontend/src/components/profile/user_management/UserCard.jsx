import { Trash2, Shield, Phone, Mail } from "lucide-react";

const UserCard = ({
  user,
  onDelete,
  onChangeRole,
}) => {
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      {/* User Details */}
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {user.fullName}
            </h2>

            
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isAdmin
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {user.role}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={17} />
            <span>{user.mobileNo}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 break-all">
            <Mail size={17} />
            <span>{user.email}</span>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex gap-3 pt-5 mt-5 border-t border-gray-200">
        {/* Change Role */}
        <button
          onClick={() => onChangeRole(user)}
          className="flex-1 h-12 rounded-xl bg-teal-100 text-teal-800 hover:bg-teal-200 transition flex items-center justify-center gap-2 font-medium"
        >
          <Shield size={18} />
          Change Role
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(user)}
          className="w-12 h-12 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition flex items-center justify-center"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default UserCard;