// utils/flashMessage.js
// Jamshed Ali Added Start - Bug ID 2555
// Description: Added a utility function to show flash messages using react-native-flash-message with customizable options.

import { showMessage } from "react-native-flash-message";
import { COLORS } from "../styles/Colors";

export const showFlashMessage = ({
message= "Simple message",
  description = "",
  type = "default", // 'success' | 'info' | 'warning' | 'danger'
  duration = 3000,
  backgroundColor= COLORS.BLUE,
  icon = "auto", // 'auto' | 'success' | 'info' | 'warning' | 'danger' | null
}) => {
  showMessage({
    message,
    description,
    type,
    duration,
    icon,
    backgroundColor,
  });
};
// Jamshed Ali Added End - Bug ID 2555
