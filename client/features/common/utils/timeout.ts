// add when loading to avoid flickering
export const timeout = async (ms = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
