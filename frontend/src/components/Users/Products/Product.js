import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import Swal from "sweetalert2";

import {
  CurrencyDollarIcon,
  GlobeAmericasIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon, StarIcon } from "@heroicons/react/20/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductAction } from "../../../redux/slices/products/productSlices";
import {
  addOrderToCartaction,
  getCartItemsFromLocalStorageAction,
  changeOrderItemQty,
} from "../../../redux/slices/cart/cartSlices";
import {
  createWishlistAction,
  deleteWishlistAction,
  getWishlistAction,
} from "../../../redux/slices/wishlist/wishlistSlice";

const policies = [
  {
    name: "International delivery",
    icon: GlobeAmericasIcon,
    description: "Get your order in 2 years",
  },
  {
    name: "Loyalty rewards",
    icon: CurrencyDollarIcon,
    description: "Don't look at other tees",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { id } = useParams();
  useEffect(() => {
    dispatch(fetchProductAction(id));
  }, [id]);

  const { wishlist } = useSelector((state) => state?.wishlist);
  const {
    product: { product },
  } = useSelector((state) => state?.products);

  useEffect(() => {
    dispatch(getCartItemsFromLocalStorageAction());
  }, []);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo?._id;

    if (userId) {
      if (!wishlist.length) {
        dispatch(getWishlistAction({ userId }));
      }

      const wishlistItem = wishlist.find(
        (item) =>
          item.product === product?._id || item.product?._id === product?._id
      );
      setIsWishlisted(!!wishlistItem);
    }
  }, [product?._id, wishlist, dispatch]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo?._id;
    if (userId) {
      dispatch(getWishlistAction({ userId }));
    }
  }, [dispatch]);

  const { cartItems } = useSelector((state) => state?.carts);
  const productExists = cartItems?.find(
    (item) => item?._id?.toString() === product?._id.toString()
  );

  const adjustQuantity = (adjustment) => {
    setQuantity((prevQty) => Math.max(1, prevQty + adjustment));
  };

  const addToCartHandler = () => {
    if (selectedColor === "") {
      return Swal.fire({
        icon: "error",
        title: "Oops...!",
        text: "Please select product color",
      });
    }
    if (product?.sizes?.length > 0 && selectedSize === "") {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select product size",
      });
    }
    if (productExists) {
      dispatch(changeOrderItemQty({ productId: product._id, qty: quantity }));
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Product quantity updated in cart successfully",
      });
    } else {
      dispatch(
        addOrderToCartaction({
          _id: product?._id,
          name: product?.name,
          qty: quantity,
          price: product?.price,
          description: product?.description,
          color: selectedColor,
          size: selectedSize || null,
          image: product?.images[0],
          totalPrice: product?.price * quantity,
          qtyLeft: product?.qtyLeft,
        })
      );
      Swal.fire({
        icon: "success",
        title: "Added",
        text: "Product added to cart successfully",
      });
    }
    dispatch(getCartItemsFromLocalStorageAction());
  };

  const buyNowHandler = () => {
    if (selectedColor === "") {
      return Swal.fire({
        icon: "error",
        title: "Oops...!",
        text: "Please select product color",
      });
    }
    if (product?.sizes?.length > 0 && selectedSize === "") {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select product size",
      });
    }
    localStorage.removeItem("cartItem");
    dispatch(
      addOrderToCartaction({
        _id: product?._id,
        name: product?.name,
        qty: 1,
        price: product?.price,
        description: product?.description,
        color: selectedColor,
        size: selectedSize || null,
        image: product?.images[0],
        totalPrice: product?.price,
        qtyLeft: product?.qtyLeft,
      })
    );
    dispatch(getCartItemsFromLocalStorageAction());
    navigate("/shopping-cart");
  };

  const handleWishlistToggle = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo?._id;

    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You need to log in to manage your wishlist.",
      });
      return;
    }

    if (isWishlisted) {
      const wishlistItem = wishlist.find(
        (item) =>
          item.product === product?._id || item.product?._id === product?._id
      );
      if (!wishlistItem) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Wishlist item not found.",
        });
        return;
      }

      dispatch(deleteWishlistAction(wishlistItem._id))
        .unwrap()
        .then(() => {
          setIsWishlisted(false);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error || "Failed to remove product from wishlist.",
          });
        });
    } else {
      dispatch(createWishlistAction({ userId, productId: product?._id }))
        .unwrap()
        .then(() => {
          setIsWishlisted(true);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error || "Failed to add product to wishlist.",
          });
        });
    }
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const nextImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === product?.images?.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? product?.images?.length - 1 : prevIndex - 1
    );
  };

  const selectImage = (index) => {
    setActiveImageIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 3000);
    return () => clearInterval(interval);
  }, [product?.images, activeImageIndex]);

  return (
    <div className="bg-white">
      <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="flex justify-between">
              <h1 className="text-xl font-medium text-gray-900">
                {product?.name}
              </h1>
              <p className="text-xl font-medium text-gray-900">
                $ {product?.price}.00
              </p>
            </div>
            <div className="mt-4">
              <h2 className="sr-only">Reviews</h2>
              <div className="flex items-center">
                <p className="text-sm text-gray-700">
                  {product?.reviews?.length > 0 ? product?.averageRating : 0}
                </p>
                <div className="ml-1 flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        +product?.averageRating > rating
                          ? "text-yellow-400"
                          : "text-gray-200",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div
                  aria-hidden="true"
                  className="ml-4 text-sm text-gray-300"
                ></div>
                <div className="ml-4 flex">
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  ></a>
                </div>
              </div>

              <div className="mt-4">
                <Link to={`/add-review/${product?._id}`}>
                  <h3 className="text-sm font-medium text-blue-600">
                    Leave a review
                  </h3>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
            <h2 className="sr-only">Images</h2>

            <div className="relative w-full max-w-2xl mx-auto">
              <div className="w-full h-[650px] overflow-hidden bg-gray-200 rounded-lg flex items-center justify-center">
                {product?.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    className={classNames(
                      index === activeImageIndex ? "block" : "hidden",
                      "max-h-full max-w-full object-contain"
                    )}
                  />
                ))}
              </div>

              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800"
                aria-label="Previous Image"
              >
                &#8592;
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800"
                aria-label="Next Image"
              >
                &#8594;
              </button>

              <div className="flex justify-center mt-6 space-x-4">
                {product?.images?.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => selectImage(index)}
                    className={classNames(
                      "w-20 h-20 flex items-center justify-center border rounded-lg cursor-pointer hover:opacity-80",
                      index === activeImageIndex
                        ? "border-indigo-500 ring-2 ring-indigo-500"
                        : "border-gray-300"
                    )}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="object-contain w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 lg:col-span-5">
            <>
              <div className="mt-8 flex items-center">
                <div>Quantity: </div>
                <button
                  onClick={() => adjustQuantity(-1)}
                  className="px-3 py-1 border rounded-md"
                  disabled={quantity === 1}
                >
                  -
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={() => adjustQuantity(1)}
                  className="px-3 py-1 border rounded-md"
                >
                  +
                </button>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-900">Color</h2>
                <div className="flex items-center space-x-3">
                  <RadioGroup value={selectedColor} onChange={setSelectedColor}>
                    <div className="mt-4 flex items-center space-x-3">
                      {product?.colors?.map((color) => (
                        <RadioGroup.Option
                          key={color}
                          value={color}
                          className={({ active, checked }) =>
                            classNames(
                              active && checked ? "ring ring-offset-1" : "",
                              !active && checked ? "ring-2" : "",
                              "-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                            )
                          }
                        >
                          <RadioGroup.Label as="span" className="sr-only">
                            {color}
                          </RadioGroup.Label>
                          <span
                            style={{ backgroundColor: color }}
                            aria-hidden="true"
                            className={classNames(
                              "h-8 w-8 border border-black border-opacity-10 rounded-full"
                            )}
                          />
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="mt-8">
                {product?.sizes?.length > 0 && (
                  <>
                    <h2 className="text-sm font-medium text-gray-900">Size</h2>
                    <RadioGroup
                      value={selectedSize}
                      onChange={setSelectedSize}
                      className="mt-2"
                    >
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                        {product?.sizes?.map((size) => (
                          <RadioGroup.Option
                            key={size}
                            value={size}
                            className={({ active, checked }) => {
                              return classNames(
                                checked
                                  ? "bg-indigo-600 border-transparent  text-white hover:bg-indigo-700"
                                  : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
                                "border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 cursor-pointer"
                              );
                            }}
                          >
                            <RadioGroup.Label as="span">
                              {size}
                            </RadioGroup.Label>
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </>
                )}
              </div>

              {product?.qtyLeft <= 0 ? (
                <button
                  style={{ cursor: "not-allowed" }}
                  disabled
                  className="mt-8 flex w-full text-white items-center justify-center rounded-md border border-transparent bg-gray-600 py-3 px-8 text-base font-medium text-whitefocus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Out of Stock
                </button>
              ) : (
                <div className="flex gap-2 justify-evenly">
                  <button
                    onClick={addToCartHandler}
                    className="mt-8 flex w-half justify-center rounded-md bg-indigo-600 py-3 px-8 text-white"
                  >
                    {productExists ? "Update Quantity in Cart" : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => buyNowHandler()}
                    className="mt-8 flex w-half items-center justify-center rounded-md border border-transparent bg-green-600 py-3 px-8 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={handleWishlistToggle}
                    className="mt-8 text-red-700 font-small p-1 hover:text-red-500"
                    style={{ width: "50px" }}
                  >
                    {isWishlisted ? (
                      <HeartIcon className="h-10 w-10" />
                    ) : (
                      <OutlineHeartIcon className="h-10 w-10" />
                    )}
                  </button>
                </div>
              )}
            </>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Description</h2>
              <div className="prose prose-sm mt-4 text-gray-500">
                {product?.description}
              </div>
            </div>

            <section
              aria-labelledby="policies-heading"
              className="mt-10 text-black"
            >
              <h2 id="policies-heading" className="sr-only">
                Our Policies
              </h2>

              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {policies.map((policy) => (
                  <div
                    key={policy.name}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center"
                  >
                    <dt>
                      <policy.icon
                        className="mx-auto h-6 w-6 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="mt-4 text-sm font-medium text-gray-900">
                        {policy.name}
                      </span>
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500">
                      {policy.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>

        <section aria-labelledby="reviews-heading" className="">
          <h2
            id="reviews-heading"
            className="text-lg font-medium text-gray-900"
          >
            Recent reviews
          </h2>

          <div className="mt-6 space-y-10 divide-y divide-gray-200 border-t border-b border-gray-200 pb-10">
            {product?.reviews.map((review) => (
              <div
                key={review._id}
                className="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8"
              >
                <div className="lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8">
                  <div className="flex items-center xl:col-span-1">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={classNames(
                            review.rating > rating
                              ? "text-yellow-400"
                              : "text-gray-200",
                            "h-5 w-5 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {review.rating}
                      <span className="sr-only"> out of 5 stars</span>
                    </p>
                  </div>

                  <div className="mt-4 lg:mt-6 xl:col-span-2 xl:mt-0">
                    <h3 className="text-sm font-medium text-gray-900">
                      {review?.message}
                    </h3>
                  </div>
                </div>

                <div className="mt-6 flex items-center text-sm lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start xl:col-span-3">
                  <p className="font-medium text-gray-900">
                    {review.user?.name}
                  </p>
                  <time
                    dateTime={review.datetime}
                    className="ml-4 border-l border-gray-200 pl-4 text-gray-500 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0"
                  >
                    {new Date(review.createdAt).toLocaleDateString()}
                  </time>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
