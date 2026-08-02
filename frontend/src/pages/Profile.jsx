import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPen, Users } from "lucide-react";

import ProfileHeader from "../components/profile/ProfileHeader";
import PreferenceCard from "../components/profile/PreferenceCard";
import LogoutButton from "../components/profile/LogoutButton";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserFromLocalStorage();
  }, []);

  const getUserFromLocalStorage = () => {
    try {
      const token = localStorage.getItem("token");

      // No token -> login page
      if (!token) {
        navigate("/login");
        return;
      }

      const userData = {
        userId: localStorage.getItem("userId"),
        fullName: localStorage.getItem("fullName"),
        email: localStorage.getItem("email"),
        role: localStorage.getItem("role"),
        mobileNo: localStorage.getItem("mobileNo"),
        token: token,
      };

      setUser(userData);

    } catch (error) {
      console.error("Error getting user data:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("fullName");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("mobileNo");

      navigate("/login");

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">

        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Preferences */}
        <section>

          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
            Preferences
          </h3>

          <div className="space-y-3">

            {/* Update Profile */}
            <PreferenceCard
              icon={UserPen}
              title="Update Profile"
              description="Personal information & preferences"
              onClick={() => navigate("/update-profile")}
            />

            {/* Admin Only */}
            {user?.role === "ADMIN" && (
              <PreferenceCard
                icon={Users}
                title="All Users"
                description="Manage users & permissions"
                badge="Restricted"
                onClick={() => navigate("/users")}
              />
            )}

          </div>

        </section>

        {/* Logout */}
        <LogoutButton />

      </main>

    </div>
  );
};

export default Profile;

