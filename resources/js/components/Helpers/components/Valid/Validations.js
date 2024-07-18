import { clearError, setError, setValidState } from './Helpers';

//mensajes de error a mostrar en las validaciones
const messagesRegExps = {
	alphanumeric:"Este campo sólo admite caracteres alfanuméricos.",
	alphanumericSpace:"Este campo sólo admite caracteres alfanuméricos.",
	
	alphabetical:"Este campo sólo admite caracteres alfabéticos.",
	alphabeticalSpace:"Este campo sólo admite caracteres alfabéticos.",
	
	numeric:"Este campo sólo admite caracteres numéricos.",
	numericNegative:"Este campo sólo admite caracteres numéricos negativos.",
	numericPositive:"Este campo sólo admite caracteres numéricos positivos.",

	integer:"Este campo solo admite números enteros.",
	integer_negative:"Este campo solo admite números enteros negativos.",
	integer_positive:"Este campo solo admite números enteros positivos.",

	decimal:"Este campo solo admite números decimales.",
	decimalNegative:"Este campo solo admite números decimales negativos.",
	decimalPositive:"Este campo solo admite números decimales positivos.",
	
	email:"Este campo no corresponde con una dirección de e-mail válida.",
}

//Expresiones regulares que validan los campos
const regExps = {
	alphanumeric:/^[A-Za-z\dñáéíóúü]+$/i,
	alphanumericSpace:/^[A-Za-z\dñáéíóúü ]+$/i,

	alphabetical:/^[A-Za-zñáéíóúü]+$/i,
	alphabeticalSpace:/^[A-Za-zñáéíóúü ]+$/i,

	integer:/^-?\d+$/i,
	integer_negative:/^-\d+$/i,
	integer_positive:/^\d+$/i,

	numeric:/^-?\d+,?\d*?$/i,
	numericNegative:/^-\d+,?\d*?$/i,
	numericPositive:/^\d+,?\d*?$/i,

	decimal:/^-?\d+,\d*$/i,
	decimalNegative:/^-\d+,\d*$/i,
	decimalPositive:/^\d+,\d*$/i,

	email:/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
}


/**
	 * Validación de la cantidad de caracteres permitidas para una entrada
	 * @param  {String} value Valor actual, el cual se evalua
	 * @param  {Int} min 	  Cantidad mínima de caracteres
	 * @param  {Int} max  	  Cantidad máxima de caracteres
	 * @return {Boolean}      Indica si el evento de la entrada debe continuar (mostrar la actualización)
	 */
const validateLength = (value, min = null, max = null) => {
	let validationState = true;
	let stopEvent = false;
	let validationMsj = "";

	if(min && value.length < min){
		validationState = false;
		//se envía el mensaje de error si existe texto
		validationMsj = value.length?"Este campo debe contener "+min+" caracteres como mínimo.":"";
	}

	if(max && value.length > max){
		//el estado de validacion sigue siendo correcto
		//porque no se debe dejar seguir el evento
		//por lo tanto el último caracter no se agrega
		validationState = true;
		stopEvent = true;
		validationMsj = "Este campo puede contener "+max+" caracteres como máximo.";
	}

	return {
		state:validationState,
		stopEvent,
		msj:validationMsj
	};
}

/**
 * Realiza la validación de las expresiones regulares
 * @param  {String} value           Texto a evaluar
 * @param  {String} nameRegExp      Nombre de la expresión regular (key de regExps y messagesRegExps)
 * @param  {String} updateStateWith Nombre del mensaje de expresion regular a mostrar (por defecto null para que imprima el correspondiente a la validación)
 * @return {Boolean}                Si se cumple o no la expresión regular
 */
const validateRegExp = (value, nameRegExp, updateStateWith = null, context) => {
	//si la cadena esta vacia y no es un campo obligatorio
	//o si es el signo (-) y la regExp es de un tipo numèrico que admite el simbolo
	//se toma como valido el texto
	if ((value.length == 0 && !("required" in context.props))
		|| 
		(value == "-" && (nameRegExp == 'numeric' || nameRegExp == 'integer' || nameRegExp == 'decimal' || nameRegExp == 'numericNegative' || nameRegExp == 'integer_negative'|| nameRegExp == 'decimalNegative'))
	) return true;

	var regex = new RegExp(regExps[nameRegExp]);
    if(regex.test(value)){
    	//si se desea ver un mensaje diferente es enviado con updateStateWith
    	//sino imprime el correspondiente a nameRegExp
    	clearError(updateStateWith?updateStateWith:nameRegExp, context);
    	return true;
    }else{
    	setError(updateStateWith?updateStateWith:nameRegExp, messagesRegExps[updateStateWith?updateStateWith:nameRegExp], context);
    	setValidState(false, false, context);
    	return false;
    }

    return false;
}

export {
	validateLength,
	validateRegExp
}