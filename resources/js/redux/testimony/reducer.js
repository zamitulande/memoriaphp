import types from './const';

const initState = {
    testimonies:[],
    backup:[]
}

const reducerApp = (state=initState, action) => {
    switch (action.type) {
        //agrega los testimonios recibidos la propiedad testimonios del estado
        case types.LOAD:
            //si se envia a recargar se reinicia el array de testimonio
            //de lo contrario se cargan los nuevos con los antiguos
            let currentTesimonies = action.reload?[]:state.testimonies;

            _.map(action.testimonies, (el, i) => {
                currentTesimonies.push(el);
            });

            return Object.assign({}, state, {
                testimonies:currentTesimonies
            });
            break;
        case types.SAVE_BACKUP:
            return Object.assign({}, state, {
                backup:state.testimonies
            });
            break;
        case types.RESTORE_BACKUP:
            return Object.assign({}, state, {
                testimonies:state.backup
            });
            break;
        default:
    }

    return state;
}

export default reducerApp;