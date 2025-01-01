import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createReviewAction } from "../../../redux/slices/reviews/reviewsSlice";
import { resetSuccessAction } from "../../../redux/slices/globalActions/globalActions";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import SuccessMsg from "../../SuccessMsg/SuccessMsg";
import { StarIcon as SolidStarIcon } from "@heroicons/react/20/solid";
import { StarIcon as OutlineStarIcon } from "@heroicons/react/24/outline";

export default function AddReview() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rating: 0,
    message: "",
  });

  const handleStarClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (formData.rating < 1 || formData.rating > 5) {
      return alert("Please select a rating from 1 to 5");
    }
    dispatch(
      createReviewAction({
        id,
        message: formData.message,
        rating: formData.rating,
      })
    );
  };

  const { loading, error, isAdded } = useSelector((state) => state?.reviews);

  useEffect(() => {
    if (isAdded) {
      setTimeout(() => {
        dispatch(resetSuccessAction());
        navigate(`/products/${id}`);
      }, 2000);
    }
  }, [isAdded, dispatch, navigate, id]);

  return (
    <>
      {error && <ErrorMsg message={error?.message} />}
      {isAdded && <SuccessMsg message="Thanks for the review" />}
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Add Your Review
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleOnSubmit}>
              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rating
                </label>
                <div className="flex items-center space-x-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => handleStarClick(star)}
                      className="focus:outline-none"
                    >
                      {formData.rating >= star ? (
                        <SolidStarIcon className="h-8 w-8 text-yellow-500" />
                      ) : (
                        <OutlineStarIcon className="h-8 w-8 text-gray-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <div className="mt-1">
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleOnChange}
                    className="block w-full rounded-md p-2 border-gray-300 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                {loading ? (
                  <LoadingComponent />
                ) : (
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add New Review
                  </button>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => navigate(`/products/${id}`)} // Navigate back to the product page
                  className="flex w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  I have Changed my mind
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
