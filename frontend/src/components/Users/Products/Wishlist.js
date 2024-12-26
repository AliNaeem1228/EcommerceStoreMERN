import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getWishlistAction,
  deleteWishlistAction,
} from "../../../redux/slices/wishlist/wishlistSlice";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import Swal from "sweetalert2";

export default function Wishlist() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo?._id;

    if (userId) {
      dispatch(getWishlistAction({ userId }));
    }
  }, [dispatch]);

  const { wishlist, loading, error } = useSelector((state) => state.wishlist);

  const removeWishlistItemHandler = (wishlistId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this item from your wishlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteWishlistAction(wishlistId))
          .unwrap()
          .then(() => {
            Swal.fire("Removed!", "The item has been removed.", "success");
          })
          .catch((err) => {
            Swal.fire("Error!", err || "Failed to remove the item.", "error");
          });
      }
    });
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
                    src={item.product?.images || "/placeholder-image.jpg"}
                    alt={item.product?.name || "No name"}
                    className="h-24 w-24 rounded-md object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex flex-1 justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.product?.name || "No name"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.product?.description || "No description available"}
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
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
