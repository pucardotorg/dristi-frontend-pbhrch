
import { GA_MEASUREMENT_ID } from "./constants";

const isProd = process.env.NODE_ENV === "production";

// Pageview tracking
export const pageview = (url: string): void => {
  if(isProd) {
    // Only run this in production
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
};

// // Event tracking
// export const event = ({ action, category, label, value }: {
//   action: string;
//   category: string;
//   label: string;
//   value?: number;
// }): void => {
//   window.gtag('event', action, {
//     event_category: category,
//     event_label: label,
//     value: value,
//   });
// };

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, string | number | boolean> | string
    ) => void;
  }
}
