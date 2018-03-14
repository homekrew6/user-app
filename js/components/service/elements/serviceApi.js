import api from '../../../api/index'
class serviceApi {



	static getQuestionListByServiceId(id){
		return new Promise((resolve,reject)=>{
			const filter='{"where":{"serviceId":'+id+'}}';
			console.log("filter", filter);
            const url="Questions?filter="+filter;
			api.get(url).then(responseJson=>{
				resolve(responseJson)
			}).catch(err=>{
					console.log(err);
					reject(err)
			})
		})
	}

	// static getQuestionListByServiceId(id) {
	// 	return new Promise((resolve, reject) => {
	// 		debugger
	// 		let questionService = '{"include":["service","questions","answers"]}';
	// 		const url = "Questions/"+id+"?filter="+questionService;
	// 		api.get(url).then(responseJson => {
	// 			resolve(responseJson)
	// 		}).catch(err => {
	// 			console.log(err);
	// 			reject(err)
	// 		})
	// 	})
	// }



}

export default serviceApi
