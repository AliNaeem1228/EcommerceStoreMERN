import { HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrderToCartaction,
  getCartItemsFromLocalStorageAction,
} from "../../../redux/slices/cart/cartSlices";
import { createWishlistAction } from "../../../redux/slices/wishlist/wishlistSlice";

const Products = ({ products }) => {
  const dispatch = useDispatch();

  // Fetch cart items from local storage
  React.useEffect(() => {
    dispatch(getCartItemsFromLocalStorageAction());
  }, [dispatch]);

  const { cartItems } = useSelector((state) => state?.carts);

  const handleAddToCart = (product) => {
    const productExists = cartItems?.find(
      (item) => item?._id?.toString() === product?._id.toString()
    );

    if (productExists) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "This product is already in cart",
      });
    }

    dispatch(
      addOrderToCartaction({
        _id: product?._id,
        name: product?.name,
        qty: 1,
        price: product?.price,
        description: product?.description,
        image: product?.images[0],
        totalPrice: product?.price,
        qtyLeft: product?.qtyLeft,
      })
    );
    Swal.fire({
      icon: "success",
      title: "Good Job",
      text: "Product added to cart successfully",
    });
    dispatch(getCartItemsFromLocalStorageAction());
  };

  const handleAddToWishlist = (product) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo?._id;

    if (!userId) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You need to log in to add items to your wishlist.",
      });
    }

    dispatch(createWishlistAction({ userId, productId: product?._id }))
      .unwrap()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Product added to wishlist successfully.",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error || "Failed to add the product to your wishlist.",
        });
      });
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:col-span-3 lg:gap-x-8">
        {products?.map((product) => (
          <>
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
              <div className="relative bg-gray-50">
                <Link
                  className="block"
                  to={{
                    pathname: `/products/${product?._id}`,
                  }}
                >
                  <img
                    className="w-full h-64 object-cover"
                    src={product?.images[0]}
                    alt
                  />
                </Link>
                <div className="px-6 pb-6 mt-8">
                  <a className="block px-6 mb-2" href="#">
                    <h3 className="mb-2 text-xl font-bold font-heading">
                      {product?.name}
                    </h3>
                    <p className="text-lg font-bold font-heading text-blue-500">
                      <span>${product?.price}</span>
                    </p>
                  </a>
                  <div className="flex flex-row justify-end gap-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center justify-center w-12 h-12 bg-blue-300 hover:bg-blue-400 rounded-md text-white font-bold text-2xl"
                    >
                      <ShoppingCartIcon className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(product)}
                      className="flex items-center justify-center w-12 h-12 bg-red-300 hover:bg-red-400 rounded-md text-white font-bold text-2xl"
                    >
                      <HeartIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default Products;
