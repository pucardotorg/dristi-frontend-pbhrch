/**
 * Common Tailwind CSS classes used across components
 */

/**
 * Custom CSS animations for notifications
 */
export const animations = `
@keyframes fadeInUp {
  from {
    transform: translate(-50%, 20px);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

@keyframes fadeOutDown {
  from {
    transform: translate(-50%, 0);
    opacity: 1;
  }
  to {
    transform: translate(-50%, 20px);
    opacity: 0;
  }
}
`;

export const commonStyles = {
  // Layout
  container: "max-w-screen mx-auto py-4 px-6 md:py-6 md:px-20 bg-white",

  // Typography
  heading: {
    primary: "text-center mb-6 text-6xl font-libre text-gray-800",
    secondary: "text-2xl font-semibold mb-4",
    accent: "text-xl font-medium text-[#EA580C] italic font-roboto",
  },

  // Form elements
  form: {
    container: "p-6 bg-white rounded-lg border-2 border-[#E2E8F0] rounded-b-md",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4",
    divider: "my-6 border-t border-gray-200",
  },

  // Buttons
  button: {
    primary:
      "px-16 py-2 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-[#0F766E] hover:bg-teal-700 focus:outline-none",
    secondary:
      "px-20 py-2 border border-gray-300 rounded-md text-lg font-medium text-gray-700 hover:bg-gray-50 bg-white",
    disabled: "opacity-50 cursor-not-allowed pointer-events-none",
  },

  // Loading state
  loading: {
    container:
      "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/50",
    spinner:
      "animate-spin rounded-full h-12 w-12 border-4 border-t-[#0F766E] border-b-[#0F766E] border-l-transparent border-r-transparent",
  },

  // Colors
  colors: {
    primary: "#0F766E",
    secondary: "#EA580C",
    text: "#3A3A3A",
    border: "#E2E8F0",
    error: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
  },

  // Fonts
  fonts: {
    libre: "font-family: 'Libre Baskerville', serif; font-weight: 400;",
  },

  // Notifications
  notification: {
    container:
      "fixed left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-md shadow-lg flex items-center",
    bottomCenter: "bottom-10",
    error: "bg-red-500 text-white",
    success: "bg-green-500 text-white",
    warning: "bg-amber-500 text-white",
    info: "bg-blue-500 text-white",
    icon: "w-6 h-6 mr-2",
    message: "font-medium text-center",
  },
};
