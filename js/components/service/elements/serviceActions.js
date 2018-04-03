import serviceApi from './serviceApi';
import * as TYPES from '../../../actions/actionTypes';
import { AsyncStorage } from 'react-native';



export function setServiceDetails(data) {
  return function (dispatch) {
    console.log('setServiceDetails',data);
      dispatch(serviceStateSuccess(data));
  };
}


export function setDateAndTime(data) {
  return function (dispatch) {
    dispatch(serviceStateSuccess(data));    
  };
}
export function getQuestionListByServiceId(data) {
  return function (dispatch) {
    dispatch(serviceStateBusy());
    return serviceApi.getQuestionListByServiceId(data.id).then((res) => {
      res.type = 'success';
       dispatch(serviceStateSuccess(data))
      return res;
    }).catch((err) => {
      err.type = 'error';
      dispatch(serviceStateFailed());
      return err;
    });
  };
}

export function checkIfThePostingDateIsValid(data) {
  return function (dispatch) {
    return serviceApi.checkIfThePostingDateIsValid(data).then((res) => {
      res.type = 'success';
      return res;
    }).catch((err) => {
      err.type = 'error';
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
