import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  Plus,
  Wallet,
  Banknote,
  ReceiptText,
} from "lucide-react";

import ExpenseStatsCard from "../components/expense/ExpenseStatsCard";
import ExpenseFilters from "../components/expense/ExpenseFilters";
import ExpenseTable from "../components/expense/ExpenseTable";
import AddExpenseModal from "../components/expense/AddExpenseModal";
import EditExpenseModal from "../components/expense/EditExpenseModal";

import { BASE_URL } from "../constants/baseUrl";


// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


// Convert YYYY-MM-DD -> DD-MM-YYYY
const formatDateForApi = (date) => {
  if (!date) return "";

  const [year, month, day] = date.split("-");

  return `${day}-${month}-${year}`;
};


const Expenses = () => {

  const [showModal, setShowModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [vendors, setVendors] =
    useState([]);

  const [expenses, setExpenses] =
    useState([]);

  const [selectedExpense, setSelectedExpense] =
    useState(null);


  // -----------------------------
  // Date Filters
  // -----------------------------

  const [startDate, setStartDate] =
    useState(getTodayDate());

  const [endDate, setEndDate] =
    useState(getTodayDate());


  // -----------------------------
  // Summary
  // -----------------------------

  const [summary, setSummary] = useState({
    cashExpenses: 0,
    onlineExpenses: 0,
    totalExpenses: 0,
  });


  const [formData, setFormData] = useState({
    itemName: "",
    price: "",
    paymentMethod: "CASH",
    vendorId: "",
  });


  useEffect(() => {
    fetchVendors();

    // Get today's expenses initially
    fetchExpenses(
      getTodayDate(),
      getTodayDate()
    );
  }, []);


  const getToken = () => {
    return localStorage.getItem("token");
  };


  const getHeaders = () => {
    const token = getToken();

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };


  const fetchVendors = async () => {

    try {

      const response = await axios.get(
        `${BASE_URL}/vendor/v1/get-all-vendors`,
        {
          headers: getHeaders(),
        }
      );

      if (response.data?.success) {

        setVendors(
          response.data.data || []
        );

      }

    } catch (error) {

      console.error(
        "Error fetching vendors:",
        error
      );

      handleUnauthorized(error);
    }
  };


  const fetchExpenses = async (
    selectedStartDate,
    selectedEndDate
  ) => {

    try {

      setLoading(true);

      const payload = {
        startDate:
          formatDateForApi(
            selectedStartDate
          ),

        endDate:
          formatDateForApi(
            selectedEndDate
          ),
      };


      const response = await axios.post(
        `${BASE_URL}/inventory-item/v1/get-all`,
        payload,
        {
          headers: getHeaders(),
        }
      );


      if (response.data?.success) {

        const data =
          response.data.data;


        setExpenses(
          data?.inventoryItems || []
        );


        setSummary({
          cashExpenses:
            Number(
              data?.cashExpenses || 0
            ),

          onlineExpenses:
            Number(
              data?.onlineExpenses || 0
            ),

          totalExpenses:
            Number(
              data?.totalExpenses || 0
            ),
        });

      }

    } catch (error) {

      console.error(
        "Error fetching expenses:",
        error
      );

      handleUnauthorized(error);

    } finally {

      setLoading(false);

    }
  };


  const handleApplyFilter = () => {

    if (!startDate || !endDate) {

      alert(
        "Please select both start date and end date."
      );

      return;
    }


    if (startDate > endDate) {

      alert(
        "Start date cannot be greater than end date."
      );

      return;
    }


    fetchExpenses(
      startDate,
      endDate
    );
  };


  // -----------------------------
  // Form Change
  // -----------------------------

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // -----------------------------
  // Add Expense
  // -----------------------------

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!formData.itemName.trim()) {

      alert(
        "Please enter item name."
      );

      return;
    }


    if (
      !formData.price ||
      Number(formData.price) <= 0
    ) {

      alert(
        "Please enter a valid amount."
      );

      return;
    }


    if (!formData.vendorId) {

      alert(
        "Please select a vendor."
      );

      return;
    }


    try {

      setLoading(true);


      const payload = {

        itemName:
          formData.itemName.trim(),

        price:
          Number(formData.price),

        paymentMethod:
          formData.paymentMethod,

        vendorId:
          Number(formData.vendorId),
      };


      const response =
        await axios.post(
          `${BASE_URL}/inventory-item/v1/add`,
          payload,
          {
            headers: getHeaders(),
          }
        );


      if (response.data?.success) {
        setFormData({
          itemName: "",
          price: "",
          paymentMethod: "CASH",
          vendorId: "",
        });


        setShowModal(false);


        // Refresh current date range
        await fetchExpenses(
          startDate,
          endDate
        );
      }

    } catch (error) {

      console.error(
        "Error adding expense:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to add expense."
      );

      handleUnauthorized(error);

    } finally {

      setLoading(false);

    }
  };

  const handleEdit = (expense) => {

    setSelectedExpense(expense);

    setShowEditModal(true);
  };


  const handleUpdate = async (
    updatedData
  ) => {

    if (!selectedExpense) {
      return;
    }


    try {

      setLoading(true);


      const payload = {

        itemName:
          updatedData.itemName.trim(),

        price:
          Number(updatedData.price),

        paymentMethod:
          updatedData.paymentMethod,

        vendorId:
          Number(updatedData.vendorId),
      };


      const response =
        await axios.patch(
          `${BASE_URL}/inventory-item/v1/update/${selectedExpense.itemId}`,
          payload,
          {
            headers: getHeaders(),
          }
        );


      if (response.data?.success) {


        setShowEditModal(false);

        setSelectedExpense(null);


        // Refresh data
        await fetchExpenses(
          startDate,
          endDate
        );
      }

    } catch (error) {

      console.error(
        "Error updating expense:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update expense."
      );

      handleUnauthorized(error);

    } finally {

      setLoading(false);

    }
  };

  const handleDelete = async (
    expense
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${expense.itemName}"?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setLoading(true);


      const response =
        await axios.delete(
          `${BASE_URL}/inventory-item/v1/delete/${expense.itemId}`,
          {
            headers: getHeaders(),
          }
        );


      if (response.data?.success) {
        await fetchExpenses(
          startDate,
          endDate
        );
      }

    } catch (error) {

      console.error(
        "Error deleting expense:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete expense."
      );

      handleUnauthorized(error);

    } finally {

      setLoading(false);

    }
  };



  const filteredExpenses =
    useMemo(() => {

      const query =
        search
          .toLowerCase()
          .trim();


      if (!query) {
        return expenses;
      }


      return expenses.filter(
        (expense) =>
          expense.itemName
            ?.toLowerCase()
            .includes(query) ||

          expense.vendorName
            ?.toLowerCase()
            .includes(query)
      );

    }, [
      expenses,
      search,
    ]);


  return (
    <div className="p-6">


      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">

        <div>

          <h1 className="text-5xl font-bold text-teal-900">
            Expense Management
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor and track restaurant operational
            costs and vendor payments.
          </p>

        </div>


        <button
          onClick={() =>
            setShowModal(true)
          }
          className="
            bg-teal-900
            text-white
            px-5
            py-3
            rounded-xl
            flex
            items-center
            justify-center
            gap-2
            hover:bg-teal-800
            transition
          "
        >
          <Plus size={18} />

          Add Expense
        </button>

      </div>



      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8">

        <div className="flex flex-col lg:flex-row lg:items-end gap-4">

          {/* Start Date */}

          <div className="flex-1">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) =>
                setStartDate(
                  e.target.value
                )
              }
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-teal-700
              "
            />

          </div>


          {/* End Date */}

          <div className="flex-1">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              min={startDate}
              max={getTodayDate()}
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-teal-700
              "
            />

          </div>


          {/* Apply */}

          <button
            onClick={
              handleApplyFilter
            }
            disabled={loading}
            className="
              bg-teal-900
              text-white
              px-6
              py-3
              rounded-xl
              font-semibold
              hover:bg-teal-800
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
              whitespace-nowrap
            "
          >
            {loading
              ? "Loading..."
              : "Apply Filter"}
          </button>

        </div>

      </div>




      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <ExpenseStatsCard
          icon={Wallet}
          iconBg="bg-cyan-100"
          iconColor="text-cyan-700"
          title="Total Expenses"
          amount={
            summary.totalExpenses
          }
          subtitle="Selected Period"
        />


        <ExpenseStatsCard
          icon={Banknote}
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
          title="Cash Payments"
          amount={
            summary.cashExpenses
          }
          subtitle="Cashflow"
        />


        <ExpenseStatsCard
          icon={ReceiptText}
          iconBg="bg-red-100"
          iconColor="text-red-700"
          title="Online Payments"
          amount={
            summary.onlineExpenses
          }
          subtitle="UPI + Card"
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
        onEdit={handleEdit}
        onDelete={handleDelete}
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
        vendors={vendors}
        loading={loading}
      />

      <EditExpenseModal
        showModal={
          showEditModal
        }
        setShowModal={
          setShowEditModal
        }
        expense={
          selectedExpense
        }
        vendors={vendors}
        onUpdate={
          handleUpdate
        }
        loading={loading}
      />

    </div>
  );
};

export default Expenses;