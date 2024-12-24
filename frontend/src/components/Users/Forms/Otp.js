import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtpAction } from "../../../redux/slices/users/usersSlice";
import { useParams } from "react-router-dom";
import OtpInput from 'react-otp-input';

const SendOtp = ({ userId }) => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const { loading, error, success } = useSelector((state) => state?.users);
  const { user_id } = useParams();
  console.log("Rendering SendOtp component...", user_id);
  console.log("Redux state:", { loading, error, success });

  const handleSendOtp = (e) => {
      console.log("ho == ",e)
      setOtp(e);
  };

  useEffect(() => {
    console.log("Dispatching sendOtpAction with userId:", user_id);
    if (!user_id) {
      console.error("Error: User ID is missing or invalid.");
      return;
    }
    dispatch(sendOtpAction(user_id));
  }, [dispatch, user_id]);

  return (
    <div>
      <OtpInput
        value={otp}
        onChange={handleSendOtp}
        numInputs={4}
        renderSeparator={<span>-</span>}
        renderInput={(props) => <input {...props} />}
      />
      
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
