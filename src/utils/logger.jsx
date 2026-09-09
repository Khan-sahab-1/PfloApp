// Production-safe logger: verbose data is emitted only in development builds.
export const debugLog = (...args) => {
  if (__DEV__) {
    console.log(...args);
  }
};

export const reportError = (message, error) => {
  console.error(message, error?.message || error);
};
