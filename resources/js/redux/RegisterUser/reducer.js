import types from './const';
import params from '../../config/params';

const initRegister = {
    userRegister:false,
}

const reducerApp = (state=initRegister, action) => {
    switch (action.type) {

        case types.REGISTER:
            return Object.assign({}, state, {
                userRegister:true
            });
            break;
        default:
    }

    return state;
}

export default reducerApp;

