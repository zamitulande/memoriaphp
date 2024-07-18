import types from './const';

const defaultState = {
    visible:false,
    message:"Cargando."
};

const Reducer = (state = defaultState, action = {}) => {
    switch (action.type) {
        case types.OPEN_FULL_LOADER:
            return Object.assign({}, state, {visible:true, message:action.message});
            break;
        case types.CLOSE_FULL_LOADER:
            return Object.assign({}, state, {visible:false});
            break;
        default:
            return state;
    }
};

export default Reducer;
