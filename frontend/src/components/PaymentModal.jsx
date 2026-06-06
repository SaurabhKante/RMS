import { useState } from "react";
import { X } from "lucide-react";

const PaymentModal = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    customerName: "",
    amount: "",
    paymentMethod: "Cash",
    notes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave(formData);

    setFormData({
      customerName: "",
      amount: "",
      paymentMethod: "Cash",
      notes: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ">
 <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">
            Record Payment
          </h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

       <form
  onSubmit={handleSubmit}
  className="space-y-2 p-6"
>
         <div>
  <label className="block mb-1 text-xs font-medium text-slate-600">
    Customer Name
  </label>

  <input
    type="text"
    required
    value={formData.customerName}
    onChange={(e) =>
      setFormData({
        ...formData,
        customerName: e.target.value,
      })
    }
    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
  />
</div>

<div>
  <label className="block mb-1 text-xs font-medium text-slate-600">
    Amount (₹)
  </label>

  <input
    type="number"
    required
    value={formData.amount}
    onChange={(e) =>
      setFormData({
        ...formData,
        amount: e.target.value,
      })
    }
    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
  />
</div>

<div>
  <label className="block mb-1 text-xs font-medium text-slate-600">
    Payment Method
  </label>

  <select
    value={formData.paymentMethod}
    onChange={(e) =>
      setFormData({
        ...formData,
        paymentMethod: e.target.value,
      })
    }
    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
  >
    <option>Cash</option>
    <option>UPI</option>
    <option>Card</option>
    <option>Bank Transfer</option>
  </select>
</div>

<div>
  <label className="block mb-1 text-xs font-medium text-slate-600">
    Notes
  </label>

  <textarea
    rows="2"
    value={formData.notes}
    onChange={(e) =>
      setFormData({
        ...formData,
        notes: e.target.value,
      })
    }
    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-none"
  />
</div>

<div className="flex justify-end gap-2 pt-1">
  <button
    type="button"
    onClick={onClose}
    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
  >
    Cancel
  </button>

  <button
    type="submit"
    className="rounded-lg bg-teal-700 px-3 py-1.5 text-sm text-white hover:bg-teal-800"
  >
    Save Payment
  </button>
</div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;