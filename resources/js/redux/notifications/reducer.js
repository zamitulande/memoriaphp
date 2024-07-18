import types from './const';
import { actRemoveNotification } from './actions';
import store from '../store';

const defaultState = {
    notifications:[]
};

const Reducer = (state = defaultState, action = {}) => {
    switch (action.type) {
        case types.ADD:
        	let key_assigned = false;
        	let random_num = 0;
        	while (!key_assigned) {
        		random_num = Math.round(Math.random() * 999 + 1);

        		if(!_.find(state.notifications, (el) => (el.id == "ntf_"+action.notification_id)))key_assigned = true;
        	}

        	let new_notification = action.notification;
        	new_notification.id = "ntf_"+random_num;

        	let new_notifications = state.notifications;
        	new_notifications.push(new_notification);

        	if(new_notification.closeIn){
        		setTimeout(() => {
        			store.dispatch(actRemoveNotification(new_notification.id));
        		}, (new_notification.closeIn * 1000))
        	}

            return Object.assign({}, state, {
            	notifications:_.filter(state.notifications, (el) => (el.id))
            });
        case types.REMOVE:
        	return Object.assign({}, state, {
        		notifications:_.filter(state.notifications, (el) => (el.id != action.notification_id))
        	});
        case types.REMOVE_ALL:
            return Object.assign({}, state, {notifications:[]});
        default:
            return state;
    }
};

export default Reducer;
