import types from './const';

const defaultState = {
    activeItem:'home',
};

const Reducer = (state = defaultState, action = {}) => {
    switch (action.type) {
        case types.CHANGE_ACTIVE_ITEM:
            return Object.assign({}, state, {activeItem:action.item});

        default:
            return state;
    }
};

export default Reducer;
