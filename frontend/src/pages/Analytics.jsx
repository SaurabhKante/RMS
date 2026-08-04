import { useEffect, useState } from "react";
import axios from "axios";

import AnalyticsFilter from "../components/DateFilter";
import AnalyticsCard from "../components/AnalyticsCard";
import OrderDetailsCard from "../components/OrderDetailsCard";
import OrderDetailsModal from "../components/OrderDetailsModal";

import {
  Banknote,
  Landmark,
  CreditCard,
  AlertCircle,
  PiggyBank,
} from "lucide-react";

import { BASE_URL } from "../constants/baseUrl";

const getToday = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const Analytics = () => {
  const today = getToday();

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const [summary, setSummary] = useState({
    totalCash: 0,
    totalUpi: 0,
    totalCard: 0,
    totalCollection: 0,
    totalDue: 0,
  });

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const getOrderDetails = async (start = startDate, end = endDate) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found.");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/order/v1/order-details`,
        {
          startDate: start,
          endDate: end,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data?.data;

      setSummary(
        data?.summary || {
          totalCash: 0,
          totalUpi: 0,
          totalCard: 0,
          totalCollection: 0,
          totalDue: 0,
        }
      );

      setOrders(data?.orders || []);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);

      setError(
        error.response?.data?.message ||
          error.response?.data?.MESSAGE ||
          "Failed to fetch analytics data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderDetails(today, today);
  }, []);

  const handleApplyFilter = (start, end) => {
    setStartDate(start);
    setEndDate(end);

    getOrderDetails(start, end);
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-teal-900">
          Analytics Page
        </h1>

        <p className="text-gray-500 mt-2">
          View and track the summary of restaurant transactions and orders.
        </p>
      </div>

      {/* Date Filter */}
      <AnalyticsFilter
        startDate={startDate}
        endDate={endDate}
        onApply={handleApplyFilter}
      />

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-200 border-t-teal-800 mx-auto" />

            <p className="mt-4 text-gray-500">
              Loading analytics...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

            <AnalyticsCard
              icon={Banknote}
              amount={summary.totalCash}
              title="Total Cash"
            />

            <AnalyticsCard
              icon={Landmark}
              amount={summary.totalUpi}
              title="Total UPI"
            />

            <AnalyticsCard
              icon={CreditCard}
              amount={summary.totalCard}
              title="Total Card"
            />

          </div>

          {/* Collection / Due */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            <AnalyticsCard
              icon={AlertCircle}
              amount={summary.totalDue}
              title="Total Due"
              bgColor="bg-red-50"
              iconColor="text-red-600"
            />

            <AnalyticsCard
              icon={PiggyBank}
              amount={summary.totalCollection}
              title="Total Collection"
              bgColor="bg-teal-800"
              textColor="text-white"
              iconColor="text-white"
            />

          </div>

          {/* Orders */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">
                Order List
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {orders.length} order{orders.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
              <p className="text-gray-500">
                No orders found for the selected date range.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {orders.map((order) => (
                <OrderDetailsCard
                  key={order.orderId}
                  order={order}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}

            </div>
          )}
        </>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

    </div>
  );
};

export default Analytics;