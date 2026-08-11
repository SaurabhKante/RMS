import { useEffect, useState } from "react";
import axios from "axios";

import DashboardHeader from "../components/DashboardHeader";
import StatsSection from "../components/StatsSection";
import TableCard from "../components/TableCard";
import AddTableModal from "../components/AddTableModal";

import { BASE_URL } from "../constants/baseUrl";

const Home = () => {

  const [tablesList, setTablesList] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);


  // ==============================
  // FETCH TABLES
  // ==============================

  const getTables = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${BASE_URL}/table/v1/get-all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const tables = response.data.data || [];

      // Get pending orders
      const orderResponse = await axios.get(
        `${BASE_URL}/order/v1/pending-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const pendingOrders = orderResponse.data.data || [];


      // Combine tables + pending orders
      const formattedTables = tables.map((table) => {

        const order = pendingOrders.find(
          (order) => order.tableId === table.tableId
        );

        return {
          id: table.tableId,

          name: table.tableName,

          seats: table.seatCapacity,

          hasOrder: !!order,

          orderAmount: order
            ? Number(order.totalAmount)
            : 0,

          status: order
            ? "Occupied"
            : "Available",
        };
      });


      setTablesList(formattedTables);

    } catch (error) {

      console.error(
        "Error fetching tables:",
        error
      );

      alert(
        error.response?.data?.message ||
        error.response?.data?.MESSAGE ||
        "Failed to fetch tables."
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    getTables();

  }, []);


  const handleDeleteTable = async (table) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete ${table.name}?`
    );

    if (!confirmed) {
      return;
    }


    try {

      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${BASE_URL}/table/v1/delete/${table.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      // Remove deleted table from UI
      setTablesList((prevTables) =>
        prevTables.filter(
          (item) => item.id !== table.id
        )
      );

    } catch (error) {

      console.error(
        "Error deleting table:",
        error
      );

      alert(
        error.response?.data?.message ||
        error.response?.data?.MESSAGE ||
        "Failed to delete table."
      );

    }

  };


  const handleEditTable = (table) => {

    console.log(
      "Edit table:",
      table
    );

    // Your edit modal can be opened here.
  };

  const filteredTables = tablesList.filter(
    (table) => {

      const query =
        searchQuery.toLowerCase();

      return (
        table.name
          .toLowerCase()
          .includes(query) ||

        table.status
          .toLowerCase()
          .includes(query)
      );

    }
  );


  return (
    <>
      <DashboardHeader
        searchPlaceholder="Search tables"
        buttonText="New Table"
        onSearch={setSearchQuery}
        onButtonClick={() =>
          setIsModalOpen(true)
        }
      />


      <main className="p-6">

        {/* Stats */}
        <StatsSection
          tables={tablesList}
        />


        {/* Heading */}
        <div className="mt-8 mb-6">

          <h2 className="text-2xl font-bold text-slate-800">
            Restaurant Floor
          </h2>

          <p className="text-slate-500">
            Manage your tables and reservations
          </p>

        </div>


        {/* Loading */}
        {loading ? (

          <div className="flex items-center justify-center py-20">

            <p className="text-slate-500">
              Loading tables...
            </p>

          </div>

        ) : filteredTables.length === 0 ? (

          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">

            <p className="text-slate-500">
              No tables found.
            </p>

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredTables.map(
              (table) => (

                <TableCard
                  key={table.id}
                  table={table}
                  onEdit={handleEditTable}
                  onDelete={handleDeleteTable}
                />

              )
            )}

          </div>

        )}

      </main>


      {/* Add Table Modal */}
      <AddTableModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        onSave={getTables}
      />

    </>
  );
};

export default Home;