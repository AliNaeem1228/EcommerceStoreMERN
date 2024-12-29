import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteOrderAction,
  fetchOrdersAction,
} from "../../../redux/slices/orders/ordersSlices";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import NoDataFound from "../../NoDataFound/NoDataFound";
import OrdersStats from "./OrdersStatistics";

export default function OrdersList() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchOrdersAction());
  }, [dispatch]);

  const deleteOrderHandler = (orderId) => {
    dispatch(deleteOrderAction(orderId));
  };

  const {
    error,
    loading,
    orders: { orders },
  } = useSelector((state) => state?.orders);

  return (
    <>
      {error && <ErrorMsg message={error?.message} />}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center"></div>

        <OrdersStats />

        <h3 className="text-lg font-medium leading-6 text-gray-900 mt-3">
          Recent Orders
        </h3>
        <div className="-mx-4 mt-3  overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Payment Status
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Order Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Delivery Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>

                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Total
                </th>
              </tr>
            </thead>
            {loading ? (
              <LoadingComponent />
            ) : orders?.length <= 0 ? (
              <NoDataFound />
            ) : (
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders?.map((order) => (
                  <tr key={order._id}>
                    <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                      {order.orderNumber}
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                      {order.paymentStatus === "Not paid" ? (
                        <span
                          style={{
                            "max-width": "150px",
                            "min-height": "20px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          className="uppercase px-5 py-2 inline-flex text-ms leading-5 font-semibold rounded-full bg-red-600 text-white"
                        >
                          {order.paymentStatus}
                        </span>
                      ) : (
                        <span
                          style={{
                            "max-width": "150px",
                            "min-height": "20px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          className="uppercase px-1 py-2 inline-flex text-ms font-semibold rounded-full bg-green-600 text-white"
                        >
                          {order.paymentStatus}
                        </span>
                      )}
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                      {new Date(order?.createdAt).toLocaleDateString()}
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                      Unknown
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                      {order?.status}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {order?.totalPrice}
                    </td>
                    <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        to={`/admin/orders/${order?._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteOrderHandler(order._id)}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
}
