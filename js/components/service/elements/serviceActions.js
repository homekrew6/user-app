import serviceApi from './serviceApi';
import * as TYPES from '../../../actions/actionTypes';
import { AsyncStorage } from 'react-native';



export function setServiceDetails(data) {
  return function (dispatch) {
    console.log('pragati');
      dispatch(serviceStateSuccess(data));
  };
}
// export function login(email, password) {
//   return function (dispatch) {
//     dispatch(authStateBusy());
//     return authApi.login(email, password).then((res) => {
//       AsyncStorage.setItem('userToken', JSON.stringify(res), (err, result) => {
//         AsyncStorage.getItem('userToken', (err, result) => {
//           console.log(result);
//         });
//       });
//       res.type = 'success';
//       // dispatch(authStateSuccess(res))
//       return res;
//     }).catch((err) => {
//       err.type = 'error';
//       console.log(err);
//       dispatch(authStateFailed());
//       return err;
//     });
//   };
// }






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
