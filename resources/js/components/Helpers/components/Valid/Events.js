/**
 * Determina si disparar o no un evento cuando el input queda vacio o se agrega un dato
 */
const eventForInputEmptyNoEmpty = (name, value, context) => {
	//si el campo esta vacio, pero es requerido se lanza evento 
	//que indica que la validación no fue correcta
	if (
			(value.length == 0 && ("required" in context.props))
			&& ("onFalseValid" in context.props)
		){
		context.props.onFalseValid({name, value});
		return	
	}

	//si el campo no esta vacio y la validaciòn ha sido correcta
	//se lanza el evento que indica que la validaciòn fue correcta
	if (
			(value.length > 0 && ("required" in context.props))
			&& ("onTrueValid" in context.props) && context.validState
		){
		context.props.onTrueValid({name, value});
		return	
	}

	//si el campo esta vacio y no es requerido
	if (
			(value.length == 0 && !("required" in context.props))
			&& ("onTrueValid" in context.props)
		){
		context.props.onTrueValid({name, value});
		return	
	}

}

/**
 * Lanza un evento de acuerdo al estado anterior y actual de la validación general del input
 * @param  {boolean} oldValidState Estado enterior de la validación general
 */
const eventForValidationState = (oldValidState, context, value, name) => {
	//Lanza el evento 'onTrueValid' cuando el estado actual es true y el anterior es false 
	if(context.validState && context.validState != oldValidState && context.props.onTrueValid){
		context.props.onTrueValid({name, value});
		return
	}

	//Lanza el evento 'onFalseValid' cuando el estado actual es false y el anterior es true
	if(!context.validState && context.validState != oldValidState && context.props.onFalseValid){
		context.props.onFalseValid({name, value});
		return
	}

	eventForInputEmptyNoEmpty(name, value, context);
}

export {
	eventForValidationState,
	eventForInputEmptyNoEmpty
}