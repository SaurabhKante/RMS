const AnalyticsCard = ({
  icon: Icon,
  amount,
  title,
  bgColor = "bg-white",
  textColor = "text-slate-900",
  iconColor = "text-teal-800",
}) => {
  return (
    <div
      className={`
        ${bgColor}
        p-6
        rounded-xl
        border
        border-gray-200
        flex
        flex-col
        items-center
        justify-center
        text-center
        hover:-translate-y-1
        transition-all
      `}
    >
      <Icon
        className={`${iconColor} mb-3`}
        size={28}
      />

      <h3
        className={`text-3xl font-bold ${textColor}`}
      >
        ₹{" "}
        {Number(amount || 0).toLocaleString("en-IN")}
      </h3>

      <p className="uppercase text-xs tracking-wider text-gray-500 mt-2">
        {title}
      </p>
    </div>
  );
};

export default AnalyticsCard;