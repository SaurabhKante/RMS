import { useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import StatsSection from "../components/StatsSection";
import TableCard from "../components/TableCard";
import AddTableModal from "../components/AddTableModal";

const Home = () => {
  const [tablesList, setTablesList] = useState([
    {
      id: 1,
      tableName: "Table 01",
      seats: 4,
      status: "Occupied",
    },
    {
      id: 2,
      tableName: "Table 02",
      seats: 2,
      status: "Available",
    },
    {
      id: 3,
      tableName: "Table 08",
      seats: 6,
      status: "Reserved",
      customerName: "Miller Party",
      time: "7:30 PM",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddNewTable = (tableData) => {
    const newTable = {
      id: Date.now(),
      ...tableData,
    };

    setTablesList((prev) => [...prev, newTable]);
  };

  const filteredTables = tablesList.filter((table) => {
    const query = searchQuery.toLowerCase();

    return (
      table.tableName.toLowerCase().includes(query) ||
      table.status.toLowerCase().includes(query) ||
      (table.customerName &&
        table.customerName.toLowerCase().includes(query))
    );
  });

  return (
    <>
      <DashboardHeader
        searchPlaceholder="Search tables"
        buttonText="New Table"
        onSearch={setSearchQuery}
        onButtonClick={() => setIsModalOpen(true)}
      />

      <main className="p-6">
        {/* Stats Cards */}
        <StatsSection tables={tablesList} />

        {/* Section Heading */}
        <div className="mt-8 mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Restaurant Floor
          </h2>

          <p className="text-slate-500">
            Manage your tables and reservations
          </p>
        </div>

        {/* Table Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
            />
          ))}
        </div>
      </main>

      {/* Modal */}
      <AddTableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddNewTable}
      />
    </>
  );
};

export default Home;