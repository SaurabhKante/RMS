import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import DueCard from "../components/dues/DueCard";
import DueSearch from "../components/dues/DueSearch";
import SettlementPanel from "../components/dues/SettlementPanel";

import { BASE_URL } from "../constants/baseUrl";

const Dues = () => {
  const [search, setSearch] = useState("");
  const [dues, setDues] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);


  const getPendingDues = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/payment/v1/pending-dues`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setDues(response.data.data || []);
      } else {
        setDues([]);
      }
    } catch (error) {
      console.error("Error fetching pending dues:", error);

      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to fetch pending dues."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPendingDues();
  }, []);

  const filteredDues = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return dues;
    }

    return dues.filter((customer) => {
      return (
        customer.customerName
          ?.toLowerCase()
          .includes(query) ||
        customer.mobileNumber
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [dues, search]);


  const handlePayment = async ({
    customer,
    amount,
    paymentMethod,
    transactionId,
  }) => {
    try {
      setPaymentLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const paymentAmount = Number(amount);

      if (!paymentAmount || paymentAmount <= 0) {
        alert("Payment amount must be greater than 0.");
        return;
      }

      if (paymentAmount > Number(customer.dueAmount)) {
        alert(
          `Payment cannot exceed the outstanding amount of ₹${Number(
            customer.dueAmount
          ).toFixed(2)}`
        );
        return;
      }

  

      const payload = {
        customerName: customer.customerName,
        mobileNumber: customer.mobileNumber,
        paymentMethod: paymentMethod,
        paymentAmount: paymentAmount,
        transactionId:
          transactionId.trim() === ""
            ? null
            : transactionId.trim(),
      };

      const response = await axios.post(
        `${BASE_URL}/payment/v1/pay-due`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {

        setSelectedCustomer(null);

        await getPendingDues();
      }
    } catch (error) {
      console.error("Error processing payment:", error);

      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to process payment."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-50 p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-teal-900">
          Due Management
        </h1>

        <p className="text-gray-500 mt-2">
          Track and settle customer dues.
        </p>
      </div>

      {/* Search */}
      <DueSearch
        search={search}
        setSearch={setSearch}
      />

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500">
            Loading pending dues...
          </p>
        </div>
      ) : filteredDues.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <h3 className="text-lg font-semibold text-slate-700">
            No Pending Dues
          </h3>

          <p className="text-gray-500 mt-2">
            There are currently no pending customer dues.
          </p>
        </div>
      ) : (
        /* Due Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredDues.map((customer) => (
            <DueCard
              key={customer.dueId}
              customer={customer}
              onSelect={setSelectedCustomer}
            />
          ))}
        </div>
      )}

      {/* Settlement Panel */}
      <SettlementPanel
        selectedCustomer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onPayment={handlePayment}
        loading={paymentLoading}
      />
    </div>
  );
};

export default Dues;

