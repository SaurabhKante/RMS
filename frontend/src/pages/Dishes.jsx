import React, { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import { useAppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

import {
  Plus,
  Minus,
  Trash2,
  UtensilsCrossed,
  Receipt,
  Coins,
  CreditCard,
  Smartphone,
  Users,
  BookOpen,
  Sparkles,
  Calendar,
  IndianRupee,
  X,
  FileSpreadsheet,
} from "lucide-react";

const Dishes = () => {
  const {
    dishes,
    parentDishes,
    parentDishesLoading,
    fetchDishes,

    tables,
    tablesLoading,
    fetchTables,

    // Active Table
    activeCartTableId,
    setActiveCartTableId,

    // Pending Order
    pendingOrder,
    pendingOrderLoading,
    fetchPendingOrder,

    cartItems,
    addToCart,
    removeFromCart,
    adjustQuantity,
    clearCart,

    specialInstructions,
    setSpecialInstructions,

    discount,
    setDiscount,

    addOrderToTable,
    addDishToTableOrder,
    decreaseDishQuantity,
    removeDishFromTableOrder,
    processPayment,
  } = useAppContext();
  const { tableId } = useParams();

  const selectedTableId = tableId ? Number(tableId) : null;
  const Navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [menuSearch, setMenuSearch] = useState("");

  // Payment Modal
const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
const [transactionId, setTransactionId] = useState("");

// Payment mode
const [paymentMode, setPaymentMode] = useState("CASH");

// Split payments
const [splitPayments, setSplitPayments] = useState([
  {
    paymentMethod: "CASH",
    amount: "",
    transactionId: "",
  },
]);

// Due details
const [dueCustName, setDueCustName] = useState("");
const [dueCustContact, setDueCustContact] = useState("");

// Payment processing
const [paymentProcessing, setPaymentProcessing] = useState(false);

const resetPaymentState = () => {
  setPaymentMode("CASH");

  setSplitPayments([
    {
      paymentMethod: "CASH",
      amount: "",
      transactionId: "",
    },
  ]);

  setDueCustName("");
  setDueCustContact("");
  setPaymentProcessing(false);
};

const addSplitPayment = () => {
  setSplitPayments((prev) => [
    ...prev,
    {
      paymentMethod: "CASH",
      amount: "",
      transactionId: "",
    },
  ]);
};

const removeSplitPayment = (index) => {
  setSplitPayments((prev) =>
    prev.filter((_, i) => i !== index)
  );
};

const updateSplitPayment = (index, field, value) => {
  setSplitPayments((prev) =>
    prev.map((payment, i) =>
      i === index
        ? {
            ...payment,
            [field]: value,
          }
        : payment
    )
  );
};

const handlePaymentSubmit = async () => {
  if (!selectedTableId) {
    alert("Please select a table.");
    return;
  }

  if (cartItems.length === 0) {
    alert("There are no items in the order.");
    return;
  }

  const finalAmount = Number(finalTotal.toFixed(2));

  let payments = [];
  let dueDetails = null;

  // ------------------------------------
  // NORMAL PAYMENT
  // ------------------------------------
  if (paymentMode !== "SPLIT" && paymentMode !== "DUE") {
    const method = paymentMode;

    payments = [
      {
        paymentMethod: method,
        amount: finalAmount,
        ...(method === "UPI" || method === "CARD"
          ? {
              transactionId: "",
            }
          : {}),
      },
    ];
  }

  // ------------------------------------
  // DUE PAYMENT
  // ------------------------------------
  if (paymentMode === "DUE") {
    if (!dueCustName.trim()) {
      alert("Customer name is required.");
      return;
    }

    if (!dueCustContact.trim()) {
      alert("Customer mobile number is required.");
      return;
    }

    payments = [
      {
        paymentMethod: "DUE",
        amount: finalAmount,
      },
    ];

    dueDetails = {
      customerName: dueCustName.trim(),
      mobileNumber: dueCustContact.trim(),
    };
  }

  // ------------------------------------
  // SPLIT PAYMENT
  // ------------------------------------
  if (paymentMode === "SPLIT") {
    const validPayments = splitPayments.filter(
      (payment) => Number(payment.amount) > 0
    );

    if (validPayments.length === 0) {
      alert("Please add at least one payment.");
      return;
    }

    payments = validPayments.map((payment) => ({
      paymentMethod: payment.paymentMethod,
      amount: Number(payment.amount),

      ...(payment.paymentMethod === "UPI" ||
      payment.paymentMethod === "CARD"
        ? {
            transactionId: payment.transactionId?.trim() || "",
          }
        : {}),
    }));

    const totalPaid = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0
    );

    if (Math.abs(totalPaid - finalAmount) > 0.01) {
      alert(
        `Payment amount must equal ₹${finalAmount.toLocaleString(
          "en-IN",
          {
            minimumFractionDigits: 2,
          }
        )}. Current payment total is ₹${totalPaid.toLocaleString(
          "en-IN",
          {
            minimumFractionDigits: 2,
          }
        )}.`
      );

      return;
    }

    // If split payment contains DUE,
    // collect customer details.
    const hasDuePayment = payments.some(
      (payment) => payment.paymentMethod === "DUE"
    );

    if (hasDuePayment) {
      if (!dueCustName.trim()) {
        alert("Customer name is required for Due payment.");
        return;
      }

      if (!dueCustContact.trim()) {
        alert("Customer mobile number is required for Due payment.");
        return;
      }

      dueDetails = {
        customerName: dueCustName.trim(),
        mobileNumber: dueCustContact.trim(),
      };
    }
  }

  try {
    setPaymentProcessing(true);

    const result = await processPayment({
      tableId: selectedTableId,
      discount: Number(discount) || 0,
      payments,
      dueDetails,
    });

    if (!result || !result.success) {
      return;
    }

    const paymentData = result.data;

    // Close modal
    setIsSettleModalOpen(false);

    // Reset payment UI
    resetPaymentState();

    // Reset other local UI values
    clearCart();

    alert(
      `Payment of ₹${Number(
        paymentData.finalAmount
      ).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })} processed successfully.`
    );
  } finally {
    setPaymentProcessing(false);
  }
};

  const currentTable = tables.find(
    (table) => Number(table.tableId) === Number(activeCartTableId),
  );

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.dish.price * item.quantity,
    0,
  );
  // const taxPercent = 5; // CGST/SGST 5%
  // const taxAmount = parseFloat((subtotal * (taxPercent / 100)).toFixed(2));
  const finalTotal = parseFloat(
    Math.max(0, subtotal - discount).toFixed(2),
  );

  // Category Filtering
  const filteredDishes = dishes.filter((dish) => {
    const searchTerm = menuSearch.toLowerCase();

    return (
      dish.name.toLowerCase().includes(searchTerm) ||
      dish.description.toLowerCase().includes(searchTerm)
    );
  });

  const handleSettleConfirm = () => {
    if (cartItems.length === 0) return;

    // Add transaction to history
    addTransaction({
      tableNo: currentTable.name,
      amount: finalTotal,
      paymentMode: paymentMode,
      status: "Settled",
    });

    // Update table info
    addOrderToTable(
      currentTable.id,
      finalTotal,
      cartItems.reduce((sum, item) => sum + item.quantity, 0),
    );

    // Reset
    clearCart();
    setIsSettleModalOpen(false);
    alert(
      `Payment of ₹${finalTotal.toLocaleString("en-IN")} settled successfully via ${paymentMode}. Orders updated!`,
    );
  };

  const handleBookAsDue = (e) => {
    e.preventDefault();
    if (!dueCustName || !dueCustContact) {
      alert("Customer name and contact number are required.");
      return;
    }

    // Add to dues state
    addDue({
      customerName: dueCustName,
      contact: dueCustContact,
      tableRef: currentTable.name,
      dueAmount: finalTotal,
    });

    // Reset states
    setIsAddDueBooking(false);
    setIsSettleModalOpen(false);
    clearCart();

    alert(
      `Entire bill of ₹${finalTotal.toLocaleString("en-IN")} has been booked under ${dueCustName}'s due ledger. Table status updated.`,
    );
  };

  useEffect(() => {
    if (tablesLoading) return;

    if (tables.length === 0) return;

    // No tableId in URL -> select first table
    if (!tableId) {
      const firstTableId = tables[0].tableId;

      setActiveCartTableId(firstTableId);

      Navigate(`/dishes/${firstTableId}`, {
        replace: true,
      });

      return;
    }

    // Table ID exists in URL
    const currentTableId = Number(tableId);

    const tableExists = tables.some(
      (table) => Number(table.tableId) === currentTableId,
    );

    if (!tableExists) {
      const firstTableId = tables[0].tableId;

      setActiveCartTableId(firstTableId);

      Navigate(`/dishes/${firstTableId}`, {
        replace: true,
      });

      return;
    }

    setActiveCartTableId(currentTableId);
  }, [tableId, tables, tablesLoading, Navigate, setActiveCartTableId]);

  useEffect(() => {
    if (!selectedTableId) return;

    console.log("Fetching pending order for table:", selectedTableId);

    fetchPendingOrder(selectedTableId);
  }, [selectedTableId, fetchPendingOrder]);

  return (
    <>
      <DashboardHeader
        searchPlaceholder="Search Dishes"
        buttonText="Manage Dishes"
        onSearch={(value) => setMenuSearch(value)}
        onButtonClick={() => Navigate("/dishes/manage")}
      />

      {/* Dynamic Splits Page: Menu left, Cart right */}
      <div className="flex-grow flex flex-col xl:flex-row overflow-hidden">
        {/* LEFT SECTION: Interactive Grid of Dishes */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Table context setup */}
          <div className="bg-white p-4 rounded-xl border border-[#bfc8c9]/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0d5e65]/10 text-[#00454b] rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-sans font-bold text-sm text-[#0b1c30]">
                  Active Table: {currentTable?.tableName || "Loading..."}
                </h2>

                <p className="text-xs text-[#6f797a]">
                  Capacity: {currentTable?.seatCapacity || 0} guests
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-sans text-xs text-[#3f484a] font-medium">
                Switch Table:
              </span>

              <select
                id="table-session-selector"
                value={activeCartTableId ?? ""}
                onChange={(e) => {
                  const newTableId = Number(e.target.value);

                  console.log("Switching to table:", newTableId);

                  Navigate(`/dishes/${newTableId}`);
                }}
                disabled={tablesLoading}
                className="bg-white border border-[#bfc8c9] rounded-md px-3 py-1.5 font-sans text-xs text-[#0b1c30] font-semibold outline-none focus:border-[#00454b]"
              >
                {tables.map((table) => (
                  <option key={table.tableId} value={table.tableId}>
                    {table.tableName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Menu categories Sub Head tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1.5">
            {/* All */}
            <button
              onClick={() => {
                setActiveTab("all");
                fetchDishes();
              }}
              className={`px-4 py-2 font-sans text-xs font-extrabold rounded-full border transition-all ${
                activeTab === "all"
                  ? "bg-[#00454b] text-white border-[#00454b]"
                  : "bg-white text-[#3f484a] border-[#bfc8c9] hover:bg-gray-50"
              }`}
            >
              All
            </button>

            {/* Parent Categories */}
            {parentDishes.map((parent) => {
              const parentId = parent["Dish Id"];
              const parentName = parent["Dish Name"];

              return (
                <button
                  key={parentId}
                  onClick={() => {
                    setActiveTab(parentId);
                    fetchDishes(parentId);
                  }}
                  className={`px-4 py-2 font-sans text-xs font-extrabold rounded-full border transition-all ${
                    activeTab === parentId
                      ? "bg-[#00454b] text-white border-[#00454b]"
                      : "bg-white text-[#3f484a] border-[#bfc8c9] hover:bg-gray-50"
                  }`}
                >
                  {parentName}
                </button>
              );
            })}
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDishes.map((dish) => {
              const isSelected = cartItems.some(
                (item) => item.dish.id === dish.id,
              );
              return (
                <div
                  key={dish.id}
                  className={`bg-white rounded-xl border overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow relative ${
                    !dish.isAvailable ? "opacity-65" : ""
                  } ${isSelected ? "border-2 border-[#00454b]" : "border-[#bfc8c9]/40"}`}
                >
                  {!dish.isAvailable && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center">
                      <span className="bg-[#ba1a1a] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded tracking-widest shadow-sm">
                        SOLD OUT TODAY
                      </span>
                    </div>
                  )}

                  <div className="p-4 flex gap-4">
                    {/* Image Thumbnail */}
                    <div className="w-20 h-20 bg-[#eff4ff] border border-[#bfc8c9]/20 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={dish.image || "..."}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Content side */}
                    <div className="flex-grow space-y-1">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-sans font-bold text-sm text-[#0b1c30] line-clamp-1">
                          {dish.name}
                        </h4>
                        <span className="font-sans font-extrabold text-xs text-[#00454b] shrink-0">
                          ₹{dish.price}
                        </span>
                      </div>
                      <p className="font-sans text-[11px] text-[#6f797a] leading-normal line-clamp-2">
                        {dish.description}
                      </p>

                      {/* Tags list */}
                      {dish.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {dish.tags.map((t) => (
                            <span
                              key={t}
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                t === "Popular"
                                  ? "bg-[#ffebee] text-red-700"
                                  : t === "Vegetarian"
                                    ? "bg-[#e8f5e9] text-green-700"
                                    : "bg-[#0d5e65]/10 text-[#00454b]"
                              }`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Trigger Footer add button */}
                  <div className="p-3 bg-gray-50 border-t border-[#bfc8c9]/25 flex justify-end">
                    <button
                      onClick={async () => {
                        if (!selectedTableId) {
                          alert("Please select a table first.");
                          return;
                        }

                        console.log("Adding dish:", {
                          tableId: selectedTableId,
                          dishId: dish.id,
                          dishName: dish.name,
                        });

                        await addDishToTableOrder(selectedTableId, dish.id);
                      }}
                      disabled={!dish.isAvailable || !selectedTableId}
                      className="p-1 px-3 bg-[#0d5e65]/10 hover:bg-[#00454b] hover:text-white rounded-md text-[#00454b] font-sans text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add item
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* RIGHT PANEL: Current Booking Cart */}
        <section
          id="menu-current-booking-cart"
          className="w-full xl:w-[380px] bg-white border-t xl:border-t-0 xl:border-l border-[#bfc8c9] p-6 flex flex-col justify-between shrink-0"
        >
          <div className="flex-1 flex flex-col min-h-0 space-y-4">
            <div className="flex items-center justify-between border-b border-[#bfc8c9]/35 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="text-[#00454b] h-5 w-5" />

                <h3 className="font-sans font-bold text-sm text-[#0b1c30]">
                  Current Order
                </h3>

                {pendingOrderLoading && (
                  <span className="text-[10px] text-gray-500">Loading...</span>
                )}
              </div>

              <button
                onClick={clearCart}
                className="text-xs text-[#ba1a1a] hover:underline font-bold"
              >
                Clear Cart
              </button>
            </div>

            {/* Cart Items list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[350px] xl:max-h-none">
              {cartItems.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center text-[#bfc8c9]">
                  <UtensilsCrossed className="h-10 w-10 mb-2" />
                  <p className="text-xs text-[#6f797a]">Empty Basket</p>
                  <p className="text-[10px] text-[#bfc8c9] mt-0.5">
                    Add dishes from the menu to populate bill.
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.dish.id}
                    className="flex items-center justify-between p-3 bg-[#f8f9ff] border border-[#bfc8c9]/25 rounded-xl"
                  >
                    <div className="flex-grow max-w-[200px]">
                      <h5 className="font-sans font-bold text-xs text-[#0b1c30] truncate">
                        {item.dish.name}
                      </h5>
                      <p className="font-sans text-[11px] text-[#00454b] font-semibold mt-0.5">
                        ₹
                        {(item.dish.price * item.quantity).toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    </div>

                    {/* Quantity adjustment panel */}
                    <div className="flex items-center gap-2.5 bg-white p-1 rounded-lg border border-[#bfc8c9]/30 shrink-0">
                      <button
  onClick={async () => {
    if (!selectedTableId) {
      alert("Please select a table first.");
      return;
    }

    await adjustQuantity(
      selectedTableId,
      item.dish.id,
      -1
    );
  }}
  className="p-1 hover:bg-gray-100 rounded text-[#3f484a]"
>
  <Minus className="h-3 w-3" />
</button>
                      <span className="font-mono text-xs font-bold text-[#0b1c30] w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
  onClick={async () => {
    if (!selectedTableId) {
      alert("Please select a table first.");
      return;
    }

    await adjustQuantity(
      selectedTableId,
      item.dish.id,
      1
    );
  }}
  className="p-1 hover:bg-gray-100 rounded text-[#3f484a]"
>
  <Plus className="h-3 w-3" />
</button>
                    </div>

                    {/* Delete */}
                    <button
  onClick={async () => {
    if (!selectedTableId) {
      alert("Please select a table first.");
      return;
    }

    await removeDishFromTableOrder(
      selectedTableId,
      item.dish.id
    );
  }}
  className="p-1 text-red-500 hover:bg-red-50 rounded ml-1 transition-colors shrink-0"
>
  <Trash2 className="h-4 w-4" />
</button>
                  </div>
                ))
              )}
            </div>

            {/* Special instructions segment */}
            <div className="space-y-1 pb-3">
              <label className="block text-xs font-bold text-[#6f797a] uppercase">
                Special Instructions
              </label>
              <textarea
                id="checkout-special-instructions"
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Allergy warning, extra chilly, gluten-free base..."
                className="w-full px-3 py-2 bg-gray-50 border border-[#bfc8c9]/50 rounded-lg text-xs hover:border-[#bfc8c9] focus:bg-white outline-none font-sans"
              />
            </div>
          </div>

          {/* Calculations segment */}
          <div className="border-t border-[#bfc8c9]/40 pt-4 space-y-3 bg-white">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#6f797a]">
                <span>Subtotal</span>
                <span className="font-mono">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Discount field block */}
              <div className="flex justify-between items-center text-[#6f797a]">
                <span>Discount (₹)</span>
                <input
                  type="number"
                  value={discount || ""}
                  onChange={(e) =>
                    setDiscount(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-20 pl-2 pr-1 py-0.5 bg-gray-50 border border-[#bfc8c9]/50 rounded font-mono text-right text-xs text-[#0b1c30] outline-none"
                  placeholder="0"
                />
              </div>

              {/* <div className="flex justify-between text-[#6f797a]">
                <span>Tax (CGST & SGST 5%)</span>
                <span className="font-mono">
                  ₹{taxAmount.toLocaleString("en-IN")}
                </span>
              </div> */}

              <div className="h-[1px] bg-[#bfc8c9]/25 my-1"></div>

              <div className="flex justify-between text-base font-bold text-[#0b1c30]">
                <span>Total</span>
                <span className="font-mono text-[#00454b]">
                  ₹{finalTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              id="cart-payment-settle-trigger"
              onClick={() => {
                if (cartItems.length === 0) {
                  alert(
                    "Basket is empty. Select menu items before triggering settlement.",
                  );
                  return;
                }
                setIsSettleModalOpen(true);
              }}
              disabled={cartItems.length === 0}
              className="w-full py-3 bg-[#00454b] text-white hover:bg-[#0d5e65] font-sans text-sm font-bold rounded-lg transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Settle Payment
            </button>
          </div>
        </section>
      </div>

      {/* Payment Settlement Modal Dialog */}
      {isSettleModalOpen && (
  <div className="fixed inset-0 bg-[#0b1c30]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-xl border border-[#bfc8c9]/50">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-sans font-bold text-base text-[#0b1c30]">
            Settle Payment
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            {currentTable?.tableName || "Current Table"}
          </p>
        </div>

        <button
          onClick={() => {
            setIsSettleModalOpen(false);
            resetPaymentState();
          }}
          className="text-[#6f797a] hover:text-[#0b1c30]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Amount Summary */}
      <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#bfc8c9]/20 text-center mb-6">
        <p className="text-xs text-[#6f797a] font-bold uppercase tracking-wider">
          Amount Due
        </p>

        <h2 className="text-3xl font-extrabold text-[#00454b] mt-1 font-mono">
          ₹
          {finalTotal.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}
        </h2>

        {discount > 0 && (
          <p className="text-xs text-green-600 mt-1">
            Discount: ₹{Number(discount).toLocaleString("en-IN")}
          </p>
        )}
      </div>

      {/* Payment Methods */}
      <div className="space-y-2">
        <p className="font-sans text-xs font-bold text-[#6f797a] uppercase tracking-wide">
          Select Payment Method
        </p>

        <div className="grid grid-cols-2 gap-3">

          {/* CASH */}
          <button
            onClick={() => setPaymentMode("CASH")}
            className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all h-20 ${
              paymentMode === "CASH"
                ? "border-2 border-[#00454b] bg-[#dce9ff]/20"
                : "border-[#bfc8c9]/35 hover:bg-gray-50"
            }`}
          >
            <Coins className="h-5 w-5 text-[#00454b]" />

            <span className="font-sans text-xs font-bold text-[#0b1c30] mt-1">
              Cash
            </span>
          </button>

          {/* CARD */}
          <button
            onClick={() => setPaymentMode("CARD")}
            className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all h-20 ${
              paymentMode === "CARD"
                ? "border-2 border-[#00454b] bg-[#dce9ff]/20"
                : "border-[#bfc8c9]/35 hover:bg-gray-50"
            }`}
          >
            <CreditCard className="h-5 w-5 text-[#00454b]" />

            <span className="font-sans text-xs font-bold text-[#0b1c30] mt-1">
              Card
            </span>
          </button>

          {/* UPI */}
          <button
            onClick={() => setPaymentMode("UPI")}
            className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all h-20 ${
              paymentMode === "UPI"
                ? "border-2 border-[#00454b] bg-[#dce9ff]/20"
                : "border-[#bfc8c9]/35 hover:bg-gray-50"
            }`}
          >
            <Smartphone className="h-5 w-5 text-[#00454b]" />

            <span className="font-sans text-xs font-bold text-[#0b1c30] mt-1">
              UPI
            </span>
          </button>

          {/* SPLIT */}
          <button
            onClick={() => setPaymentMode("SPLIT")}
            className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all h-20 ${
              paymentMode === "SPLIT"
                ? "border-2 border-[#00454b] bg-[#dce9ff]/20"
                : "border-[#bfc8c9]/35 hover:bg-gray-50"
            }`}
          >
            <Receipt className="h-5 w-5 text-[#00454b]" />

            <span className="font-sans text-xs font-bold text-[#0b1c30] mt-1">
              Split Bill
            </span>
          </button>

          {/* DUE */}
          <button
            onClick={() => setPaymentMode("DUE")}
            className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all h-20 col-span-2 ${
              paymentMode === "DUE"
                ? "border-2 border-[#9d4300] bg-orange-50"
                : "border-[#bfc8c9]/35 hover:bg-gray-50"
            }`}
          >
            <BookOpen className="h-5 w-5 text-[#9d4300]" />

            <span className="font-sans text-xs font-bold text-[#0b1c30] mt-1">
              Customer Due
            </span>
          </button>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* CARD / UPI TRANSACTION ID */}
      {/* -------------------------------- */}

      {(paymentMode === "CARD" ||
        paymentMode === "UPI") && (
        <div className="mt-5 space-y-2">
          <label className="block text-xs font-bold text-[#6f797a] uppercase">
            Transaction ID
          </label>

          <input
            type="text"
            value={splitPayments[0]?.transactionId || ""}
            onChange={(e) => {
              setSplitPayments([
                {
                  paymentMethod: paymentMode,
                  amount: finalTotal,
                  transactionId: e.target.value,
                },
              ]);
            }}
            placeholder="Enter transaction ID"
            className="w-full px-3 py-2 bg-gray-50 border border-[#bfc8c9]/50 rounded-lg text-sm outline-none focus:bg-white"
          />
        </div>
      )}

      {/* -------------------------------- */}
      {/* SPLIT PAYMENT SECTION */}
      {/* -------------------------------- */}

      {paymentMode === "SPLIT" && (
        <div className="mt-5 space-y-4">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#6f797a] uppercase">
                Split Payments
              </p>

              <p className="text-[11px] text-gray-500 mt-1">
                Total required: ₹
                {finalTotal.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            <button
              type="button"
              onClick={addSplitPayment}
              className="text-xs font-bold text-[#00454b] hover:underline"
            >
              + Add Payment
            </button>
          </div>

          {splitPayments.map((payment, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 border border-[#bfc8c9]/40 rounded-lg space-y-3"
            >

              <div className="flex items-center gap-2">

                {/* Payment Method */}
                <select
                  value={payment.paymentMethod}
                  onChange={(e) =>
                    updateSplitPayment(
                      index,
                      "paymentMethod",
                      e.target.value
                    )
                  }
                  className="flex-1 px-2 py-2 bg-white border border-[#bfc8c9] rounded-md text-xs outline-none"
                >
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="CARD">Card</option>
                  <option value="DUE">Due</option>
                </select>

                {/* Amount */}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={payment.amount}
                  onChange={(e) =>
                    updateSplitPayment(
                      index,
                      "amount",
                      e.target.value
                    )
                  }
                  placeholder="Amount"
                  className="w-28 px-2 py-2 bg-white border border-[#bfc8c9] rounded-md text-xs outline-none text-right"
                />

                {/* Remove */}
                {splitPayments.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeSplitPayment(index)
                    }
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Transaction ID */}
              {(payment.paymentMethod === "UPI" ||
                payment.paymentMethod === "CARD") && (
                <input
                  type="text"
                  value={payment.transactionId}
                  onChange={(e) =>
                    updateSplitPayment(
                      index,
                      "transactionId",
                      e.target.value
                    )
                  }
                  placeholder="Transaction ID"
                  className="w-full px-3 py-2 bg-white border border-[#bfc8c9] rounded-md text-xs outline-none"
                />
              )}

              {/* Due customer details */}
              {payment.paymentMethod === "DUE" && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={dueCustName}
                    onChange={(e) =>
                      setDueCustName(e.target.value)
                    }
                    placeholder="Customer name"
                    className="w-full px-3 py-2 bg-white border border-[#bfc8c9] rounded-md text-xs outline-none"
                  />

                  <input
                    type="text"
                    value={dueCustContact}
                    onChange={(e) =>
                      setDueCustContact(e.target.value)
                    }
                    placeholder="Customer mobile number"
                    className="w-full px-3 py-2 bg-white border border-[#bfc8c9] rounded-md text-xs outline-none"
                  />
                </div>
              )}
            </div>
          ))}

          {/* Split Total */}
          <div className="flex justify-between items-center p-3 rounded-lg bg-[#00454b]/5 border border-[#00454b]/20">
            <span className="text-xs font-bold text-[#3f484a]">
              Split Total
            </span>

            <span
              className={`text-sm font-bold ${
                Math.abs(
                  splitPayments.reduce(
                    (sum, payment) =>
                      sum + (Number(payment.amount) || 0),
                    0
                  ) - finalTotal
                ) < 0.01
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              ₹
              {splitPayments
                .reduce(
                  (sum, payment) =>
                    sum + (Number(payment.amount) || 0),
                  0
                )
                .toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
            </span>
          </div>
        </div>
      )}

      {/* -------------------------------- */}
      {/* DUE CUSTOMER DETAILS */}
      {/* -------------------------------- */}

      {paymentMode === "DUE" && (
        <div className="mt-5 p-4 bg-orange-50 border border-orange-200 rounded-lg space-y-3">

          <p className="text-xs text-orange-900 font-bold">
            Customer Due Details
          </p>

          <input
            type="text"
            value={dueCustName}
            onChange={(e) =>
              setDueCustName(e.target.value)
            }
            placeholder="Customer name"
            className="w-full px-3 py-2 bg-white border border-orange-200 rounded-lg text-sm outline-none"
          />

          <input
            type="text"
            value={dueCustContact}
            onChange={(e) =>
              setDueCustContact(e.target.value)
            }
            placeholder="Customer mobile number"
            className="w-full px-3 py-2 bg-white border border-orange-200 rounded-lg text-sm outline-none"
          />
        </div>
      )}

      {/* -------------------------------- */}
      {/* ACTIONS */}
      {/* -------------------------------- */}

      <div className="h-[1px] bg-[#bfc8c9]/30 my-6"></div>

      <div className="flex flex-col gap-3">

        <button
          onClick={handlePaymentSubmit}
          disabled={paymentProcessing}
          className="w-full py-3 bg-[#0d5e65] text-white hover:bg-[#00454b] font-sans text-xs font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {paymentProcessing
            ? "Processing Payment..."
            : "Confirm Payment"}
        </button>

        <button
          onClick={() => {
            setIsSettleModalOpen(false);
            resetPaymentState();
          }}
          disabled={paymentProcessing}
          className="w-full py-3 border border-[#bfc8c9] text-[#3f484a] hover:bg-gray-50 font-sans text-xs font-bold rounded-lg transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default Dishes;
