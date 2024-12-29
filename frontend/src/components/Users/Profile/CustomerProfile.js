import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserProfileAction } from "../../../redux/slices/users/usersSlice";
import CustomerDetails from "./CustomerDetails";
import ShippingAddressDetails from "./ShippingAddressDetails";

export default function CustomerProfile() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserProfileAction());
  }, [dispatch]);

  const { error, loading, profile } = useSelector((state) => state?.users);
  const orders = profile?.user?.orders;

  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);

  const handleNextOrder = () => {
    setCurrentOrderIndex((prevIndex) =>
      prevIndex < orders.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePreviousOrder = () => {
    setCurrentOrderIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  return (
    <>
      <div className="flex flex-wrap -mx-3 -mb-3 md:mb-0">
        <div className="w-full md:w-1/3 px-3 mb-3 md:mb-0" />
        <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
          <CustomerDetails
            email={profile?.user?.email}
            dateJoined={new Date(profile?.user?.createdAt).toDateString()}
            name={profile?.user?.name}
          />

          <div className="mt-4">
            <Link
              to="/address"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              Change Address
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-3 md:mb-0" />
      </div>

      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>{error?.message}</h2>
      ) : orders?.length <= 0 ? (
        <h2 className="text-center mt-10">No Order Found</h2>
      ) : (
        <div className="relative">
          {orders.length > 1 && (
            <>
              <button
                onClick={handlePreviousOrder}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={currentOrderIndex === 0}
              >
                &#8592;
              </button>
              <button
                onClick={handleNextOrder}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={currentOrderIndex === orders.length - 1}
              >
                &#8594;
              </button>
            </>
          )}

          <div className="bg-gray-50 mb-8">
            <div className="mx-auto max-w-2xl pt-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
              <div className="border-t border-b border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
                <div className="py-6 px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                  <div className="lg:col-span-7">
                    <div className="sm:flex">
                      <div className="aspect-w-1 aspect-h-1 w-full flex-shrink-0 overflow-hidden rounded-lg sm:aspect-none sm:h-40 sm:w-40">
                        <img
                          src={orders[currentOrderIndex]?.orderItems[0]?.image}
                          alt={orders[currentOrderIndex]?.orderItems[0]?.name}
                          className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                        />
                      </div>
                      <div className="mt-6 sm:mt-0 sm:ml-6">
                        <h3 className="text-base font-medium text-gray-900">
                          {orders[currentOrderIndex]?.orderItems[0]?.name}
                        </h3>
                        <p className="mt-2 text-sm font-medium text-gray-900">
                          $
                          {
                            orders[currentOrderIndex]?.orderItems[0]
                              ?.discountedPrice
                          }
                        </p>
                        <p className="mt-3 text-sm text-gray-500">
                          {
                            orders[currentOrderIndex]?.orderItems[0]
                              ?.description
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="font-medium text-gray-900">
                          Order number
                        </dt>
                        <dd className="mt-1 text-gray-500">
                          {orders[currentOrderIndex]?.orderNumber}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-900">
                          Date placed
                        </dt>
                        <dd className="mt-1 text-gray-500">
                          {new Date(
                            orders[currentOrderIndex]?.createdAt
                          ).toDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-900">
                          Total amount
                        </dt>
                        <dd className="mt-1 font-medium text-gray-900">
                          ${orders[currentOrderIndex]?.totalPrice}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-900">
                          Payment Method
                        </dt>
                        <dd className="mt-1 text-gray-500">
                          {orders[currentOrderIndex]?.paymentMethod}
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="font-medium text-gray-900">
                          Payment Status
                        </dt>
                        <dd className="mt-1 text-gray-500">
                          {orders[currentOrderIndex]?.paymentStatus}
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                  <ShippingAddressDetails
                    shippingAddress={orders[currentOrderIndex]?.shippingAddress}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
