import types from './const';
import axios from 'axios';
import params from '../../config/params';
import store from '../store';

/**
 * Acción para cargar los testimonios desde el servidor
 * @param  {Object} data Datos de filtro para la consulta
 * @return {Object}      Respuesta del servidor
 */

const actLoadTestimonies = (data, reload = true, noReloadOnEmpty = false) => {
    return dispatch => {

        const testimonies = store.getState().testimony.testimonies;

        let ids = [];

        if(!reload)
            _.map(testimonies, (el, i) => ids.push(el.id));

        return axios.post(params.URL_API+'testimony/list',{
        	texto:data.texto,
			tipo:data.tipo,
            categoria:data.categoria,
			estado:data.estado,
			departamento:data.departamento,
			municipio:data.municipio,
			fechaInicio:data.fechaInicio,
			fechaFin:data.fechaFin,
			tipoVista:data.tipoVista,
			mostrar:data.mostrar,	
			find:data.find,
			findNext:data.findNext,
			findPrevious:data.findPrevious,
            ids
        })
        .then((response) => {
        	if(!response.data.length && noReloadOnEmpty)
        		return response;

            dispatch({
            	type:types.LOAD,
            	testimonies:response.data,
            	reload,
            });
            
            return response;
        
        })
        .catch((error) => {
            return error.response;
        });
    }
}

/**
 * Accion para guardar una copia de los testimonios actuales en 
 * el store
 */
const actSaveBackup = () => ({
    type:types.SAVE_BACKUP
})

/**
 * Accion para restaurar una copia de seguridad 
 */
const actRestoreBackup = () => ({
    type:types.RESTORE_BACKUP
})

export {actLoadTestimonies, actSaveBackup, actRestoreBackup};