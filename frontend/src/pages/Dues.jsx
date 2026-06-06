// const Dues = () => {
//   return <h1 className="text-2xl font-bold">Dues Page</h1>;
// };

// export default Dues;

import { useState } from "react";
import PaymentModal from "../components/PaymentModal";
import AddDueModal from "../components/AddDueModal";
import DashboardHeader from "../components/DashboardHeader";

const Dues = () => {
  const [search, setSearch] = useState("");
 
const handleAddDue = (newDue) => {
  setDues((prev) => [
    ...prev,
    {
      id: Date.now(),
      ...newDue,
    },
  ]);
};
  const handleSavePayment = (payment) => {
  console.log(payment);

  // Later:
  // API call
  // Update dues list
};
  const [dues, setDues] = useState([
  {
    id: 1,
    customerName: "Miller Party",
    phone: "9876543210",
    table: "Table 08",
    amount: 2450,
    dueDate: "2025-08-15",
    status: "Pending",
  },
]);
const [isModalOpen, setIsModalOpen] = useState(false);
const totalOutstanding = dues.reduce(
  (sum, due) => sum + due.amount,
  0
);

const pendingCount = dues.filter(
  (due) => due.status === "Pending"
).length;

const overdueCount = dues.filter(
  (due) => due.status === "Overdue"
).length;

  const filteredDues = dues.filter(
  (due) =>
    due.customerName
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    due.table
      .toLowerCase()
      .includes(search.toLowerCase())
);

  return (
    <>
     <DashboardHeader
  searchPlaceholder="Search dues..."
  buttonText="Add Due"
  onSearch={setSearch}
  onButtonClick={() => setIsModalOpen(true)}
/>

      <main className="p-6">
        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
  <div className="bg-white rounded-2xl border p-6">
    <p className="text-slate-500 text-sm">
      Total Outstanding
    </p>

    <h2 className="text-3xl font-bold mt-2">
      ₹{totalOutstanding.toLocaleString("en-IN")}
    </h2>
  </div>

  <div className="bg-white rounded-2xl border p-6">
    <p className="text-slate-500 text-sm">
      Pending Dues
    </p>

    <h2 className="text-3xl font-bold mt-2">
      {pendingCount}
    </h2>
  </div>

  <div className="bg-white rounded-2xl border p-6">
    <p className="text-slate-500 text-sm">
      Overdue
    </p>

    <h2 className="text-3xl font-bold mt-2">
      {overdueCount}
    </h2>
  </div>
</div>
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Customer Dues
          </h2>

          <p className="text-slate-500">
            Track pending and overdue payments
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  Customer
                </th>
                <th className="px-6 py-4 text-left">
                Phone
                </th>
                <th className="px-6 py-4 text-left">
                  Table
                </th>

                <th className="px-6 py-4 text-left">
                  Amount
                </th>

                <th className="px-6 py-4 text-left">
                  Due Date
                </th>

                <th className="px-6 py-4 text-left">
                  Status
                </th>

                <th className="px-6 py-4 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredDues.map((due) => (
                <tr
                  key={due.id}
                  className="border-t"
                >
                  <td className="px-6 py-4 font-medium">
                  {due.customerName}
                    </td>
                  <td className="px-6 py-4">
                    {due.phone}
                  </td>
                  <td className="px-6 py-4">
                    {due.table}
                  </td>

                  <td className="px-6 py-4 font-medium">
                  ₹{due.amount.toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4">
                    {due.dueDate}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${due.status === "Overdue"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                        }`}
                    >
                      {due.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button className="rounded-lg bg-teal-700 px-4 py-2 text-white hover:bg-teal-800">
                      Collect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <AddDueModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSave={handleAddDue}
/>
    </>
  );
};

export default Dues;