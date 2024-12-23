import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  createWishlistAction,
  getWishlistAction,
  deleteWishlistAction,
} from "../../../redux/slices/wishlist/wishlistSlice";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";

export default function Wishlist() {
  const dispatch = useDispatch();

  // Local state to handle adding items
  const [newProduct, setNewProduct] = useState("");

  // Fetch wishlist items on component mount
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("userInfo"))?._id; // Replace with your auth logic
    dispatch(getWishlistAction(userId));
  }, [dispatch]);

  // Access wishlist data from Redux store
  const { wishlist, loading, error } = useSelector((state) => state.wishlist);

  // Remove wishlist item handler
  const removeWishlistItemHandler = (wishlistId) => {
    dispatch(deleteWishlistAction(wishlistId));
  };

  // Add item to wishlist handler
  const addWishlistItemHandler = (e) => {
    e.preventDefault();
    const userId = JSON.parse(localStorage.getItem("userInfo"))?._id; // Replace with your auth logic

    if (!userId || !newProduct) {
      alert("Please provide valid product details.");
      return;
    }

    dispatch(
      createWishlistAction({
        user: userId,
        product: newProduct,
        note: "Added from wishlist page", // Optional note
      })
    );
    setNewProduct(""); // Clear input field
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Wishlist
        </h1>
        {loading ? (
          <LoadingComponent />
        ) : error ? (
          <ErrorMsg message={error} />
        ) : wishlist?.length === 0 ? (
          <p className="mt-6 text-center text-gray-600">
            Your wishlist is empty.
          </p>
        ) : (
          <ul className="mt-12 divide-y divide-gray-200">
            {wishlist.map((item) => (
              <li key={item._id} className="flex py-6">
                <div className="flex-shrink-0">
                  <img
                    src={item.product.image} // Assuming product has an `image` field
                    alt={item.product.name}
                    className="h-24 w-24 rounded-md object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex flex-1 justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.product.description}{" "}
                      {/* Optional product description */}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => removeWishlistItemHandler(item._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6">
          <form onSubmit={addWishlistItemHandler} className="mb-4">
            <input
              type="text"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              placeholder="Enter Product ID to Add"
              className="mr-2 rounded-md border p-2"
            />
            <button
              type="submit"
              className="text-white bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-800"
            >
              Add to Wishlist
            </button>
          </form>
          <Link
            to="/products"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
