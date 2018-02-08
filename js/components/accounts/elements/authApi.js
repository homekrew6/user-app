import api from '../../../api/index'
class authApi {

	//login API call
	static login(email,password){
		return new Promise((resolve,reject)=>{
			api.post('Customers/login',{email:email,password:password}).then(responseJson=>{
				resolve(responseJson)
			}).catch(err=>{
					console.log(err);
					reject(err)
			})
		})
	}

	static getUserDetail(id){
		return new Promise((resolve,reject)=>{
			api.get('Customers/'+id).then(responseJson=>{
				resolve(responseJson)
			}).catch(err=>{
					console.log(err);
					reject(err)
			})
		})
	}

	static signup(name,email,password,phone){
    return api.post('Customers/login',{name:name,email:email,password:password,phone:phone}).then(responseJson=>responseJson).catch(err=>err)
	}




}

export default authApi
