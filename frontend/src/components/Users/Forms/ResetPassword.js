import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordAction } from "../../../redux/slices/users/usersSlice";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";

const ResetPassword = () => {
  const { user_id, token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    resetPasswordStatus,
    resetPasswordSuccessMessage,
    resetPasswordError,
  } = useSelector((state) => state.users);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    dispatch(resetPasswordAction({ _id: user_id, password }));
  };

  useEffect(() => {
    if (resetPasswordStatus === "fullfilled") {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [resetPasswordStatus, navigate]);

  return (
    <section className="py-20 bg-gray-100 overflow-x-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-md shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Reset Password
          </h2>
          <p className="mt-4 text-gray-600 text-center">
            Enter your new password to reset your account.
          </p>
          {resetPasswordStatus === "rejected" && (
            <ErrorMsg message={resetPasswordError} />
          )}
          <form onSubmit={handleSubmit} className="mt-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              name="password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 w-full border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
              placeholder="Enter new password"
              required
            />
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mt-4"
            >
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="p-3 w-full border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
              placeholder="Confirm new password"
              required
            />
            <button
              type="submit"
              disabled={resetPasswordStatus === "pending"}
              className="mt-4 w-full bg-indigo-500 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              {resetPasswordStatus === "pending"
                ? "Submitting..."
                : "Reset Password"}
            </button>
          </form>
          {resetPasswordStatus === "fullfilled" && (
            <p className="mt-4 text-green-600 text-center">
              Password reset successfully. Redirecting to login...
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
