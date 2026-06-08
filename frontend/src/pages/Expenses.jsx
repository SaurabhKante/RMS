import React, { useMemo, useState } from "react";
import {
  Search,
  Bell,
  Settings,
  Plus,
  Wallet,
  Clock3,
  AlertTriangle,
} from "lucide-react";

const Expenses = () => {
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: "2026-06-07",
      category: "Milk",
      vendor: "Krishna Dairy",
      paymentMode: "Cash",
      amount: 50,
    },
    {
      id: 2,
      date: "2026-06-06",
      category: "Vegetables",
      vendor: "Local Market",
      paymentMode: "Online",
      amount: 3450,
    },
    {
      id: 3,
      date: "2026-06-05",
      category: "Electricity",
      vendor: "Power Corp",
      paymentMode: "Due",
      amount: 12400,
    },
    {
      id: 4,
      date: "2026-06-04",
      category: "Maintenance",
      vendor: "Kitchen Repair Co",
      paymentMode: "Cash",
      amount: 850,
    },
  ]);

  const [formData, setFormData] = useState({
    category: "",
    vendor: "",
    amount: "",
    paymentMode: "Cash",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newExpense = {
      id: Date.now(),
      ...formData,
      amount: Number(formData.amount),
    };

    setExpenses([newExpense, ...expenses]);

    setFormData({
      category: "",
      vendor: "",
      amount: "",
      paymentMode: "Cash",
      date: "",
    });

    setShowModal(false);
  };

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.category.toLowerCase().includes(search.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(search.toLowerCase())
  );

  const totalExpenses = useMemo(() => {
    return expenses.reduce((acc, item) => acc + item.amount, 0);
  }, [expenses]);

  const cashPayments = useMemo(() => {
    return expenses
      .filter((item) => item.paymentMode === "Cash")
      .reduce((acc, item) => acc + item.amount, 0);
  }, [expenses]);

  const duePayments = useMemo(() => {
    return expenses
      .filter((item) => item.paymentMode === "Due")
      .reduce((acc, item) => acc + item.amount, 0);
  }, [expenses]);

  const getBadgeColor = (mode) => {
    switch (mode) {
      case "Cash":
        return "bg-green-100 text-green-700";

      case "Online":
        return "bg-blue-100 text-blue-700";

      case "Due":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#f4f7fb]">
      {/* TOP NAVBAR */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          {/* <h1 className="text-3xl font-bold text-teal-900">
            Hotelix
          </h1> */}

          <div className="flex items-center bg-gray-100 border border-gray-200 px-4 py-2 rounded-lg w-[320px]">
            <Search size={18} className="text-gray-500" />

            <input
              type="text"
              placeholder="Quick Search..."
              className="bg-transparent outline-none ml-3 w-full"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5">
          <button className="text-teal-900 font-semibold">
            Branch Selector
          </button>

          <Bell
            size={20}
            className="text-gray-600 cursor-pointer"
          />

          <Settings
            size={20}
            className="text-gray-600 cursor-pointer"
          />

          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </header>

      {/* MAIN */}
      <main className="p-8">
        {/* PAGE HEADER */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-teal-900 mb-3">
              Expense Management
            </h1>

            <p className="text-gray-500 text-lg">
              Monitor and track restaurant operational costs and
              vendor payments.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-teal-900 hover:bg-teal-800 text-white px-6 py-4 rounded-xl flex items-center gap-3 font-semibold transition-all"
          >
            <Plus size={20} />
            Add Expense
          </button>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* CARD 1 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-5">
              <div className="bg-cyan-100 p-3 rounded-xl">
                <Wallet className="text-cyan-700" />
              </div>

              <span className="text-sm text-gray-500">
                This Month
              </span>
            </div>

            <p className="text-gray-500 mb-2">Total Expenses</p>

            <h2 className="text-4xl font-bold">
              ₹{totalExpenses.toLocaleString()}
            </h2>

            <p className="text-green-600 text-sm mt-4">
              ↗ 4.2% vs last month
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-5">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Clock3 className="text-orange-700" />
              </div>

              <span className="text-sm text-gray-500">
                Cashflow
              </span>
            </div>

            <p className="text-gray-500 mb-2">Cash Payments</p>

            <h2 className="text-4xl font-bold">
              ₹{cashPayments.toLocaleString()}
            </h2>

            <p className="text-green-600 text-sm mt-4">
              ↗ 4.2% vs last month
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-5">
              <div className="bg-red-100 p-3 rounded-xl">
                <AlertTriangle className="text-red-700" />
              </div>

              <span className="text-sm text-gray-500">
                Liabilities
              </span>
            </div>

            <p className="text-gray-500 mb-2">
              Online / Due Payments
            </p>

            <h2 className="text-4xl font-bold">
              ₹{duePayments.toLocaleString()}
            </h2>

            <p className="text-red-500 text-sm mt-4">
              ₹12,400 overdue this week
            </p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-wrap items-center gap-4 mb-8">
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none"
          />

          <input
            type="date"
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none"
          />

          <div className="flex items-center flex-1 border border-gray-300 rounded-lg px-4 py-3 min-w-[250px]">
            <Search size={18} className="text-gray-500" />

            <input
              type="text"
              placeholder="Search vendor or category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none ml-3 w-full"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#dfe8f6]">
                <tr>
                  <th className="text-left px-6 py-5 text-sm font-bold">
                    DATE
                  </th>

                  <th className="text-left px-6 py-5 text-sm font-bold">
                    VENDOR / CATEGORY
                  </th>

                  <th className="text-left px-6 py-5 text-sm font-bold">
                    PAYMENT MODE
                  </th>

                  <th className="text-left px-6 py-5 text-sm font-bold">
                    AMOUNT
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-5">
                      {new Date(expense.date).toDateString()}
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
                      ₹{expense.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {filteredExpenses.length} entries
            </p>

            <div className="flex gap-2">
              <button className="w-8 h-8 border border-gray-300 rounded-lg">
                {"<"}
              </button>

              <button className="w-8 h-8 bg-teal-900 text-white rounded-lg">
                1
              </button>

              <button className="w-8 h-8 border border-gray-300 rounded-lg">
                {">"}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Add New Expense
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="category"
                placeholder="Expense Category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
                required
              />

              <input
                type="text"
                name="vendor"
                placeholder="Vendor Name"
                value={formData.vendor}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
                required
              />

              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
                required
              />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
                required
              />

              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
              >
                <option value="Cash">Cash</option>

                <option value="Online">Online</option>

                <option value="Due">Due</option>
              </select>

              <div className="flex justify-end gap-4 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border border-gray-300 px-5 py-3 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-teal-900 text-white px-5 py-3 rounded-xl"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;