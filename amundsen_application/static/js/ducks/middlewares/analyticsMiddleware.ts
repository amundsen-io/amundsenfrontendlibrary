import { Middleware } from 'redux';
import { RootState } from '../rootReducer';

export const track = ({ type, payload }, state) => {
  // analytics tracking api logic goes here
  console.log(`Tracking [${type}]:`, payload);

  // GA Tracking
  // gaTrackEvent({
  //     action: type,
  //     label: userType + tags,
  // })
};

export const analyticsMiddleware: Middleware<
  {}, // legacy type parameter added to satisfy interface signature
  RootState
> = ({ getState }) => (next) => (action) => {
  const result = next(action);

  // Intercept actions with meta analytics
  if (!action.meta || !action.meta.analytics) {
    return result;
  }

  const { type, payload } = action.meta.analytics;

  track({ type, payload }, getState());

  return result;
};
