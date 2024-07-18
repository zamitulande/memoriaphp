import types from './const';
import axios from 'axios';
import params from '../../config/params';
import store from '../store';

/**
 * Acción para registrar una solicitud de investigación en el sistema
 * @param  {Oobject} data Datos necesarios para registrar una nueva solicitud de investigación en el sistema
 * @return {Object}      Respuesta del servidor
 */

const actRegisterAllies = (data) => {
    return dispatch => {
        return axios.post(params.URL_API+'allies/register',data)
        .then((response) => {            
            return response;
        
        })
        .catch((error) => {
            return error.response;
        });
    }
}

const actUpdateAllies =(data, alliesId)=>{
    return dispatch => {
        return axios.post(params.URL_API+'allies/update/'+alliesId,data)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
    }    
}


export {actRegisterAllies, actUpdateAllies};