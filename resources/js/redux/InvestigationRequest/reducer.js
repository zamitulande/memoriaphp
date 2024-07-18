import types from './const';
import params from '../../config/params';

//al colocar esta parte me queda en null las observaciones y tipo solicante de el registro
const initRegister = {
    RegisterInvestigationRequest:false,
    //almacena los anexos de cada historia del conflicto por id
    annexes:[],
}

const reducerApp = (state=initRegister, action) => {
    switch (action.type) {

        case types.REGISTER:
            return Object.assign({}, state, {
                RegisterInvestigationRequest:true
            });

            break;                   
            
        default:
    }

    return state;
}

export default reducerApp;