import types from './const';

const actChangeActiveItem = (item) => ({
    type: types.CHANGE_ACTIVE_ITEM,
    item
});

export {actChangeActiveItem};