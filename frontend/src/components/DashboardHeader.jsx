import {
  Search,
  Bell,
  Plus,
  User,
} from "lucide-react";

const DashboardHeader = ({
  searchPlaceholder = "Search...",
  buttonText = "Add New",
  onSearch,
  onButtonClick,
}) => {
  return (
    <header className="flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200 sticky top-0 z-30">

      {/* Search */}
      <div className="flex items-center">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch?.(e.target.value)}
            className="
              w-72
              pl-10
              pr-4
              py-2
              rounded-xl
              bg-gray-100
              outline-none
              focus:ring-2
              focus:ring-teal-700
            "
          />
        </div>
      </div>


      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* {location.pathname === '/dishes/manage' && (
        <button onClick={() => navigate('/dishes')} className="px-4 py-2 bg-teal-800 text-white rounded-lg text-md font-semibold hover:bg-[#00363a] transition-colors">
          Back to Menu
        </button>
      )} */}

        {/* Action Button */}
        <button
          onClick={onButtonClick}
          className="
            flex items-center gap-2
            bg-teal-800
            text-white
            px-4
            py-2
            rounded-xl
            hover:bg-teal-900
            transition
          "
        >
          <Plus size={18} />
          <span>{buttonText}</span>
        </button>


        {/* Profile */}
        <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
        <User size={20} />
        </div>

      </div>
    </header>
  );
};

export default DashboardHeader;