import {combineReducers} from 'redux'
import auth from '../components/accounts/elements/authReducer';
import service from '../components/service/elements/serviceReducer';

const rootReducer = combineReducers({
	auth,
	service
})

export default rootReducer
