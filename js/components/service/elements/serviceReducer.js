import * as TYPES from '../../../actions/actionTypes';
import initialState from '../../../reducers/initialState';

export default function serviceReducer(state = initialState.service, action) {
  switch (action.type) {
    case TYPES.SERVICE_STATE_BUSY: {
      return {
        busy: true,
        data: '',
      };
    }
    case TYPES.SERVICE_STATE_FAILED: {
      return {
        busy: false,
        data: '',
      };
    }
    case TYPES.SERVICE_STATE_SUCCESS: {
      return {
        busy: false,
        data: action.data,
      };
    }
    default:
      return state;
  }
}
