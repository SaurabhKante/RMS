import {
  Pencil,
  Trash2,
} from "lucide-react";

const ExpenseTable = ({
  expenses,
  onEdit,
  onDelete,
}) => {

  const getBadgeColor = (paymentMethod) => {
    switch (paymentMethod) {
      case "CASH":
        return "bg-green-100 text-green-700";

      case "UPI":
        return "bg-blue-100 text-blue-700";

      case "CARD":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatPaymentMethod = (method) => {
    if (method === "UPI") return "UPI";
    if (method === "CARD") return "Card";
    if (method === "CASH") return "Cash";

    return method;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(
      dateString.replace(" ", "T")
    );

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-[#dfe8f6]">

            <tr>

              <th className="text-left px-6 py-5">
                DATE
              </th>

              <th className="text-left px-6 py-5">
                ITEM
              </th>

              <th className="text-left px-6 py-5">
                VENDOR
              </th>

              <th className="text-left px-6 py-5">
                PAYMENT MODE
              </th>

              <th className="text-left px-6 py-5">
                AMOUNT
              </th>

              <th className="text-center px-6 py-5">
                ACTIONS
              </th>

            </tr>

          </thead>

          <tbody>

            {expenses.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No expenses found.
                </td>

              </tr>

            ) : (

              expenses.map((expense) => (

                <tr
                  key={expense.itemId}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >

                  {/* Date */}
                  <td className="px-6 py-5 whitespace-nowrap">
                    {formatDate(expense.createdAt)}
                  </td>

                  {/* Item */}
                  <td className="px-6 py-5">
                    <h3 className="font-semibold text-gray-800">
                      {expense.itemName}
                    </h3>
                  </td>

                  {/* Vendor */}
                  <td className="px-6 py-5">

                    <p className="font-medium text-gray-700">
                      {expense.vendorName || "N/A"}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Vendor ID: {expense.vendorId}
                    </p>

                  </td>

                  {/* Payment */}
                  <td className="px-6 py-5">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(
                        expense.paymentMethod
                      )}`}
                    >
                      {formatPaymentMethod(
                        expense.paymentMethod
                      )}
                    </span>

                  </td>

                  {/* Amount */}
                  <td className="px-6 py-5 font-bold whitespace-nowrap">
                    ₹
                    {Number(
                      expense.price || 0
                    ).toLocaleString("en-IN")}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5">

                    <div className="flex items-center justify-center gap-2">

                      <button
                        onClick={() =>
                          onEdit?.(expense)
                        }
                        title="Edit Expense"
                        className="
                          flex items-center justify-center
                          w-9 h-9
                          rounded-lg
                          bg-blue-50
                          text-blue-700
                          hover:bg-blue-100
                          transition
                        "
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() =>
                          onDelete?.(expense)
                        }
                        title="Delete Expense"
                        className="
                          flex items-center justify-center
                          w-9 h-9
                          rounded-lg
                          bg-red-50
                          text-red-700
                          hover:bg-red-100
                          transition
                        "
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t">

        <p className="text-sm text-gray-500">
          Showing {expenses.length} entries
        </p>

      </div>

    </div>
  );
};

export default ExpenseTable;