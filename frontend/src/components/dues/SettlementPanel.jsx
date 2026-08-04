import React, { useEffect, useState } from "react";
import {
  X,
  CreditCard,
  Wallet,
  Landmark,
} from "lucide-react";

const SettlementPanel = ({
  selectedCustomer,
  onClose,
  onPayment,
  loading = false,
}) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("UPI");

  const [transactionId, setTransactionId] =
    useState("");

  // Reset values whenever customer changes
  useEffect(() => {
    if (selectedCustomer) {
      setAmount(selectedCustomer.dueAmount || "");
      setPaymentMethod("UPI");
      setTransactionId("");
    }
  }, [selectedCustomer]);

  if (!selectedCustomer) {
    return null;
  }

  const dueAmount = Number(
    selectedCustomer.dueAmount || 0
  );

  const handleSubmit = async () => {
    const paymentAmount = Number(amount);

    if (!paymentAmount || paymentAmount <= 0) {
      alert("Payment amount must be greater than 0.");
      return;
    }

    if (paymentAmount > dueAmount) {
      alert(
        `Payment amount cannot exceed ₹${dueAmount.toFixed(
          2
        )}.`
      );
      return;
    }


    await onPayment({
      customer: selectedCustomer,
      amount: paymentAmount,
      paymentMethod,
      transactionId,
    });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={loading ? undefined : onClose}
      />

      {/* Panel */}
      <div className="
        fixed
        right-0
        top-0
        h-full
        w-[400px]
        max-w-full
        bg-white
        shadow-2xl
        z-50
        flex
        flex-col
      ">

        {/* Header */}
        <div className="
          p-4
          border-b
          flex
          justify-between
          items-center
        ">
          <h2 className="text-xl font-bold">
            Settle Due
          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="
              p-2
              rounded-lg
              hover:bg-gray-100
              disabled:opacity-50
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">

          {/* Customer Details */}
          <div className="
            bg-gray-50
            border
            rounded-xl
            p-4
            mb-6
          ">

            <p className="text-sm text-gray-500">
              CUSTOMER
            </p>

            <h3 className="text-xl font-bold">
              {selectedCustomer.customerName}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {selectedCustomer.mobileNumber}
            </p>

            <div className="mt-5 space-y-2">

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Total Amount
                </span>

                <span className="font-semibold">
                  ₹
                  {Number(
                    selectedCustomer.totalAmount
                  ).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Paid Amount
                </span>

                <span className="font-semibold text-green-700">
                  ₹
                  {Number(
                    selectedCustomer.paidAmount
                  ).toFixed(2)}
                </span>
              </div>

              <div className="
                border-t
                pt-2
                flex
                justify-between
              ">
                <span className="font-medium">
                  Outstanding
                </span>

                <span className="
                  font-bold
                  text-xl
                  text-teal-900
                ">
                  ₹{dueAmount.toFixed(2)}
                </span>
              </div>

            </div>
          </div>

          {/* Settlement Amount */}
          <div className="mb-6">

            <label className="
              block
              text-sm
              font-medium
              mb-2
            ">
              Settlement Amount
            </label>

            <div className="relative">

              <span className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-500
              ">
                ₹
              </span>

              <input
                type="number"
                min="1"
                max={dueAmount}
                step="0.01"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                className="
                  w-full
                  border
                  rounded-xl
                  pl-9
                  pr-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-teal-700
                "
              />

            </div>

            <div className="
              flex
              justify-between
              mt-2
              text-xs
              text-gray-500
            ">
              <span>
                Maximum payable
              </span>

              <span>
                ₹{dueAmount.toFixed(2)}
              </span>
            </div>

          </div>

          {/* Payment Method */}
          <div className="mb-6">

            <label className="
              block
              text-sm
              font-medium
              mb-3
            ">
              Payment Method
            </label>

            <div className="grid grid-cols-3 gap-3">

              {[
                {
                  name: "CASH",
                  label: "Cash",
                  icon: <Wallet size={18} />,
                },
                {
                  name: "CARD",
                  label: "Card",
                  icon: <CreditCard size={18} />,
                },
                {
                  name: "UPI",
                  label: "UPI",
                  icon: <Landmark size={18} />,
                },
              ].map((item) => (

                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(item.name);
                    setTransactionId("");
                  }}
                  disabled={loading}
                  className={`
                    border
                    rounded-xl
                    p-3
                    flex
                    flex-col
                    items-center
                    gap-2
                    transition
                    ${
                      paymentMethod === item.name
                        ? "border-teal-800 bg-teal-50 text-teal-800"
                        : "border-gray-200 hover:bg-gray-50"
                    }
                  `}
                >
                  {item.icon}

                  <span className="text-sm">
                    {item.label}
                  </span>
                </button>

              ))}

            </div>

          </div>

          {/* Transaction ID */}
          {(paymentMethod === "UPI" ||
            paymentMethod === "CARD") && (
            <div className="mb-6">

              <label className="
                block
                text-sm
                font-medium
                mb-2
              ">
                Transaction ID
              </label>

              <input
                type="text"
                value={transactionId}
                onChange={(e) =>
                  setTransactionId(e.target.value)
                }
                placeholder="Enter transaction ID"
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-teal-700
                "
              />

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t">

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              w-full
              bg-teal-900
              hover:bg-teal-800
              disabled:bg-teal-600
              disabled:cursor-not-allowed
              text-white
              py-3
              rounded-xl
              font-semibold
              transition
            "
          >
            {loading
              ? "Processing Payment..."
              : `Pay ₹${Number(amount || 0).toFixed(2)}`}
          </button>

        </div>

      </div>
    </>
  );
};

export default SettlementPanel;

