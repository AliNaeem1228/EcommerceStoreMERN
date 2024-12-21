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
  }, [message]); // Run this effect only when `message` changes

  return null; // This component does not render anything visually
};

export default SuccessMsg;
