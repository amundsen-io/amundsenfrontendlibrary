import reducer, {
  getDashboardPreview,
  setDashboardPreview,
  initialState,
  DashboardReducerState,
} from '../reducer';

import { errorPreviewStateWithMessage, successPreviewState} from 'fixtures/dashboard/preview';

describe('dashboard reducer', () => {
  let testState: DashboardReducerState;
  beforeAll(() => {
    testState = {
      ...initialState,
      preview: successPreviewState
    }
  });
  it('should return the existing state if action is not handled', () => {
    expect(reducer(testState, { type: 'INVALID.ACTION' })).toEqual(testState);
  });

 it('should handle GetDashboardPreview.REQUEST', () => {
    expect(reducer(testState, getDashboardPreview({ uri: 'someUri' }))).toEqual({
      ...testState,
      preview: {
        url: '',
        isLoading: true,
      }
    });
  });

  it('should handle GetDashboardPreview.RESPONSE', () => {
    expect(reducer(testState, setDashboardPreview(errorPreviewStateWithMessage))).toEqual({
      ...testState,
      preview: {
        ...errorPreviewStateWithMessage,
        isLoading: false,
      }
    });
  });
});
