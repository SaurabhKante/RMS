import React from "react";

const DueCard = ({ customer, onSelect }) => {
  const getStatusStyle = () => {
    switch (customer.status) {
      case "Overdue":
        return "bg-red-100 text-red-700";

      case "Pending":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  return (
    <div
      onClick={() => onSelect(customer)}
      className="group p-4 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[170px]"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-800">
            {customer.name.charAt(0)}
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              {customer.name}
            </h3>

            <p className="text-sm text-gray-500">
              {customer.mobile}
            </p>
          </div>
        </div>

        <span
          className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusStyle()}`}
        >
          {customer.status}
        </span>
      </div>

      <div className="mt-5 flex justify-between">
        <div>
          <p className="text-xs uppercase text-gray-500">
            Due Date
          </p>

          <p className="font-medium">{customer.dueDate}</p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase text-gray-500">
            Amount
          </p>

          <p className="font-bold text-xl text-teal-900">
            ₹{customer.amount}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-teal-800 group-hover:w-full transition-all duration-300" />
    </div>
  );
};

export default DueCard;