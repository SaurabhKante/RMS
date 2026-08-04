import { X } from "lucide-react";

const AddExpenseModal = ({
  showModal,
  setShowModal,
  formData,
  handleChange,
  handleSubmit,
  vendors = [],
  loading = false,
}) => {

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-[500px] rounded-2xl p-8 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Add New Expense
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Add an inventory item expense.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Item Name */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Item Name
            </label>

            <input
              type="text"
              name="itemName"
              placeholder="e.g. Milk"
              value={formData.itemName}
              onChange={handleChange}
              className="
                w-full
                border border-gray-300
                rounded-xl
                px-4 py-3
                outline-none
                focus:ring-2
                focus:ring-teal-700
              "
            />

          </div>

          {/* Vendor */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vendor
            </label>

            <select
              name="vendorId"
              value={formData.vendorId}
              onChange={handleChange}
              className="
                w-full
                border border-gray-300
                rounded-xl
                px-4 py-3
                bg-white
                outline-none
                focus:ring-2
                focus:ring-teal-700
              "
            >

              <option value="">
                Select Vendor
              </option>

              {vendors.map((vendor) => (

                <option
                  key={vendor.vendorId}
                  value={vendor.vendorId}
                >
                  {vendor.vendorName}
                </option>

              ))}

            </select>

            {vendors.length === 0 && (
              <p className="text-xs text-red-500 mt-2">
                No vendors available.
              </p>
            )}

          </div>

          {/* Amount */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount
            </label>

            <input
              type="number"
              name="price"
              placeholder="Enter amount"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="
                w-full
                border border-gray-300
                rounded-xl
                px-4 py-3
                outline-none
                focus:ring-2
                focus:ring-teal-700
              "
            />

          </div>

          {/* Payment Method */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Method
            </label>

            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="
                w-full
                border border-gray-300
                rounded-xl
                px-4 py-3
                bg-white
                outline-none
                focus:ring-2
                focus:ring-teal-700
              "
            >

              <option value="CASH">
                Cash
              </option>

              <option value="UPI">
                UPI
              </option>

              <option value="CARD">
                Card
              </option>

            </select>

          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">

            <button
              type="button"
              onClick={() => setShowModal(false)}
              disabled={loading}
              className="
                border border-gray-300
                px-5 py-3
                rounded-xl
                font-semibold
                hover:bg-gray-50
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                bg-teal-900
                text-white
                px-5 py-3
                rounded-xl
                font-semibold
                hover:bg-teal-800
                disabled:opacity-50
                min-w-[130px]
              "
            >
              {loading ? "Saving..." : "Save Expense"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddExpenseModal;