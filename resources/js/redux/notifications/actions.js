import types from './const';

/*
	* EJEMPLO DE NOTIFICACIÔN
	
	{
		header:"Sin resultados",
		message:"No se han encontrado más resultados para mostrar.",
		showButtonClose:true,
		closeIn:4
	}
	
 */
const actAddNotification = (notification) => ({
    type: types.ADD,
    notification
});

const actRemoveNotification = (notification_id) => ({
    type: types.REMOVE,
    notification_id
});

const actRemoveAllNotifications = () => ({
    type: types.REMOVE_ALL
});

export {actAddNotification, actRemoveNotification, actRemoveAllNotifications};