import { AsyncStorage } from "react-native";
import config from '../config'
let headers = {
  'Accept':'application/json',
  'Content-Type': 'application/json',
}

const resolver = ()=>AsyncStorage.getItem('userToken',(err,result)=>{

  if(result){
    result = JSON.parse(result);
    //headers.Authorization = 'Bearer '+result.id
  }
})
//headers.Authorization = 'Bearer tdsiUzrbkMWy3HcVoB4UPaTxgDdxTpXeJduwkWKpiOX6XtZKYPBvJAsTXv9M';

class api {
  static post(endpoint,data){
    console.log(config.base_api+endpoint)
    console.log(data);
    return new Promise((resolve,reject)=>{
      //alert('promise');
      resolver().then(()=>{
        //alert('resolver');
        fetch(config.base_api+endpoint,{
          method:'POST',
          headers:headers,
          body:JSON.stringify(data)
        }).then(response => {
          console.log(response);
          //alert(response.status)
            if(response.status === 200){
              resolve(response.json());
            }else{
              if(response.status === 204){
                resolve();
              }else{
                reject({"err":"401 found"})
              }

            }

        }).catch(error=>error)
      }).catch(err=>err)
    })

  }

  static put(endpoint,data){
    console.log(config.base_api+endpoint)
    console.log(data);
    return new Promise((resolve,reject)=>{
      resolver().then(()=>{
        fetch(config.base_api+endpoint,{
          method:'PUT',
          headers:headers,
          body:JSON.stringify(data)
        }).then(response => {
          console.log(response);
            if(response.status === 200){
              resolve(response.json());
            }else{
              if(response.status === 204){
                resolve();
              }else{
                reject({"err":"401 found"})
              }

            }

        }).catch(error=>error)
      }).catch(err=>err)
    })

  }

  static get(endpoint){
    return new Promise((resolve,reject)=>{
    console.log(config.base_api+endpoint)
     resolver().then(()=>{
       fetch(config.base_api+endpoint,{
        method:'GET',
        headers:headers
      }).then(response => {
        if(response.status === 200){
          resolve(response.json());
        }else{
          if(response.status === 204){
            resolve();
          }else{
            reject({"err":"401 found"})
          }
        }
      }).catch(error=>error)
    }).catch(error=>error)
    })
  }

  static delete(endpoint) {
    return new Promise((resolve, reject) => {
      fetch(config.base_api + endpoint, {
        method: 'DELETE',
        headers: headers
      }).then(response => {
        if (response.status === 200) {
          resolve(response.json());
        } else {
          if (response.status === 204) {
            resolve();
          } else {
            reject({ "err": "401 found" })
          }
        }
      }).catch(error => error)
    })
    
  }
}

export default api
