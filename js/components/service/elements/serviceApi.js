import api from '../../../api/index'
class serviceApi {

	static getQuestionListByServiceId(id) {
		return new Promise((resolve, reject) => {
			// let questionService = '{"include":["service","questions","answers"]}';
			// const url = "Questions/"+id+"?filter="+questionService;
			let questionService = '{"include": [{"relation": "answers"}],"where": { 		"serviceId": ' + id + '	} }';
			const url = "Questions?filter=" + questionService;
			api.get(url).then(responseJson => {
				resolve(responseJson)
			}).catch(err => {
				reject(err)
			})
		})
	}

	static checkIfThePostingDateIsValid(data) {
		return new Promise((resolve, reject) => {
			api.post('Jobs/checkIfThePostingDateIsValid',data).then(responseJson => {
				resolve(responseJson)
			}).catch(err => {
				reject(err)
			})
		})
	}



}

export default serviceApi
