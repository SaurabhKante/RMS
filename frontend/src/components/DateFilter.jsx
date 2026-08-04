import { useState } from "react";

const DateFilter = ({
  startDate: initialStartDate,
  endDate: initialEndDate,
  onApply,
}) => {
  const [startDate, setStartDate] = useState(
    initialStartDate
  );

  const [endDate, setEndDate] = useState(
    initialEndDate
  );

  const handleApply = () => {
    onApply(startDate, endDate);
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap gap-4 items-end mb-6">

      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Start Date
        </label>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-700"
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block text-sm font-medium mb-1">
          End Date
        </label>

        <input
          type="date"
          value={endDate}
          min={startDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-700"
        />
      </div>

      {/* Apply */}
      <button
        onClick={handleApply}
        className="bg-teal-800 text-white px-5 py-2 rounded-lg hover:bg-teal-900 transition"
      >
        Apply Filter
      </button>

    </div>
  );
};

export default DateFilter;