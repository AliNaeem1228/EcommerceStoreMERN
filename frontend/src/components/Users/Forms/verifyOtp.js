import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import { verifyOtpAction } from "../../../redux/slices/users/usersSlice";

const VerifyOtp = ({ userId }) => {
  // dispatch
  const dispatch = useDispatch();

  // form state
  const [otp, setOtp] = useState("");

  // get data from store
  const { error, loading, success, isVerified } = useSelector(
    (state) => state?.otp
  );

  // onchange handler for OTP input
  const onChangeHandler = (e) => {
    setOtp(e.target.value);
  };

  // onsubmit handler
  const onSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(verifyOtpAction({ _id: userId, otp })); // Dispatch action with _id and otp
  };

  // redirect on success
  useEffect(() => {
    if (success && isVerified) {
      window.location.href = "/"; // Redirect to a protected route
    }
  }, [success, isVerified]);

  return (
    <>
      <section className="py-20 bg-gray-100 overflow-x-hidden">
        <div className="relative container px-4 mx-auto">
          <div className="absolute inset-0 bg-blue-200 my-24 -ml-4" />
          <div className="relative flex flex-wrap bg-white">
            <div className="w-full md:w-4/6 px-4">
              <div className="lg:max-w-3xl mx-auto py-20 px-4 md:px-10 lg:px-20">
                <h3 className="mb-8 text-4xl md:text-5xl font-bold font-heading">
                  Verify OTP
                </h3>
                <p className="mb-10 font-semibold font-heading">
                  Enter the OTP sent to your email
                </p>
                {/* error message */}
                {error && <ErrorMsg message={error} />}
                <form
                  className="flex flex-wrap -mx-4"
                  onSubmit={onSubmitHandler}
                >
                  <div className="w-full px-4 mb-8">
                    <label>
                      <h4 className="mb-5 text-gray-400 uppercase font-bold font-heading">
                        One-Time Password (OTP)
                      </h4>
                      <input
                        name="otp"
                        value={otp}
                        onChange={onChangeHandler}
                        className="p-5 w-full border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                        type="text"
                        placeholder="Enter OTP here"
                        autoComplete="off"
                        required
                      />
                    </label>
                  </div>

                  <div className="w-full px-4">
                    {loading ? (
                      <LoadingComponent />
                    ) : (
                      <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold font-heading py-5 px-8 rounded-md uppercase">
                        Verify OTP
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
            <div
              className="w-full md:w-2/6 h-128 md:h-auto flex items-center lg:items-end px-4 pb-20 bg-cover bg-no-repeat"
              style={{
                backgroundImage:
                  'url("https://cdn.pixabay.com/photo/2016/03/27/22/22/phone-1283572_1280.jpg")',
              }}
            ></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VerifyOtp;
