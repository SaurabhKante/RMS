import React, { useState } from "react";
import {
  X,
  CreditCard,
  Wallet,
  Landmark,
} from "lucide-react";

const SettlementPanel = ({
  selectedCustomer,
  onClose,
}) => {
  const [amount, setAmount] = useState(
    selectedCustomer?.amount || 0
  );

  const [paymentMethod, setPaymentMethod] =
    useState("UPI");

  if (!selectedCustomer) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Settle Due
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-gray-50 border rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">
              CUSTOMER
            </p>

            <h3 className="text-xl font-bold">
              {selectedCustomer.name}
            </h3>

            <div className="flex justify-between mt-4">
              <span>Total Outstanding</span>

              <span className="font-bold text-xl text-teal-900">
                ₹{selectedCustomer.amount}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Settlement Amount
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              Payment Method
            </label>

            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  name: "Cash",
                  icon: <Wallet size={18} />,
                },
                {
                  name: "Card",
                  icon: <CreditCard size={18} />,
                },
                {
                  name: "UPI",
                  icon: <Landmark size={18} />,
                },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() =>
                    setPaymentMethod(item.name)
                  }
                  className={`border rounded-xl p-3 flex flex-col items-center gap-2 ${
                    paymentMethod === item.name
                      ? "border-teal-800 bg-teal-50 text-teal-800"
                      : ""
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t">
          <button className="w-full bg-teal-900 hover:bg-teal-800 text-white py-3 rounded-xl font-semibold">
            Complete Payment
          </button>
        </div>
      </div>
    </>
  );
};

export default SettlementPanel;