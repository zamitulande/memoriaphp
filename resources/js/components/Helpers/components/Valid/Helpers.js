import React from 'react';

/**
 * Asigna el valor a un error
 * @param {String} name    Nombre identificador del error
 * @param {String} message Mensaje a mostrar en el error
 */
const setError = (name, message, context) => {
	context.setState((oldState, props) => {
		return {
			errors:Object.assign({},oldState.errors,{[name]:message})
		}
	})
}

/**
 * Deja en null un error en la lista de errores del campo
 * @param  {String} name Nombre identificador del error
 */
const clearError = (name, context) => {
	setError(name, null, context);
}

const clearAllErrors = (context) => {
	context.setState({errors:{}});
}

/**
 * Asigna el estado general de validacion del campo
 * @param {Boolean}  state 	Nuevo estado de la validación general del campo
 * @param {Boolean}  force 	Obliga a realizar el cambio sin importar condiciones
 */
const setValidState = (state, force = false, context) => {
	//El estado solo se puede cambiar libremente si está en true
	if(context.validState || force){
		context.validState = state;
	}
}

/**
 * Convierte en html los mensajes de error
 * @param  {[type]} context [description]
 * @return {[type]}         [description]
 */
const getErrors = (context) => {
	let errors = "";
	if(!("noRenderFails" in context.props)){
		errors = _.map(context.state.errors, (el, i) => {
					if(typeof el === "string")
	                	return <p key={i} style={{color:"#9f3a38", marginBottom:"0px"}}>{el}</p>
                });

		//une los mensajes enviados desde el componente que instancia
		_.map(context.state.otherErrors, (el, i) => {
			if(typeof el === "string")
            	errors.push(<p key={i} style={{color:"#9f3a38", marginBottom:"0px"}}>{el}</p>)
        });
	}

	return errors;
}

/**
 * Elimina espacios en blanco inecesarios al inicio y al final del texto
 * @param  {String} value Texto a evaluar
 * @return {String}       Texto sin espacios
 */
const trimEmptySpaces = (value) => {
	var stop = false;

    while (!stop){
        if(value.charAt(0) == ' '){
            value = value.trim();
        }else{
            stop = true;
        }
    }

    stop = false;
    //si tiene mas de un espacio al final
    while (!stop){
        if(value.charAt(value.length-1) == ' ' && value.charAt(value.length-2) == ' '){
            value = value.trim();
        }else{
            stop = true;
        }
    }

    return value;
}

export {
	setError,
	clearError,
	clearAllErrors,
	setValidState,
	getErrors,
	trimEmptySpaces
}