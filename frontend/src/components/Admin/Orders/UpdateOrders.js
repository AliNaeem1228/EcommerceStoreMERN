import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateOrderAction,
  fetchOderAction,
} from "../../../redux/slices/orders/ordersSlices";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";

const UpdateOrders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [orderStatus, setOrderStatus] = useState("pending");

  const { order, loading, error } = useSelector((state) => state?.orders);

  useEffect(() => {
    dispatch(fetchOderAction(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (order) {
      setOrderStatus(order?.status || "pending");
    }
  }, [order]);

  const handleOnChange = (e) => {
    const newStatus = e.target.value;
    setOrderStatus(newStatus); // Update local state only
  };

  const handleOnSubmit = () => {
    dispatch(updateOrderAction({ status: orderStatus, id })).then(() => {
      navigate("/admin");
    });
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorMsg message={error} />;
  }

  return (
    <div className="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:mt-0 sm:ml-4 sm:border-none sm:pt-0">
      <div className="flex flex-1 justify-center">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Update Order Status
          </label>
          <select
            id="status"
            name="status"
            onChange={handleOnChange}
            value={orderStatus}
            className="mt-1 block w-full rounded-md border-2 border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <button
            onClick={handleOnSubmit}
            className="mt-4 w-full px-4 py-2 bg-indigo-500 text-white rounded-md shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrders;
