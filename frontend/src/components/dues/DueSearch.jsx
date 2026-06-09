import React from "react";
import { Search } from "lucide-react";

const DueSearch = ({ search, setSearch }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
        <Search size={18} className="text-gray-500" />

        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-3 w-full outline-none"
        />
      </div>
    </div>
  );
};

export default DueSearch;