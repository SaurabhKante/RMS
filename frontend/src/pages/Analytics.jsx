import AnalyticsFilter from "../components/DateFilter";
import AnalyticsCard from "../components/AnalyticsCard";
import OrderDetailsCard from "../components/OrderDetailsCard";

import {
  Banknote,
  Landmark,
  CreditCard,
  AlertCircle,
  PiggyBank,
} from "lucide-react";

const Analytics = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-teal-900">
          Analytics Page
        </h1>

        <p className="text-gray-500 mt-2">
          View and track the summary of restaurant transactions and orders.
        </p>
      </div>
      <AnalyticsFilter
        onApply={(start, end) =>
          console.log(start, end)
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <AnalyticsCard
          icon={Banknote}
          amount={170}
          title="Total Cash"
        />

        <AnalyticsCard
          icon={Landmark}
          amount={66}
          title="Total UPI"
        />

        <AnalyticsCard
          icon={CreditCard}
          amount={0}
          title="Total Card"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AnalyticsCard
          icon={AlertCircle}
          amount={10}
          title="Total Due"
          bgColor="bg-red-50"
          iconColor="text-red-600"
        />

        <AnalyticsCard
          icon={PiggyBank}
          amount={236}
          title="Total Collection"
          bgColor="bg-teal-800"
          textColor="text-white"
          iconColor="text-white"
        />
      </div>

      {/* Orders */}
      <h2 className="text-2xl font-bold mb-4">
        Order List
      </h2>

      <div className="space-y-4">

        <OrderDetailsCard
          tableNo={10}
          orderDate="2025-04-11 08:27:15"
          totalAmount={195}
          discount={176}
          paidAmount={166}
          paymentMethod="Cash"
          dueAmount={10}
          staffName="Sairaj"
        />

        <OrderDetailsCard
          tableNo={1}
          orderDate="2025-04-11 08:29:39"
          totalAmount={70}
          discount={70}
          paidAmount={70}
          paymentMethod="Cash"
          dueAmount={0}
          staffName="-"
        />

      </div>
    </div>
  );
};

export default Analytics;