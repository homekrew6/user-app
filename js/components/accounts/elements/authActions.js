import authApi from './authApi'
import * as TYPES from '../../../actions/actionTypes'
import {AsyncStorage} from 'react-native'
export function login(email,password){
    return function(dispatch){
      dispatch(authStateBusy())
      return authApi.login(email,password).then(res=>{

        AsyncStorage.setItem('userToken',JSON.stringify(res),(err,result)=>{
          AsyncStorage.getItem('userToken',(err,result)=>{
            console.log(result);
          })
        })
        res.type = 'success';
        //dispatch(authStateSuccess(res))
        return res

      }).catch(err=>{
        err.type = 'error';
        console.log(err)
        dispatch(authStateFailed())
        return err
      })
    }

  //console.log(email , password);
  /*return function(dispatch){
    dispatch(authStateBusy())
    return authApi.login(email,password).then(res=>{
      //console.log(res)
      // if(res.status!=='success'){
      //   dispatch(authStateFailed())
      // }else{
      //   AsyncStorage.setItem('userData',JSON.stringify(res.data),(err,result)=>{
      //     AsyncStorage.getItem('userData',(err,result)=>{
      //
      //     })
      //   })
      //   dispatch(authStateSuccess(res.data))
      // }
      console.log(res);
      dispatch(authStateSuccess(res))
      return res
      //console.log(res.json());
      //console.log(res.json());


    }).catch(err=>{
      console.log(err)
      dispatch(authStateFailed())
      return err
    })
  }*/
}

export function getUserDetail(id){
    return function(dispatch){
      dispatch(authStateBusy())
      return authApi.getUserDetail(id).then(res=>{
        res.type = 'success';
        console.log(res);
        dispatch(authStateSuccess(res))
        return res

      }).catch(err=>{
        err.type = 'error';
        console.log(err)
        dispatch(authStateFailed())
        return err
      })
    }
  }

export function signup(name,email,password,phone){
  return function(dispatch){
    dispatch(authStateBusy())
    return authApi.signup(name,email,password,phone).then(res=>{
      // if(res.status!=='success'){
      //   dispatch(authStateFailed())
      // }else{
      //   AsyncStorage.setItem('userData',JSON.stringify(res.data),(err,result)=>{
      //
      //   })
      //   dispatch(authStateSuccess(res.data))
      // }
      return res
    }).catch(err=>err)
  }
}


export function authStateBusy(){
	return {
		type : TYPES.AUTH_STATE_BUSY
	}
}

export function authStateFailed(){
  return {
    type : TYPES.AUTH_STATE_FAILED
  }
}

export function authStateSuccess(data){
  return {
    type : TYPES.AUTH_STATE_SUCCESS,
    data
  }
}
