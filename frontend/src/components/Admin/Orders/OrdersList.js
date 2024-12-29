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
                  Status
                </th>

                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Edit
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Delete
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
                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                      {order?.status}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {order?.totalPrice}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <Link to={`/admin/orders/${order?._id}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 cursor-pointer text-indigo-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <button onClick={() => deleteOrderHandler(order._id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 cursor-pointer text-indigo-600"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
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
