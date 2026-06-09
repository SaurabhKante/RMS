import React, { useState, useMemo } from "react";
import DueCard from "../components/dues/DueCard";
import DueSearch from "../components/dues/DueSearch";
import SettlementPanel from "../components/dues/SettlementPanel";

const Dues = () => {
  const [search, setSearch] = useState("");

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const dues = [
    {
      id: 1,
      name: "Sairaj",
      mobile: "+7546236545",
      dueDate: "2025-04-11",
      amount: 10,
      status: "Overdue",
    },
    {
      id: 2,
      name: "Sam",
      mobile: "+7546231200",
      dueDate: "2025-04-15",
      amount: 150,
      status: "Pending",
    },
    {
      id: 3,
      name: "Saurabh",
      mobile: "+7546239988",
      dueDate: "2025-04-09",
      amount: 420,
      status: "Action Required",
    },
  ];

  const filteredDues = useMemo(() => {
    return dues.filter((customer) =>
      customer.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="flex-1 min-h-screen bg-slate-50 p-8">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-teal-900">
          Due Management
        </h1>

        <p className="text-gray-500 mt-2">
          Track and settle customer dues.
        </p>
      </div>

      <DueSearch
        search={search}
        setSearch={setSearch}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredDues.map((customer) => (
          <DueCard
            key={customer.id}
            customer={customer}
            onSelect={setSelectedCustomer}
          />
        ))}
      </div>

      <SettlementPanel
        selectedCustomer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
};

export default Dues;