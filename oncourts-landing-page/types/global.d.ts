export {};

declare global {
  interface Window {
    Digit: any;
    globalConfigs: {
      getConfig: (key: string) => string;
    };
  }
}