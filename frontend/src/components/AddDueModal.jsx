import { useState } from "react";
import { X } from "lucide-react";

const AddDueModal = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    table: "",
    amount: "",
    dueDate: "",
    paymentMethod: "Cash",
    notes: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...formData,
      amount: Number(formData.amount),
      status: "Pending",
    });

    setFormData({
      customerName: "",
      phone: "",
      table: "",
      amount: "",
      dueDate: "",
      paymentMethod: "Cash",
      notes: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold">
              Add Due Entry
            </h2>
            <p className="text-sm text-slate-500">
              Create a new customer due
            </p>
          </div>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 p-4"
        >
          <div className="grid grid-cols-2 gap-3">
  <div>
    <label className="mb-1 block text-xs font-medium text-slate-600">
      Customer Name
    </label>

    <input
      type="text"
      name="customerName"
      value={formData.customerName}
      onChange={handleChange}
      required
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
    />
  </div>

  <div>
    <label className="mb-1 block text-xs font-medium text-slate-600">
      Phone Number
    </label>

    <input
      type="tel"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      required
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
    />
  </div>
</div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Table
              </label>

              <input
                type="text"
                name="table"
                value={formData.table}
                onChange={handleChange}
                placeholder="Table 08"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Due Amount (₹)
              </label>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Due Date
            </label>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Payment Method
            </label>

            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Card</option>
              <option>Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Notes
            </label>

            <textarea
              rows="2"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-teal-700 px-4 py-2 text-white"
            >
              Save Due
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDueModal;