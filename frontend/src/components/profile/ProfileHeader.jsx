import { User, Mail, Phone } from "lucide-react";

const ProfileHeader = ({ user }) => {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-100 rounded-full opacity-50"></div>

      <div className="relative flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-teal-100 border-4 border-white shadow-md flex items-center justify-center">
            <User className="w-12 h-12 text-teal-800" />
          </div>

          {/* Role Badge */}
          <div className="absolute bottom-0 right-0 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border-2 border-white shadow">
            {user?.role || "USER"}
          </div>
        </div>

        {/* User Info */}
        <h2 className="text-2xl font-bold text-gray-800">
          {user?.fullName || "Loading..."}
        </h2>

        <div className="mt-3 space-y-2">

          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Mail size={18} />
            <span>{user?.email || "-"}</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Phone size={18} />
            <span>{user?.mobileNo || "-"}</span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;