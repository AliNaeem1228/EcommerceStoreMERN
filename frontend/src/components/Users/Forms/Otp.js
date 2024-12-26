import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendOtpAction,
  verifyOtpAction,
} from "../../../redux/slices/users/usersSlice";
import { useNavigate, useParams } from "react-router-dom";
import OtpInput from "react-otp-input";

const SendOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const { loading, error, success } = useSelector((state) => state?.users);
  const { user_id } = useParams();

  const handleSendOtp = () => {
    if (!user_id) {
      console.error("Error: User ID is missing or invalid.");
      return;
    }
    console.log("Sending OTP for user_id:", user_id);
    dispatch(sendOtpAction(user_id));
  };

  const handleVerifyOtp = async() => {
    if (!user_id || !otp) {
      console.error("Error: Missing User ID or OTP.");
      return;
    }
    console.log("Verifying OTP for user_id:", user_id, "OTP:", otp);

   const verified  = await  dispatch(verifyOtpAction({ _id: user_id, otp }));
    console.log("verified == ",verified)
    if(verified){
      window.location.href = '/';
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Send OTP
        </h1>
        <div className="flex justify-center">
          <OtpInput
            value={otp}
            onChange={handleOtpChange}
            numInputs={4}
            renderSeparator={<span className="text-gray-500 mx-2">-</span>}
            renderInput={(props) => (
              <input
                {...props}
                style={{ width: "3em" }}
                className="w-12 h-12 font-bold text-center  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          />
        </div>

        <div className="mt-6 text-center">
          {loading && <p className="text-blue-500">Processing...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {success && (
            <p className="text-green-500">Action completed successfully!</p>
          )}
        </div>

        <button
          onClick={handleSendOtp}
          disabled={loading}
          className={`mt-4 w-full py-2 px-4 rounded-md text-white font-bold ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <button
          onClick={handleVerifyOtp}
          disabled={loading || !otp}
          className={`mt-4 w-full py-2 px-4 rounded-md text-white font-bold ${
            loading || !otp
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Verifying OTP..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default SendOtp;
