import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";

const Products = ({ products }) => {
  return (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:col-span-3 lg:gap-x-8">
      {products?.map((product) => (
        <div
          key={product?._id}
          className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75"
        >
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
                alt={product?.name}
              />
            </Link>
            <div className="px-6 pb-6 mt-8">
              <div className="block px-6 mb-2">
                <h3 className="mb-2 text-xl font-bold font-heading">
                  {product?.name}
                </h3>
                <p className="text-lg font-bold font-heading text-blue-500">
                  <span>${product?.price}</span>
                </p>
              </div>
              <div className="flex justify-end">
                <Link
                  to={{
                    pathname: `/products/${product?._id}`,
                  }}
                  className="flex items-center justify-center w-12 h-12 bg-gray-300 hover:bg-gray-400 rounded-md text-black"
                >
                  <ArrowRightIcon className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
