import serviceApi from './serviceApi';
import * as TYPES from '../../../actions/actionTypes';
import { AsyncStorage } from 'react-native';



export function setServiceDetails(data) {
  return function (dispatch) {
    console.log('setServiceDetails',data);
      dispatch(serviceStateSuccess(data));
  };
}
export function getQuestionListByServiceId(id) {
  return function (dispatch) {
    dispatch(serviceStateBusy());
    return serviceApi.getQuestionListByServiceId(id).then((res) => {
      res.type = 'success';
       dispatch(serviceStateSuccess(res))
      return res;
    }).catch((err) => {
      err.type = 'error';
      console.log(err);
      dispatch(serviceStateFailed());
      return err;
    });
  };
}






export function serviceStateBusy() {
  return {
    type: TYPES.SERVICE_STATE_BUSY,
  };
}

export function serviceStateFailed() {
  return {
    type: TYPES.SERVICE_STATE_FAILED,
  };
}

export function serviceStateSuccess(data) {
  return {
    type: TYPES.SERVICE_STATE_SUCCESS,
    data,
  };
}
