import types from './const';
import { actRemoveAllNotifications } from '../notifications/actions';
import axios from 'axios';

import params from '../../config/params';

/**
 * Acción para loguear un usuario
 * @param  {object}         user Objeto con las credenciales del usuario
 * @return {null/object}         Si se loguea correctamente despacha la acción 
 *                               de login para actualizar los valores del store
 *                               en los datos de autenticación. De lo contrario
 *                               retorna el error obtenido del servidor para que pueda
 *                               ser manejado en el componente que llamo a la acción
 */
const actLogin = (user) => {
    return dispatch => {
        return axios.post(params.URL+'/api/login',{
            'username':user.username,
            'password':user.password,
            'rememberMe':user.remember,
        })
        .then((response) => {
            dispatch({
                    type:types.LOGIN,
                    rememberMe:user.remember,
                    user:response.data.user
                });
        })
        .catch((error) => {
            return error.response.data;
        });
    }
}

/**
 * Acción para cambiar los datos de estado autenticación en el store
 * cuando existen cookies de autenticación, no hace llamado al servidor
 * @param  {boolean} rememberMe Si la sesión del usuario logueado debe ser recordada
 */
const actLoginCookie = (rememberMe, user) => {
    return { type:types.LOGIN, rememberMe, user};
}

/**
 * Acción para cerrar la sesión de un usuario con llamado a sevidor
 */
const actLogout = (reload = false) => {
    return dispatch => {
        return axios.post(params.URL+'/api/logout')
        .then((response) => {
            setTimeout(() => {
                //se despacha la acción para cambiar los valores de los datos de estado
                //de autenticación en el store
                dispatch({
                    type:types.LOGOUT
                });

                dispatch(actRemoveAllNotifications());
                if(reload)
                    window.location.reload();
            }, 100);
        })
        .catch((error) => {
        });
    }
}

/**
 * Acción para solicitar restablecimiento de contraseña
 * @param  {Numeric} identificationNumber Número de identificación de la persona
 * @return {Object}                       Respuesta del servidor
 */
const actSendPassResetRequest = (identificationNumber) => {
    return dispatch => {
        return axios.post(params.URL+'/api/forgot-password',{
            identificationNumber
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
    }
}

/**
 * Acción para restablecer la contraseña de un usuario
 * @param  {Oobject} data Datos necesarios para restablecimiento de contraseña
 * @return {Object}      Respuesta del servidor
 */
const actResetPassword = (data) => {
    return dispatch => {
        return axios.post(params.URL+'/api/reset-password',{
            email:data.email,
            password:data.password,
            password_confirmation:data.password_confirmation,
            token:data.token
        })
        .then((response) => {
            return dispatch(actLogin({
                'username':data.email,
                'password':data.password,
                rememberMe:false
            }));
        })
        .catch((error) => {
            return error.response;
        });
    }
}

const actChangePassword = (data) => {
    return dispatch => {
        return axios.post(params.URL+'/api/change-password',{
            password:data.password,
            new_password:data.new_password,
            new_password_confirmation:data.password_confirmation,
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
    }
}

export {actLogin, actLogout, actLoginCookie, actSendPassResetRequest, actResetPassword, actChangePassword};
