import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordAction } from "../../../redux/slices/users/usersSlice";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const {
    forgotPasswordStatus,
    forgotPasswordSuccessMessage,
    forgotPasswordError,
  } = useSelector((state) => state.users);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPasswordAction(email));
  };

  return (
    <section className="py-20 bg-gray-100 overflow-x-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-md shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Forgot Password
          </h2>
          <p className="mt-4 text-gray-600 text-center">
            Enter your email address, and we'll send you instructions to reset
            your password.
          </p>
          {forgotPasswordStatus === "rejected" && (
            <ErrorMsg message={forgotPasswordError} />
          )}
          <form onSubmit={handleSubmit} className="mt-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              name="email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 w-full border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
              placeholder="Enter email here"
              required
            />
            <div className="mt-4">
              <button
                type="submit"
                disabled={forgotPasswordStatus === "pending"}
                className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              >
                {forgotPasswordStatus === "pending"
                  ? "Submitting..."
                  : "Submit"}
              </button>
              {forgotPasswordStatus === "fullfilled" && (
                <p className="mt-4 text-green-600 text-center">
                  Instructions have been sent to your email.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
