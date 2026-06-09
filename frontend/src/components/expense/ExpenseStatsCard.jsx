const ExpenseStatsCard = ({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  amount,
  subtitle,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex justify-between items-start mb-5">
        <div className={`${iconBg} p-3 rounded-xl`}>
          <Icon className={iconColor} />
        </div>

        <span className="text-sm text-gray-500">
          {subtitle}
        </span>
      </div>

      <p className="text-gray-500 mb-2">
        {title}
      </p>

      <h2 className="text-4xl font-bold">
        ₹{amount.toLocaleString()}
      </h2>
    </div>
  );
};

export default ExpenseStatsCard;