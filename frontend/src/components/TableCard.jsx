import { IndianRupee, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusStyles = {
  Available: "bg-slate-100 text-slate-700",
  Occupied: "bg-teal-100 text-teal-700",
  Reserved: "bg-amber-100 text-amber-700",
  Billing: "bg-orange-100 text-orange-700",
};

const TableCard = ({
  table,
  onEdit,
  onDelete,
}) => {

  const navigate = useNavigate();

  const handleTableClick = () => {
    navigate(`/dishes/${table.id}`);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">

      {/* Header */}
      <div className="border-b border-slate-100 p-5">

        <div className="flex items-start justify-between">

          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {table.name}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {table.seats} Seats
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              statusStyles[table.status]
            }`}
          >
            {table.status}
          </span>

        </div>

      </div>

      {/* Body */}
      <div className="p-5">

        {table.hasOrder ? (
          <>
            {/* Current Order Amount */}
            <div className="mt-1 flex items-center justify-between rounded-xl border border-teal-100 bg-teal-50 px-4 py-3">

              <div>
                <p className="text-xs text-slate-500">
                  Current Order
                </p>

                <div className="mt-1 flex items-center">
                  <IndianRupee
                    size={18}
                    className="text-teal-700"
                  />

                  <span className="text-xl font-bold text-teal-800">
                    {Number(table.orderAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="text-xs font-medium text-teal-700">
                Pending
              </div>

            </div>

            <p className="mt-4 text-sm text-slate-500">
              Currently serving guests
            </p>

            {/* View Table */}
            <button
              onClick={handleTableClick}
              className="mt-4 w-full rounded-lg bg-teal-700 py-2.5 font-semibold text-white transition hover:bg-teal-800"
            >
              View Table
            </button>

          </>
        ) : (
          <>
            <p className="text-sm text-slate-500">
              Ready for guests
            </p>

            {/* Assign Table */}
            <button
              onClick={handleTableClick}
              className="mt-4 w-full rounded-lg bg-slate-800 py-2.5 font-semibold text-white transition hover:bg-slate-900"
            >
              Assign Table
            </button>

            {/* Edit + Delete */}
            <div className="mt-3 grid grid-cols-2 gap-3">

              <button
                onClick={() => onEdit(table)}
                className="flex items-center justify-center gap-2 rounded-lg border border-teal-700 bg-white py-2.5 font-semibold text-teal-700 transition hover:bg-teal-50"
              >
                <Pencil size={17} />
                Edit
              </button>

              <button
                onClick={() => onDelete(table)}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 font-semibold text-white transition hover:bg-red-700"
              >
                <Trash2 size={17} />
                Delete
              </button>

            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default TableCard;