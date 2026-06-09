const ExpenseTable = ({
  expenses,
  getBadgeColor,
}) => {
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
                VENDOR / CATEGORY
              </th>

              <th className="text-left px-6 py-5">
                PAYMENT MODE
              </th>

              <th className="text-left px-6 py-5">
                AMOUNT
              </th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-5">
                  {new Date(
                    expense.date
                  ).toDateString()}
                </td>

                <td className="px-6 py-5">
                  <div>
                    <h3 className="font-semibold">
                      {expense.category}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {expense.vendor}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(
                      expense.paymentMode
                    )}`}
                  >
                    {expense.paymentMode}
                  </span>
                </td>

                <td className="px-6 py-5 font-bold">
                  ₹
                  {expense.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t">
        <p className="text-sm text-gray-500">
          Showing {expenses.length} entries
        </p>
      </div>
    </div>
  );
};

export default ExpenseTable;