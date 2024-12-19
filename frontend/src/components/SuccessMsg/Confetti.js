import { useEffect } from "react";
import confetti from "canvas-confetti";

const ConfettiEffect = () => {
  useEffect(() => {
    confetti({
      particleCount: 500,
      startVelocity: 30,
      spread: 360,
    });
  }, []);

  return null;
};

export default ConfettiEffect;
