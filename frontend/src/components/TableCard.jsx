const statusStyles = {
  Available: "bg-slate-100 text-slate-700",
  Occupied: "bg-teal-100 text-teal-700",
  Reserved: "bg-amber-100 text-amber-700",
  Billing: "bg-orange-100 text-orange-700",
};

const TableCard = ({ table }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {table.tableName}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {table.seats} Seats
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusStyles[table.status]
            }`}
          >
            {table.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {table.status === "Reserved" ? (
          <>
            <p className="font-medium text-slate-700">
              {table.customerName || "Reserved Guest"}
            </p>

            <p className="text-sm text-slate-500 mt-2">
              {table.time || "No time specified"}
            </p>

            <button className="w-full mt-4 bg-amber-600 text-white py-2.5 rounded-lg hover:bg-amber-700 transition">
              Check In
            </button>
          </>
        ) : table.status === "Occupied" ? (
          <>
            <p className="text-sm text-slate-500">
              Currently serving guests
            </p>

            <button className="w-full mt-4 bg-teal-700 text-white py-2.5 rounded-lg hover:bg-teal-800 transition">
              View Table
            </button>
          </>
        ) : table.status === "Billing" ? (
          <>
            <p className="text-sm text-slate-500">
              Waiting for payment
            </p>

            <button className="w-full mt-4 bg-orange-600 text-white py-2.5 rounded-lg hover:bg-orange-700 transition">
              Complete Payment
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-500">
              Ready for guests
            </p>

            <button className="w-full mt-4 bg-slate-800 text-white py-2.5 rounded-lg hover:bg-slate-900 transition">
              Assign Table
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TableCard;