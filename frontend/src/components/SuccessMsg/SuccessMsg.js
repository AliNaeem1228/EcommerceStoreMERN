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
        if (onClose) onClose();
      });
    }
  }, [message, onClose]);

  return null;
};

export default SuccessMsg;
