import { useEffect } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { resetErrAction } from "../../redux/slices/globalActions/globalActions";

const ErrorMsg = ({ message }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      }).then(() => {
        dispatch(resetErrAction()); // Reset error state after the alert is acknowledged
      });
    }
  }, [message, dispatch]);

  return null; // This component does not need to render anything visually
};

export default ErrorMsg;
