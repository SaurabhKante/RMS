import { useState } from "react";
import { X } from "lucide-react";

const AddTableModal = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    tableName: "",
    seats: "",
    status: "Available",
    customerName: "",
    time: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...formData,
      seats: Number(formData.seats),
    });

    setFormData({
      tableName: "",
      seats: "",
      status: "Available",
      customerName: "",
      time: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Add New Table
            </h2>

            <p className="text-sm text-slate-500">
              Create a new restaurant table
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6"
        >
          {/* Table Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Table Name
            </label>

            <input
              type="text"
              name="tableName"
              value={formData.tableName}
              onChange={handleChange}
              placeholder="Table 12"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          {/* Seats */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Number of Seats
            </label>

            <input
              type="number"
              min="1"
              name="seats"
              value={formData.seats}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            >
              <option value="Available">
                Available
              </option>

              <option value="Occupied">
                Occupied
              </option>

              <option value="Reserved">
                Reserved
              </option>

              <option value="Billing">
                Billing
              </option>
            </select>
          </div>

          {/* Reserved Fields */}
          {formData.status === "Reserved" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Customer Name
                </label>

                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Miller Party"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Reservation Time
                </label>

                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
                />
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-teal-700 px-5 py-2.5 text-white hover:bg-teal-800"
            >
              Save Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTableModal;