import { Middleware } from 'redux';

import { RootState } from '../rootReducer';
import { trackGAEvent } from '../../utils/googleAnalytics';

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

  trackGAEvent({ type, payload }, getState());

  return result;
};
