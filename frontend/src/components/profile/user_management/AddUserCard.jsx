import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddUserCard = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/register")}
      className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-teal-800 hover:text-teal-800 hover:bg-teal-100 transition-all duration-200 group"
    >
      <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-teal-100 flex items-center justify-center transition">
        <UserPlus size={32} />
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold">
          Register New User
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Create a new staff or admin account
        </p>
      </div>
    </button>
  );
};

export default AddUserCard;