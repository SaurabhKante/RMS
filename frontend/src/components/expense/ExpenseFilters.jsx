import { Search } from "lucide-react";

const ExpenseFilters = ({
  search,
  setSearch,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-wrap items-center gap-4 mb-8">

      <input
        type="date"
        className="border border-gray-300 rounded-lg px-4 py-3 outline-none"
      />

      <input
        type="date"
        className="border border-gray-300 rounded-lg px-4 py-3 outline-none"
      />

      <div className="flex items-center flex-1 border border-gray-300 rounded-lg px-4 py-3 min-w-[250px]">
        <Search
          size={18}
          className="text-gray-500"
        />

        <input
          type="text"
          placeholder="Search vendor or category"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="outline-none ml-3 w-full"
        />
      </div>
    </div>
  );
};

export default ExpenseFilters;