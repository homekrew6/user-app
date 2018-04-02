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

	static signup(name,email,password,phone){
		return new Promise((resolve,reject)=>{
			api.post('Customers/signup',{name:name,email:email,password:password,phone:phone,is_active:1 }).then(responseJson=>{
				resolve(responseJson)
			}).catch(err=>{
					console.log(err);
					reject(err)
			})
		})
	}

	static getUserDetail(id,auth){
		return new Promise((resolve,reject)=>{
			api.get('Customers/'+id+'?access_token='+auth).then(responseJson=>{
				resolve(responseJson)
			}).catch(err=>{
					console.log(err);
					reject(err)
			})
		})
	}

	static getAllLanguagesList() {
		return new Promise((resolve, reject) => {
			api.get('Languages').then(responseJson => {
				resolve(responseJson)
			}).catch(err => {
				reject(err)
			})
		})
	}
	static getAllCurrencyList() {
		return new Promise((resolve, reject) => {
			api.get('Currencies').then(responseJson => {
				resolve(responseJson)
			}).catch(err => {
				reject(err)
			})
		})
	}






}

export default authApi
