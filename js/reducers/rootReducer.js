import {combineReducers} from 'redux'
import auth from '../components/accounts/elements/authReducer';
import service from '../components/service/elements/serviceReducer';
import RouterOwn from './routerReducer';

const rootReducer = combineReducers({
	auth,
	service,
	RouterOwn
})

export default rootReducer
