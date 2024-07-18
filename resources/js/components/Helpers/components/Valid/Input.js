import React, { Component, PropTypes } from 'react';

import { Segment, Form, Grid, TextArea, Popup, Icon } from 'semantic-ui-react';

import { clearError, setError, clearAllErrors, trimEmptySpaces, setValidState } from './Helpers';
import { validateRegExp, validateLength } from './Validations';
import { eventForValidationState } from './Events';

class Input extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			errors:{},//almacena los errores del campo
			otherErrors:props.errors,//errores enviados por el componente que instancia
			showPassword: false,
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleFocus = this.handleFocus.bind(this);

		//Determina si toda la validación del campo es correcta o falsa
		this.validState = "required" in this.props?false:true;

		//Determina si el evento producido en un input debe ejecutarse o no con la funcion
		//del componente que instancia a este
		this.stopEvent = false;

		//Almacena los datos de los eventos producidos
		this.inputEvent = null;
	}

	/**
	 * Valida las expresiones regulares de acuerdo a las propiedades del input
	 * y determina si el evento desencadenado debe continuar
	 */
	validationInputExpReg(){
		if("alphanumeric" in this.props){
			if(!validateRegExp(this.inputEvent.target.value, 'alphanumeric', null, this))this.stopEvent = true;
		}

		if("alphanumericSpace" in this.props){
			if(!validateRegExp(this.inputEvent.target.value, 'alphanumericSpace', null, this))this.stopEvent = true;
		}

		if("alphabetical" in this.props){
			if(!validateRegExp(this.inputEvent.target.value, 'alphabetical', null, this))this.stopEvent = true;
		}

		if("alphabeticalSpace" in this.props){
			if(!validateRegExp(this.inputEvent.target.value, 'alphabeticalSpace', null, this))this.stopEvent = true;
		}

		if("numeric" in this.props){
			if(!validateRegExp(this.inputEvent.target.value, 'numeric', null, this))this.stopEvent = true;
		}

		if("numericNegative" in this.props){
			if(!validateRegExp(this.inputEvent.target.value, 'numericNegative', null, this))this.stopEvent = true;
		}

		if("numericPositive" in this.props){
			if(!validateRegExp(this.inputEvent.target.value, 'numericPositive', null, this))this.stopEvent = true;
		}

		if("integer" in this.props){
			if(!validateRegExp(this.inputEvent.target.value, 'integer', null, this))this.stopEvent = true;
		}

		if("integer_negative" in this.props){
			if(!validateRegExp(this.inputEvent.target.value, 'integer_negative', null, this))this.stopEvent = true;
		}

		if("integer_positive" in this.props){
			if(!validateRegExp(this.inputEvent.target.value, 'integer_positive', null, this))this.stopEvent = true;
		}

		if("decimal" in this.props){
			if(!validateRegExp(this.inputEvent.target.value, 'numeric', 'decimal', this))this.stopEvent = true;
			validateRegExp(this.inputEvent.target.value, 'decimal', this)
		}

		if("decimalNegative" in this.props){
			if(!validateRegExp(this.inputEvent.target.value, 'numericNegative', 'decimalNegative', this))this.stopEvent = true;
			validateRegExp(this.inputEvent.target.value, 'decimalNegative', null, this)
		}

		if("decimalPositive" in this.props){
			if(!validateRegExp(this.inputEvent.target.value, 'numericPositive', 'decimalPositive', this))this.stopEvent = true;
			validateRegExp(this.inputEvent.target.value, 'decimalPositive', null, this)
		}

		if("email" in this.props){	
			this.inputEvent.target.value = this.inputEvent.target.value.trim();		
			validateRegExp(this.inputEvent.target.value, 'email', null, this);
		}
	}

	/**
	 * Funcion encargada de lanzar las validaciones del input
	 */
	validationInput(){
		const vLength = validateLength(this.inputEvent.target.value, this.props.min_length, this.props.max_length);
		
		this.stopEvent = vLength.stopEvent;

		//validacion falló
		if(!vLength.state && this.inputEvent.target.value.length || vLength.msj.length){
			setError('v_length', vLength.msj,this);
			setValidState(vLength.state, false, this);
		}else{
			//si el campo es requerido pero se encuentra vacio
			//la validacion se da por fallida
			if('required' in this.props && !this.inputEvent.target.value.length)
				setValidState(false, false, this);

			clearError('v_length', this);
		}

		//Validaciones contenidas en la lista de expresiones regulares
		this.validationInputExpReg();
	}

	/**
	 * Manejador del evento change del input
	 * @param  {Event}  e  Informaciòn del evento
	 */
	handleInputChange(e){
		this.inputEvent = e;
		let oldValidState = this.validState;
		//Se inicia en true el estado general de validación
		setValidState(true, true, this);
		this.stopEvent = false;

		//se borran espacios en blanco del valor del input
		this.inputEvent.target.value = trimEmptySpaces(this.inputEvent.target.value);

		if(this.inputEvent.target.value.length > 0){
			this.validationInput();		
		}else{
			clearAllErrors(this);
			if("required" in this.props){
				setValidState(false, true, this);
			}else{
				setValidState(true, true, this);
			}
		}

		if(this.stopEvent){
			//si el campo no es requerido y hay un solo caracter
			//la validación queda positiva ya que el evento se cancela
			//y el campo queda vacio
			if(!("required" in this.props) && this.inputEvent.target.value.length == 1){
				this.validState = true;
			}
			return
		}

		//si se está borrando texto de la entrada
		if(e.nativeEvent.inputType == "deleteContentBackward" || e.nativeEvent.inputType == "deleteContentForward"){
			//si la ultima validación es negativa y la actual también
			//se cambia el valor de la ultima validación para que sea diferente de la actual
			//y se lance el evento onFalseValid
			if(!oldValidState && !this.validState)
				oldValidState = true;
		}
			
		//se lanza la función asignada al evento onChange en el 
		//componente que instancia a este
		if(this.props.onChange)
			this.props.onChange(this.inputEvent, this.inputEvent.target);	

		//dispara eventos de estado general de validación
		eventForValidationState(oldValidState, this, this.inputEvent.target.value, this.inputEvent.target.name);
	}

	handleBlur(e){
		//valida si el campo es requerido
		if("required" in e.target && e.target.required){
			if(e.target.value.length == 0){
				setError("required","Este campo es obligatorio", this);
			}else{
				clearError("required", this);
			}
		}

		//valida si los numeros decimales terminan en coma, antes de salir agrega un 0
		if(
			(
				"numeric" in this.props ||
				"numericNegative" in this.props ||
				"numericPositive" in this.props ||
				"decimal" in this.props ||
				"decimalNegative" in this.props ||
				"decimalPositive" in this.props
			) && e.target.value.charAt(e.target.value.length-1) == ","
		) e.target.value = e.target.value + "0";

		//llamado a la función onBlur establecida al instanciar componente
		if(this.props.onBlur)
			this.props.onBlur(e);	
	}

	handleFocus(e){
		if("required" in e.target && e.target.required)
			clearError("required", this);

		if(this.props.onFocus)
			this.props.onFocus(e, e.target);	
	}

	componentWillReceiveProps(nextProps) {
	    this.setState({otherErrors:nextProps.errors});
	}

	togglePasswordVisibility = () => {
		this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
	  };
	

	render(){
		//se sacan las propiedades admitidas para Form.Input
		const {id, name, type, value, label, required, placeholder, max} = this.props;
		const propsInput = {id, name, type, value, label, required, placeholder, max};
		

		let errors = "";
		if(!("noRenderFails" in this.props)){
			errors = _.map(this.state.errors, (el, i) => {
						if(typeof el === "string")
						return <p key={i} style={{color:"white", marginBottom:"0px"}}>{el}</p>
	                });

			//une los mensajes enviados desde el componente que instancia
			_.map(this.state.otherErrors, (el, i) => {
				if(typeof el === "string")
				errors.push(<p key={i} style={{backgroundColor:"red", color:"white", marginBottom:"0px"}}>{el}</p>)
            });
		}

		let inputRender = ("textArea" in this.props)?
							<Form.Input   control={TextArea} {...propsInput}  onChange={this.handleInputChange} onBlur={this.handleBlur} onFocus={this.handleFocus}/>:
							<Form.Input icon={
								type === 'password' ? (
								<Icon
								  name={this.state.showPassword ? 'eye' : 'eye slash outline'}
								  link
								  onMouseEnter={() => this.setState({ showPassword: true})}
                                  onMouseLeave={() => this.setState({ showPassword: false})}
								/>
								) : null
							  }
							 {...propsInput} 
							 
							 type={type === 'password' && this.state.showPassword ? 'text' : type} onChange={this.handleInputChange} onBlur={this.handleBlur} onFocus={this.handleFocus}/>
		let input_render = <Segment basic style={{padding:'0px', marginTop:'-10px', marginBottom:'30px'}}>
							{inputRender}
							<Segment basic style={{padding:'0px', marginTop:'-10px'}}>
								{ errors }
							</Segment>
						</Segment>

        if('wrapperColumn' in this.props){
        	input_render = <Grid.Column>
						<Segment basic style={{padding:'0px', marginTop:'-10px', marginBottom:'30px'}}>
							{inputRender}
							<Segment basic style={{padding:'0px', marginTop:'-10px'}}>
								{ errors }
							</Segment>
						</Segment>
					</Grid.Column>
        }

        if('help' in this.props){
        	input_render = <Popup content={this.props.help}
					on='focus'
					size="mini"
					position="top left"
					trigger={input_render} />;
        }

		return input_render;
	} 
}

export default Input;