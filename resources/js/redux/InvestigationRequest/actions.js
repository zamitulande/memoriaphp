import types from './const';
import axios from 'axios';
import params from '../../config/params';
import store from '../store';

/**
 * Acción para registrar una solicitud de investigación en el sistema
 * @param  {Oobject} data Datos necesarios para registrar una nueva solicitud de investigación en el sistema
 * @return {Object}      Respuesta del servidor
 */

const actRegisterInvestigationRequest = (data) => {
    return dispatch => {
        const formData = new FormData();

        formData.append("nombres",data.nombres);
        formData.append("apellidos",data.apellidos);
        formData.append("email",data.email);
        formData.append("telefono",data.telefono);
        formData.append("direccion",data.direccion);
        formData.append("observaciones",data.observaciones);
        formData.append("tipo_solicitante",data.tipo_solicitante);
        formData.append("formato",data.formato);
        
        let indice = 1;
        _.map(data.annexesValues, (el, i) => {
            formData.append("file_"+indice,el);
            indice++;
        })

        return axios.post(params.URL_API+'investigation_request/register',formData,
        {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        )
        .then((response) => {            
            return response;
        
        })
        .catch((error) => {
            return error.response;
        });
    }
}

export {actRegisterInvestigationRequest};