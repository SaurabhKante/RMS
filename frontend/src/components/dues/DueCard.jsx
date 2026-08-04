import React from "react";

const DueCard = ({ customer, onSelect }) => {
  const getDueStatus = () => {
    const dueAmount = Number(customer.dueAmount || 0);

    const createdDate = new Date(customer.createdAt);
    const today = new Date();

    const differenceInTime =
      today.getTime() - createdDate.getTime();

    const differenceInDays = Math.floor(
      differenceInTime / (1000 * 60 * 60 * 24)
    );

    // Highest priority: very old due
    if (differenceInDays >= 7) {
      return {
        label: "Overdue",
        style: "bg-red-100 text-red-700",
      };
    }

    // High outstanding amount
    if (dueAmount >= 500) {
      return {
        label: "High Due",
        style: "bg-orange-100 text-orange-700",
      };
    }

    // Older than 3 days
    if (differenceInDays >= 3) {
      return {
        label: "Action Required",
        style: "bg-amber-100 text-amber-700",
      };
    }

    // Recent due
    return {
      label: "Pending",
      style: "bg-blue-100 text-blue-700",
    };
  };

  const status = getDueStatus();

  return (
    <div
      onClick={() => onSelect(customer)}
      className="group p-4 bg-white border border-gray-200 rounded-xl
      hover:shadow-lg transition-all cursor-pointer relative overflow-hidden
      flex flex-col justify-between min-h-[190px]"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full bg-teal-100
            flex items-center justify-center font-bold text-teal-800"
          >
            {customer.customerName?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              {customer.customerName}
            </h3>

            <p className="text-sm text-gray-500">
              {customer.mobileNumber}
            </p>
          </div>
        </div>

        {/* Dynamic Status */}
        <span
          className={`px-2 py-1 rounded-lg text-xs font-semibold ${status.style}`}
        >
          {status.label}
        </span>
      </div>

      {/* Amount Information */}
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase text-gray-500">
            Due Date
          </p>

          <p className="font-medium text-sm">
            {new Date(customer.createdAt).toLocaleDateString(
              "en-IN"
            )}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase text-gray-500">
            Due Amount
          </p>

          <p className="font-bold text-xl text-red-700">
            ₹{Number(customer.dueAmount).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Payment Progress */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Paid</span>

          <span>
            ₹{Number(customer.paidAmount).toFixed(2)} / ₹
            {Number(customer.totalAmount).toFixed(2)}
          </span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-700 rounded-full"
            style={{
              width: `${
                (Number(customer.paidAmount) /
                  Number(customer.totalAmount)) *
                100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Hover Bottom Line */}
      <div
        className="absolute bottom-0 left-0 h-1 w-0
        bg-teal-800 group-hover:w-full
        transition-all duration-300"
      />
    </div>
  );
};

export default DueCard;