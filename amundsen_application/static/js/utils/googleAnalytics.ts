export const trackGAEvent = ({ type, payload }, state) => {
  // analytics tracking api logic goes here
  console.log(`Tracking [${type}]:`, payload);
};
