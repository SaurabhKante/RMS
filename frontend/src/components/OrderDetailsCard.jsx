import {
  Clock3,
  Wallet,
  ChevronRight,
} from "lucide-react";

const OrderDetailsCard = ({
  order,
  onClick,
}) => {

  const dueAmount =
    order.dueDetails?.dueAmount || 0;

  const paidAmount =
    order.paidAmount || 0;

  const getPaymentMethods = () => {
    if (!order.payments || order.payments.length === 0) {
      return "No Payment";
    }

    const methods = [
      ...new Set(
        order.payments.map(
          (payment) => payment.paymentMethod
        )
      ),
    ];

    return methods.join(", ");
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-teal-300 transition cursor-pointer"
    >

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">

        <div className="flex items-center gap-4">

          <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center">
            {order.tableId}
          </div>

          <div>
            <h4 className="font-semibold text-lg">
              {order.tableName}
            </h4>

            <p className="text-xs text-gray-500">
              Order #{order.orderId}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-4">

          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Clock3 size={16} />
            {order.createdAt}
          </span>

          <span
            className={`text-xs px-2 py-1 rounded ${
              dueAmount > 0
                ? "bg-red-100 text-red-700"
                : "bg-teal-100 text-teal-800"
            }`}
          >
            {dueAmount > 0
              ? "Due Pending"
              : "Completed"}
          </span>

        </div>

      </div>

      {/* Body */}
      <div className="p-6">

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

          {/* Total */}
          <div>
            <p className="text-xs uppercase text-gray-500">
              Total
            </p>

            <h5 className="font-bold text-lg">
              ₹ {order.totalAmount}
            </h5>
          </div>

          {/* Discount */}
          <div>
            <p className="text-xs uppercase text-gray-500">
              Discount
            </p>

            <h5 className="font-bold text-lg">
              ₹ {order.discount}
            </h5>
          </div>

          {/* Final */}
          <div>
            <p className="text-xs uppercase text-gray-500">
              Final Amount
            </p>

            <h5 className="font-bold text-lg">
              ₹ {order.finalAmount}
            </h5>
          </div>

          {/* Paid */}
          <div>
            <p className="text-xs uppercase text-gray-500">
              Paid
            </p>

            <h5 className="font-bold text-lg text-teal-800">
              ₹ {paidAmount}
            </h5>
          </div>

          {/* Payment */}
          <div>
            <p className="text-xs uppercase text-gray-500">
              Method
            </p>

            <h5 className="font-semibold flex items-center gap-1">
              <Wallet size={16} />
              {getPaymentMethods()}
            </h5>
          </div>

          {/* Due */}
          <div>
            <p className="text-xs uppercase text-gray-500">
              Due
            </p>

            <h5
              className={`font-bold text-lg ${
                dueAmount > 0
                  ? "text-red-500"
                  : "text-teal-700"
              }`}
            >
              ₹ {dueAmount}
            </h5>
          </div>

        </div>

        {/* View Details */}
        <div className="mt-5 pt-4 border-t flex justify-end">
          <span className="flex items-center gap-1 text-sm font-semibold text-teal-800">
            View Order Details
            <ChevronRight size={16} />
          </span>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsCard;