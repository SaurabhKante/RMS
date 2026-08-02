import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {


const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");

  navigate("/");
};

  return (
    <section className="pt-6">
      <button
        onClick={handleLogout}
        className="w-full h-12 flex items-center justify-center gap-2 border-2 border-red-200 rounded-2xl text-red-600 font-semibold hover:bg-red-50 active:scale-[0.98] transition-all duration-200"
      >
        <LogOut size={20} />
        Logout
      </button>

      <p className="text-center mt-4 text-xs text-gray-400">
        App Version 2.4.1 (Stable)
      </p>
    </section>
  );
};

export default LogoutButton;