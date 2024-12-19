import { useDispatch } from "react-redux";
import { useEffect } from "react";
import Swal from "sweetalert2";

import { resetErrAction } from "../../redux/slices/globalActions/globalActions";

const ErrorMsg = ({ message }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      // Show the alert
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      });

      // Dispatch the reset action after showing the alert
      dispatch(resetErrAction());
    }
  }, [message, dispatch]);

  return null; // This component does not render anything visually
};

export default ErrorMsg;
