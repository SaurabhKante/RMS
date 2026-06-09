import { useMemo, useState } from "react";

import {
  Plus,
  Wallet,
  Clock3,
  AlertTriangle,
  Banknote,
  BanknoteX,
  ReceiptText,
} from "lucide-react";

import ExpenseStatsCard from "../components/expense/ExpenseStatsCard";
import ExpenseFilters from "../components/expense/ExpenseFilters";
import ExpenseTable from "../components/expense/ExpenseTable";
import AddExpenseModal from "../components/expense/AddExpenseModal";

const Expenses = () => {
  const [showModal, setShowModal] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [expenses, setExpenses] =
    useState([
      {
        id: 1,
        date: "2026-06-07",
        category: "Milk",
        vendor: "Krishna Dairy",
        paymentMode: "Cash",
        amount: 50,
      },
    ]);

  const [formData, setFormData] =
    useState({
      category: "",
      vendor: "",
      amount: "",
      paymentMode: "Cash",
      date: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setExpenses([
      {
        id: Date.now(),
        ...formData,
        amount: Number(
          formData.amount
        ),
      },
      ...expenses,
    ]);

    setShowModal(false);
  };

  const filteredExpenses =
    expenses.filter(
      (expense) =>
        expense.category
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        expense.vendor
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const totalExpenses =
    useMemo(
      () =>
        expenses.reduce(
          (acc, item) =>
            acc + item.amount,
          0
        ),
      [expenses]
    );

  const cashPayments =
    expenses
      .filter(
        (e) =>
          e.paymentMode === "Cash"
      )
      .reduce(
        (a, b) => a + b.amount,
        0
      );

  const duePayments =
    expenses
      .filter(
        (e) =>
          e.paymentMode === "Due"
      )
      .reduce(
        (a, b) => a + b.amount,
        0
      );

  const getBadgeColor = (
    mode
  ) => {
    if (mode === "Cash")
      return "bg-green-100 text-green-700";

    if (mode === "Online")
      return "bg-blue-100 text-blue-700";

    return "bg-red-100 text-red-700";
  };

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-8">
  <div>
    <h1 className="text-5xl font-bold text-teal-900">
      Expense Management
    </h1>

    <p className="text-gray-500 mt-2">
      Monitor and track restaurant operational costs and vendor payments.
    </p>
  </div>

  <button
    onClick={() => setShowModal(true)}
    className="bg-teal-900 text-white px-5 py-3 rounded-xl flex items-center gap-2"
  >
    <Plus size={18} />
    Add Expense
  </button>
</div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <ExpenseStatsCard
          icon={Wallet}
          iconBg="bg-cyan-100"
          iconColor="text-cyan-700"
          title="Total Expenses"
          amount={totalExpenses}
          subtitle="This Month"
        />

        <ExpenseStatsCard
          icon={Banknote}
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
          title="Cash Payments"
          amount={cashPayments}
          subtitle="Cashflow"
        />

        <ExpenseStatsCard
          icon={ReceiptText}
          iconBg="bg-red-100"
          iconColor="text-red-700"
          title="Due Payments"
          amount={duePayments}
          subtitle="Liabilities"
        />
      </div>

      <ExpenseFilters
        search={search}
        setSearch={setSearch}
      />

      <ExpenseTable
        expenses={
          filteredExpenses
        }
        getBadgeColor={
          getBadgeColor
        }
      />

      <AddExpenseModal
        showModal={showModal}
        setShowModal={
          setShowModal
        }
        formData={formData}
        handleChange={
          handleChange
        }
        handleSubmit={
          handleSubmit
        }
      />
    </div>
  );
};

export default Expenses;