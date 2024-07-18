import types from './const';
import params from '../../config/params';

const initState = {
    userAuth:false,
    user:null,
    rememberMe:false,
}

const reducerApp = (state=initState, action) => {
    switch (action.type) {

        case types.LOGIN:
            return Object.assign({}, state, {
                userAuth:true,
                rememberMe:action.rememberMe,
                user:action.user
            });
            break;
        case types.LOGOUT:
            return Object.assign({}, state, {
                userAuth:false,
                rememberMe:false,
                user:null
            });
            break;
        default:
    }

    return state;
}

export default reducerApp;
