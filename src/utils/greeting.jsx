
// Jamshed Ali Added Start - Bug ID 2555
// Description: Added a utility function to get a greeting based on the current time.
export const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  };
  // Jamshed Ali Added End - Bug ID 2555