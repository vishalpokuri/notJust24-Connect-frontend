import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";

function OTPResend({ onResend }) {
  const [timer, setTimer] = useState(30);
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    let countdown;
    if (isLocked && timer > 0) {
      countdown = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsLocked(false);
    }

    return () => clearTimeout(countdown);
  }, [timer, isLocked]);

  const handleResend = () => {
    if (!isLocked) {
      setTimer(30);
      setIsLocked(true);
      onResend(); // Call the onResend callback provided by the parent
    }
  };

  return (
    <View className="justify-center pt-5 flex-row gap-2 items-center">
      <Text className="text-base text-gray-100">Didn't receive OTP?</Text>

      <TouchableOpacity onPress={handleResend} disabled={isLocked}>
        <Text
          className={`text-base ${
            isLocked ? "text-gray-400" : "text-[#a0f963]"
          }`}
        >
          Resend
        </Text>
      </TouchableOpacity>

      <Text className="text-base text-gray-100">
        {isLocked ? `in ${timer}s` : ""}
      </Text>
    </View>
  );
}

export default OTPResend;
