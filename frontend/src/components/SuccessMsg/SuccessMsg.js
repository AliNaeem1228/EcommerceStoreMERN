import { useEffect } from "react";
import Swal from "sweetalert2";

const SuccessMsg = ({ message }) => {
  useEffect(() => {
    if (message) {
      Swal.fire({
        icon: "success",
        title: "Good job!",
        text: message,
      });
    }
  }, [message]);

  return null;
};

export default SuccessMsg;
