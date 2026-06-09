const AddExpenseModal = ({
  showModal,
  setShowModal,
  formData,
  handleChange,
  handleSubmit,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] rounded-2xl p-8">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Add New Expense
          </h2>

          <button
            onClick={() =>
              setShowModal(false)
            }
            className="text-2xl"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="text"
            name="category"
            placeholder="Expense Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="vendor"
            placeholder="Vendor Name"
            value={formData.vendor}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <select
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option>Cash</option>
            <option>Online</option>
            <option>Due</option>
          </select>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() =>
                setShowModal(false)
              }
              className="border px-5 py-3 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-teal-900 text-white px-5 py-3 rounded-xl"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;