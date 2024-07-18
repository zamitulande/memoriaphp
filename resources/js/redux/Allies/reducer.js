import types from './const';
import params from '../../config/params';

//al colocar esta parte me queda en null las observaciones y tipo solicante de el registro
const initRegister = {
    RegisterAllies:false
  
}

const reducerApp = (state=initRegister, action) => {
    switch (action.type) {

        case types.REGISTER:
            return Object.assign({}, state, {
                RegisterAllies:true
            });

            break;                   
            
        default:
    }

    return state;
}

export default reducerApp;