import {
  X,
  Clock3,
  User,
  Phone,
  ReceiptText,
  CreditCard,
} from "lucide-react";

const OrderDetailsModal = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  const dueAmount =
    order.dueDetails?.dueAmount || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b bg-slate-50">

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Order Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Order #{order.orderId}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <X size={22} />
          </button>

        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">

          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

            <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
              <p className="text-xs uppercase text-gray-500">
                Table
              </p>

              <h3 className="text-lg font-bold text-teal-900 mt-1">
                {order.tableName}
              </h3>

              <p className="text-sm text-gray-500">
                Table ID: {order.tableId}
              </p>
            </div>

            <div className="bg-slate-50 border rounded-xl p-4">
              <p className="text-xs uppercase text-gray-500">
                Order Date
              </p>

              <div className="flex items-center gap-2 mt-2">
                <Clock3 size={17} />

                <span className="font-semibold">
                  {order.createdAt}
                </span>
              </div>
            </div>

            <div
              className={`border rounded-xl p-4 ${
                dueAmount > 0
                  ? "bg-red-50 border-red-100"
                  : "bg-teal-50 border-teal-100"
              }`}
            >
              <p className="text-xs uppercase text-gray-500">
                Payment Status
              </p>

              <h3
                className={`text-lg font-bold mt-1 ${
                  dueAmount > 0
                    ? "text-red-700"
                    : "text-teal-700"
                }`}
              >
                {dueAmount > 0
                  ? "Payment Due"
                  : "Fully Paid"}
              </h3>
            </div>

          </div>

          {/* Customer Details */}
          {order.dueDetails && (
            <div className="mb-6">

              <h3 className="text-lg font-bold mb-3">
                Customer Details
              </h3>

              <div className="bg-white border rounded-xl p-4 flex flex-wrap gap-6">

                <div className="flex items-center gap-2">
                  <User
                    size={18}
                    className="text-teal-700"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Customer
                    </p>

                    <p className="font-semibold">
                      {order.dueDetails.customerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone
                    size={18}
                    className="text-teal-700"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Mobile
                    </p>

                    <p className="font-semibold">
                      {order.dueDetails.mobileNumber}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Order Items */}
          <div className="mb-6">

            <div className="flex items-center gap-2 mb-3">
              <ReceiptText
                size={20}
                className="text-teal-800"
              />

              <h3 className="text-lg font-bold">
                Order Items
              </h3>
            </div>

            <div className="border rounded-xl overflow-hidden">

              <div className="overflow-x-auto">
                <table className="w-full">

                  <thead className="bg-slate-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm">
                        Dish
                      </th>

                      <th className="text-center px-4 py-3 text-sm">
                        Qty
                      </th>

                      <th className="text-right px-4 py-3 text-sm">
                        Price
                      </th>

                      <th className="text-right px-4 py-3 text-sm">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {order.orderItems?.map(
                      (item, index) => (
                        <tr
                          key={index}
                          className="border-t"
                        >

                          <td className="px-4 py-3 font-medium">
                            {item.dishName}
                          </td>

                          <td className="px-4 py-3 text-center">
                            {item.quantity}
                          </td>

                          <td className="px-4 py-3 text-right">
                            ₹ {item.price}
                          </td>

                          <td className="px-4 py-3 text-right font-semibold">
                            ₹ {item.totalPrice}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>
              </div>

            </div>

          </div>

          {/* Payment Details */}
          <div className="mb-6">

            <div className="flex items-center gap-2 mb-3">
              <CreditCard
                size={20}
                className="text-teal-800"
              />

              <h3 className="text-lg font-bold">
                Payment Details
              </h3>
            </div>

            {order.payments?.length > 0 ? (
              <div className="space-y-2">

                {order.payments.map(
                  (payment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border rounded-xl px-4 py-3"
                    >

                      <div>
                        <p className="font-semibold">
                          {payment.paymentMethod}
                        </p>

                        {payment.transactionId && (
                          <p className="text-xs text-gray-500">
                            Transaction ID:{" "}
                            {payment.transactionId}
                          </p>
                        )}
                      </div>

                      <p className="font-bold text-teal-800">
                        ₹ {payment.amountPaid}
                      </p>

                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="bg-gray-50 border rounded-xl p-4 text-gray-500">
                No payments recorded.
              </div>
            )}

          </div>

          {/* Amount Summary */}
          <div className="bg-slate-50 border rounded-xl p-5">

            <h3 className="text-lg font-bold mb-4">
              Amount Summary
            </h3>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Total Amount
                </span>

                <span className="font-semibold">
                  ₹ {order.totalAmount}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Discount
                </span>

                <span className="font-semibold">
                  ₹ {order.discount}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Final Amount
                </span>

                <span className="font-semibold">
                  ₹ {order.finalAmount}
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-500">
                  Paid Amount
                </span>

                <span className="font-bold text-teal-700">
                  ₹ {order.paidAmount}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Due Amount
                </span>

                <span
                  className={`font-bold ${
                    dueAmount > 0
                      ? "text-red-600"
                      : "text-teal-700"
                  }`}
                >
                  ₹ {dueAmount}
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end">

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-teal-900 text-white font-semibold hover:bg-teal-800 transition"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
};

export default OrderDetailsModal;