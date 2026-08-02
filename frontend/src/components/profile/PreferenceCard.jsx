import { ChevronRight } from "lucide-react";

const PreferenceCard = ({
  icon: Icon,
  title,
  description,
  badge,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md hover:bg-gray-50 active:scale-[0.98] transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
          <Icon size={22} className="text-teal-800" />
        </div>

        {/* Content */}
        <div className="text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-800">
              {title}
            </h3>

            {badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-green-100 text-green-700">
                {badge}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight
        size={20}
        className="text-gray-400 transition-transform duration-200 group-hover:translate-x-1"
      />
    </button>
  );
};

export default PreferenceCard;