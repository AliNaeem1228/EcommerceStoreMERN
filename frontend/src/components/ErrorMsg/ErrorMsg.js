import { useDispatch } from "react-redux";
import { useEffect } from "react";
import Swal from "sweetalert2";

import { resetErrAction } from "../../redux/slices/globalActions/globalActions";

const ErrorMsg = ({ message }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      });

      dispatch(resetErrAction());
    }
  }, [message, dispatch]);

  return null;
};

export default ErrorMsg;
