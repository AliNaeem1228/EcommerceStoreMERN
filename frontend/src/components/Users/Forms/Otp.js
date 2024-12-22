import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtpAction } from "../../../redux/slices/users/usersSlice";

const SendOtp = ({ userId }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state?.users);

  console.log("Rendering SendOtp component...");
  console.log("Redux state:", { loading, error, success });

  const handleSendOtp = () => {
    console.log("Dispatching sendOtpAction with userId:", userId);
    if (!userId) {
      console.error("Error: User ID is missing or invalid.");
      return;
    }
    dispatch(sendOtpAction(userId));
  };

  return (
    <div>
      <h1>Send OTP</h1>
      {loading && <p>Sending OTP...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {success && <p style={{ color: "green" }}>OTP sent successfully!</p>}
      <button onClick={handleSendOtp} disabled={loading}>
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </div>
  );
};

export default SendOtp;
