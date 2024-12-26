import { useEffect } from "react";
import Swal from "sweetalert2";

const SuccessMsg = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      Swal.fire({
        icon: "success",
        title: "Good job!",
        text: message,
      }).then(() => {
        if (onClose) onClose(); // Reset the message after alert closes
      });
    }
  }, [message, onClose]);

  return null; // No visual component
};

export default SuccessMsg;
