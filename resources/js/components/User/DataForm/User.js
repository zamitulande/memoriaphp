import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { actRegisterUser, actUpdateUser } from '../../../redux/RegisterUser/actions';
import axios from 'axios';
import params from '../../../config/params';

import { Grid, Form, Checkbox, Button, Icon, Segment, Container,Select,Message, Modal, Header, Input } from 'semantic-ui-react';
import GeneralMessage from '../../Helpers/components/GeneralMessage';
import { Btn, Valid, SearchServer } from '../../Helpers/Helpers';
import {options_genero, options_nivel_estudios, options_rango_edad, options_poblacion, options_estado_civil, options_situacion_laboral, options_discapacidad, options_regimen_salud, options_ingreso_economico, options_estrato_socioeconomico, options_convive} from './Options'


import {animateScroll} from 'react-scroll';


class User extends Component {

    constructor(props) {
        super(props);

        const stateFormValidations = ("userId" in this.props && this.props.userId)?true:false;

        this.state={
        	id:"userId" in this.props?this.props.userId:false,
        	numero_identificacion:"",
        	nombres:"",
        	apellidos:"",
        	email:"",
        	genero:"",
			rango_edad:"",
			poblacion:"",
			estado_civil:"",
			situacion_laboral:"",
			discapacidad:"",
			regimen_salud:"",
			ingreso_economico:"",
			estrato_socioeconomico:"",
			convive:"",
			nivel_estudio:"",
        	password:"",
        	password_confirmation:"",
        	telefono:"",			
			fecha_nacimiento:"",
			direccion:"",
			municipio_id:"",
			consentimientoInformado:"",
			terminos_condiciones:("userId" in this.props && this.props.userId)?true:false,
			victima_minas:false,
			formValidations:{
	        	numero_identificacion:stateFormValidations,
	        	nombres:stateFormValidations,
	        	apellidos:stateFormValidations,
	        	email:stateFormValidations,
	        	genero:stateFormValidations,
				rango_edad:stateFormValidations,
				poblacion:stateFormValidations,
				estado_civil:stateFormValidations,
				situacion_laboral:stateFormValidations,
				discapacidad:stateFormValidations,
				regimen_salud:stateFormValidations,
				ingreso_economico:stateFormValidations,
				estrato_socioeconomico:stateFormValidations,
				convive:stateFormValidations,
	        	password:("noRenderPassword" in this.props)?true:stateFormValidations,
	        	password_confirmation:("noRenderPasswordConfirmation" in this.props)?true:stateFormValidations,
	        	telefono:true,
				nivel_estudio:stateFormValidations,
				fecha_nacimiento:stateFormValidations,
				direccion:stateFormValidations,
				municipio_id:stateFormValidations,				
				consentimientoInformado:!("renderConsentimientoInformado" in this.props)?true:stateFormValidations,					
				terminos_condiciones:("noRenderTyC" in this.props)?true:stateFormValidations					
			},
			formErrors:{
				numero_identificacion:[],
	        	nombres:[],
	        	apellidos:[],
	        	email:[],
	        	genero:[],
				rango_edad:[],
				poblacion:[],
				estado_civil:[],
				situacion_laboral:[],
				discapacidad:[],
				regimen_salud:[],
				ingreso_economico:[],
				estrato_socioeconomico:[],
				convive:[],
	        	password:[],
	        	password_confirmation:[],
	        	telefono:[],
				nivel_estudio:[],
				fecha_nacimiento:[],
				direccion:[],
				municipio_id:[],
				consentimientoInformado:[],
			},
			formIsValid:false,
			resetFiles:false
        };

        this.handleUpdateState = this.handleUpdateState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.onTrueValid = this.onTrueValid.bind(this);
        this.handleFocus = this.handleFocus.bind(this);        
        this.onFalseValid = this.onFalseValid.bind(this);
        this.setFormIsValid = this.setFormIsValid.bind(this);        
        this.handleSearchServerSelect = this.handleSearchServerSelect.bind(this);        
        this.handleSearchChange = this.handleSearchChange.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        if("resetForm" in nextProps && nextProps.resetForm){
        	this.setState({
        		numero_identificacion:"",
	        	nombres:"",
	        	apellidos:"",
	        	email:"",
	        	genero:"",
				rango_edad:"",
				poblacion:"",
				estado_civil:"",
				situacion_laboral:"",
				discapacidad:"",
				regimen_salud:"",
				ingreso_economico:"",
				estrato_socioeconomico:"",
				convive:"",
	        	password:"",
	        	password_confirmation:"",
	        	telefono:"",
				nivel_estudio:"",
				fecha_nacimiento:"",
				direccion:"",
				municipio_id:"",
				resetFiles:true,
				formValidations:Object.assign({}, this.state.formValidations, {
					terminos_condiciones:("noRenderTyC" in this.props)?true:(("userId" in this.props && this.props.userId)?true:false)					
				}),
        	})
        }else{
        	this.setState({
				resetFiles:false
        	})
        }

        if("formErrors" in nextProps){
	        this.setState({
	        	formErrors:nextProps.formErrors
	        })
	    }
    }		

    componentDidMount() {
    	//indica que es una actualización
        if("userId" in this.props && this.props.userId){
        	this.setState({
        		loading:true
        	});

        	axios.post(params.URL_API+"user/show/"+this.props.userId)
        	.then(
        		(response) => {        			
        			this.setState({
		        		//formIsValid:true,
		        		loading:false,
		        		numero_identificacion:response.data.numero_identificacion?response.data.numero_identificacion:"",
		        		nombres:response.data.nombres?response.data.nombres:"",
		        		apellidos:response.data.apellidos?response.data.apellidos:"",
		        		fecha_nacimiento:response.data.fecha_nacimiento?response.data.fecha_nacimiento:"",
		        		genero:response.data.genero?response.data.genero:"",
						rango_edad:response.data.rango_edad?response.data.rango_edad:"",
						poblacion:response.data.poblacion?response.data.poblacion:"",
						estado_civil:response.data.estado_civil?response.data.estado_civil:"",
						situacion_laboral:response.data.situacion_laboral?response.data.situacion_laboral:"",
						discapacidad:response.data.discapacidad?response.data.discapacidad:"",
						regimen_salud:response.data.regimen_salud?response.data.regimen_salud:"",
						ingreso_economico:response.data.ingreso_economico?response.data.ingreso_economico:"",
						estrato_socioeconomico:response.data.estrato_socioeconomico?response.data.estrato_socioeconomico:"",
						convive:response.data.convive?response.data.convive:"",
		        		email:response.data.email?response.data.email:"",
		        		telefono:response.data.telefono?response.data.telefono:"",
		        		nivel_estudio:response.data.nivel_estudio?response.data.nivel_estudio:"",
		        		municipio_id:response.data.municipio_id?response.data.municipio_id:"",
		        		direccion:response.data.direccion?response.data.direccion:"",
		        		victima_minas:response.data.victima_minas?true:false
		        	}, () => this.handleUpdateState(), this.setFormIsValid());

        		}, 
        		(error) => {        		
        			this.setState({
		        		loading:false
		        	});
        		}
    		)
        }
    }

    handleUpdateState(){
    	setTimeout(() => {
			if('onUpdate' in this.props){
				const {
					id,
					numero_identificacion,
					nombres,
					apellidos,
					fecha_nacimiento,
					genero,
					rango_edad,
					poblacion,
					estado_civil,
					situacion_laboral,
					discapacidad,
					regimen_salud,
					ingreso_economico,
					estrato_socioeconomico,
					convive,
					email,
					telefono,
					nivel_estudio,
					password,
					password_confirmation,
					municipio_id,
					direccion,
					consentimientoInformado,
					victima_minas,
					formErrors
				} = this.state;

				this.props.onUpdate({
					id,
					numero_identificacion,
					nombres,
					apellidos,
					fecha_nacimiento,
					genero,
					rango_edad,
					poblacion,
					estado_civil,
					situacion_laboral,
					discapacidad,
					regimen_salud,
					ingreso_economico,
					estrato_socioeconomico,
					convive,
					email,
					telefono,
					nivel_estudio,
					password,
					password_confirmation,
					municipio_id,
					direccion,
					consentimientoInformado,
					victima_minas,
					formErrors
				});
			}
		}, 10);
    }

    handleInputChange(e, props_){
    	if(e.target.type == "file"){
    		this.setState({
    			[props_.name]:e.target.files[0]
    		})

    		if(e.target.files[0]){
    			this.onTrueValid({name:props_.name})
    		}else{
    			this.onFalseValid({name:props_.name})
    		}

    		this.handleUpdateState();
    		return
    	}

        let value = (props_.type == 'checkbox')?(props_.checked?true:false):props_.value;
		
        this.setState({ [props_.name]:  value});

        //acepta terminos y condiciones
        if(props_.type == 'checkbox'){
        	if(value)
        		this.onTrueValid({name:props_.name});
    		else
    			this.onFalseValid({name:props_.name});
        }
        
        this.handleUpdateState();
    }

    handleSelectChange(e, {name, value}){
        this.setState({ [name]:  value});
        this.onTrueValid({name});
        this.handleUpdateState();
    }

    handleFocus(e, {name}){
        this.setState((oldState, props) => {
            return {formErrors: Object.assign({}, oldState.formErrors, {[name]:[]})}
        })
        this.handleUpdateState();
    }

    /*=========================================================
    =            Estado de validaciòn de formulario            =
    =========================================================*/    

    setFormIsValid(){
        setTimeout(() => {
        	const lastFormIsValid = this.state.formIsValid;
        	const exceptions = ["victima_minas"];
            let isValid = true;
            _.map(this.state.formValidations, (value, key) => {
            	if(exceptions.indexOf(key) < 0)
                	if(!value)isValid = false;
            });
            this.setState({
                formIsValid:isValid
            })

            if("onFormStateChange" in this.props && lastFormIsValid != isValid){
            	this.props.onFormStateChange(isValid);
            }
        }, 10)
    }


    onTrueValid({name}){
        this.setState((oldState, props) => {
            return {
                formValidations:Object.assign({},oldState.formValidations,{[name]:true})
            }
        });

        this.setFormIsValid();
    }

    onFalseValid({name}){
        this.setState((oldState, props) => {
            return {
                formValidations:Object.assign({},oldState.formValidations,{[name]:false})
            }
        });

        this.setFormIsValid();
    }   

	/*=====  Fin de Estado de validaciòn de formulario  ======*/

	handleSearchServerSelect(e, {input, result}){
		this.setState({[input.name]:result.key})
		this.onTrueValid(input);
	}
	

	handleSearchChange(e, {input, result}){
		this.setState({[input.name]:null})
		this.onFalseValid(input);
	}

    render() {
    	const {numero_identificacion, 
			nombres, 
			apellidos, 
			email,
			genero,
			rango_edad,
			poblacion,
			estado_civil,
			situacion_laboral,
			discapacidad,
			regimen_salud,
			ingreso_economico,
			estrato_socioeconomico,
			convive,
			password,
			password_confirmation,
			telefono,nivel_estudio,
			fecha_nacimiento,
			direccion,
			municipio_id,
			terminos_condiciones,
			loading, formIsValid, 
			formErrors, 
			success, 
			resetFiles, 
			victima_minas } = this.state;
    	
    	let limiteFechaNacimiento = new Date();
    	limiteFechaNacimiento.setFullYear(limiteFechaNacimiento.getFullYear() - 18);

    	const yyyy = limiteFechaNacimiento.getFullYear();
    	const mm = (limiteFechaNacimiento.getMonth() + 1) < 10?"0"+(limiteFechaNacimiento.getMonth() + 1):(limiteFechaNacimiento.getMonth() + 1);
    	const dd = limiteFechaNacimiento.getDate() < 10?"0"+limiteFechaNacimiento.getDate():limiteFechaNacimiento.getDate();

    	limiteFechaNacimiento = yyyy+"-"+mm+"-"+dd;

    	let fieldPassword = <Valid.Input	      		                    
	                    id="password" 
	                    name="password" 
	                    value={password} 
	                    label="Contraseña" 
	                    type="password" 
	                    onChange={this.handleInputChange} 
	                    onTrueValid={this.onTrueValid} 
	                    onFalseValid={this.onFalseValid}
	                    onFocus={this.handleFocus}
	                    required
	                    min_length={8} 
	                    max_length={60}  
	                    errors={formErrors.password}
	                    wrapperColumn
	                />;

	    let fieldpassword_confirmation = <Valid.Input	      		                    
	                    id="password_confirmation" 
	                    name="password_confirmation" 
	                    value={password_confirmation} 
	                    label="Confirme su contraseña" 
	                    type="password" 
	                    onChange={this.handleInputChange} 
	                    onTrueValid={this.onTrueValid} 
	                    onFalseValid={this.onFalseValid}
	                    onFocus={this.handleFocus}
	                    required
	                    min_length={8} 
	                    max_length={60}  
	                    errors={formErrors.password_confirmation}
	                    wrapperColumn
	                />;

	    let fielterminos_condiciones = ("resetForm" in this.props && this.props.resetForm)?"":<Grid.Column width={16}>			               					   
						  					<Form.Checkbox name="terminos_condiciones" inline label='Estoy de acuerdo con los Términos y Condiciones. Vea términos y condiciones con el botón [ Ver términos y condiciones ]' required onChange={this.handleInputChange}/>
		            					</Grid.Column>;

	    let fieldVictimaMinas = resetFiles?"":<Grid.Column computer={16}>
						  					<Form.Checkbox name="victima_minas" inline label='¿Ha sido víctima de minas antipersona?' onChange={this.handleInputChange} checked={victima_minas}/>
		            					</Grid.Column>;
	
	    let fieldConsentimientoInformado = <Grid.Column className="field required padding-top-none margin-top-none">
	    									<Valid.File
	    										maxSize={1}
	    										label="Autorizaciones"
	    										name="consentimientoInformado"
	    										onChange={this.handleInputChange} 
	    										onFocus={this.handleFocus} 
	    										accept=".pdf"
	    										required
	    										errors={formErrors.consentimientoInformado}
	    										reset={resetFiles}
	    									 />
		            					</Grid.Column>;

	    if("userId" in this.props && this.props.userId){
	    	fieldPassword = "";
	    	fieldpassword_confirmation="";
	    	fielterminos_condiciones="";
	    	//fieldVictimaMinas = "";
	    }

	    if(!("renderConsentimientoInformado" in this.props)) fieldConsentimientoInformado = "";
	    if("noRenderPassword" in this.props)fieldPassword = "";
	    if("noRenderPasswordConfirmation" in this.props)fieldpassword_confirmation = "";
	    if("noRenderTyC" in this.props)fielterminos_condiciones = "";
	    if("noRenderVictimaMinas" in this.props)fieldVictimaMinas = "";
    	
        return (
        	<Grid stackable doubling columns={3}>	
          		<Valid.Input 		                    
	                    type="text" 
	                    name="numero_identificacion" 
	                    id="numero_identificacion" 
	                    value={numero_identificacion} 
	                    label='Número de identificación' 
	                    onTrueValid={this.onTrueValid} 
	                    onFalseValid={this.onFalseValid} 
						onChange={this.handleInputChange}
	                    onFocus={this.handleFocus} 				                    			                    
	                    required
	                    numeric
	                    min_length={6}
	                    max_length={10}
	                    wrapperColumn
	                    errors={formErrors.numero_identificacion}
	                />

          		<Valid.Input 
	                    type="text" 
	                    name="nombres" 
	                    id="nombres" 
	                    value={nombres.toUpperCase()} 
	                    label='Nombres'
	                    onTrueValid={this.onTrueValid} 
	                    onFalseValid={this.onFalseValid} 			                     
	                    onChange={this.handleInputChange} 
	                    onFocus={this.handleFocus}
	                    required
	                    min_length={3}
	                	max_length={60}			                
	                    wrapperColumn
	                    errors={formErrors.nombres}
	                    alphabeticalSpace
	                />   
                
          		<Valid.Input 
	                    type="text" 
	                    name="apellidos" 
	                    id="apellidos" 
	                    value={apellidos.toUpperCase()} 
	                    label='Apellidos' 
	                    onTrueValid={this.onTrueValid} 
	                    onFalseValid={this.onFalseValid} 			                    
	                    onChange={this.handleInputChange}
	                    onFocus={this.handleFocus} 
	                    required
	                    min_length={3}
	                	max_length={60}			                
	                    wrapperColumn
	                    errors={formErrors.apellidos}
	                    alphabeticalSpace
	                />

                <Valid.Input  
                    type="Date" 
                    name="fecha_nacimiento" 
                    id="fecha_nacimiento" 
                    value={fecha_nacimiento} 
                    label='Fecha de nacimiento'
                    onTrueValid={this.onTrueValid} 
                    onFalseValid={this.onFalseValid}		                    
                    onChange={this.handleInputChange} 
                    onFocus={this.handleFocus}
                    required
                    wrapperColumn
                    errors={formErrors.fecha_nacimiento}
                    max={limiteFechaNacimiento}
                /> 			                

	        	<Grid.Column required>
	        		<Segment basic className="no-padding margin-bottom-30" style={{marginTop:'-10px'}}>
	        			<Form.Select required name="genero" fluid label="Genero" options={options_genero} placeholder="Seleccione" value={genero} onChange={this.handleSelectChange} errors={formErrors.genero}/>
        		 	</Segment>
	        	</Grid.Column>	

				<Grid.Column required>
	        		<Segment basic className="no-padding margin-bottom-30" style={{marginTop:'-10px'}}>
	        			<Form.Select required name="rango_edad" fluid label="Rango de edad" options={options_rango_edad} placeholder="Seleccione" value={rango_edad} onChange={this.handleSelectChange} errors={formErrors.rango_edad}/>
        		 	</Segment>
	        	</Grid.Column>	

				<Grid.Column required>
	        		<Segment basic className="no-padding margin-bottom-30" style={{marginTop:'-10px'}}>
	        			<Form.Select required name="poblacion" fluid label="Poblacion" options={options_poblacion} placeholder="Seleccione" value={poblacion} onChange={this.handleSelectChange} errors={formErrors.poblacion}/>
        		 	</Segment>
	        	</Grid.Column>	

				<Grid.Column required>
	        		<Segment basic className="no-padding margin-bottom-30" style={{marginTop:'-10px'}}>
	        			<Form.Select required name="estado_civil" fluid label="Estado Civil" options={options_estado_civil} placeholder="Seleccione" value={estado_civil} onChange={this.handleSelectChange} errors={formErrors.estado_civil}/>
        		 	</Segment>
	        	</Grid.Column>

				<Grid.Column required>
	        		<Segment basic className="no-padding margin-bottom-30" style={{marginTop:'-10px'}}>
	        			<Form.Select required name="situacion_laboral" fluid label="Situacion Laboral" options={options_situacion_laboral} placeholder="Seleccione" value={situacion_laboral} onChange={this.handleSelectChange} errors={formErrors.situacion_laboral}/>
        		 	</Segment>
	        	</Grid.Column>

				<Grid.Column required>
	        		<Segment basic className="no-padding margin-bottom-30" style={{marginTop:'-10px'}}>
	        			<Form.Select required name="discapacidad" fluid label="Discapacidad" options={options_discapacidad} placeholder="Seleccione" value={discapacidad} onChange={this.handleSelectChange} errors={formErrors.discapacidad}/>
        		 	</Segment>
	        	</Grid.Column>

				<Grid.Column required>
	        		<Segment basic className="no-padding margin-bottom-30" style={{marginTop:'-10px'}}>
	        			<Form.Select required name="regimen_salud" fluid label="Regimen Salud" options={options_regimen_salud} placeholder="Seleccione" value={regimen_salud} onChange={this.handleSelectChange} errors={formErrors.regimen_salud}/>
        		 	</Segment>
	        	</Grid.Column>

				<Grid.Column required>
	        		<Segment basic className="no-padding margin-bottom-30" style={{marginTop:'-10px'}}>
	        			<Form.Select required name="ingreso_economico" fluid label="Ingreso Economico" options={options_ingreso_economico} placeholder="Seleccione" value={ingreso_economico} onChange={this.handleSelectChange} errors={formErrors.ingreso_economico}/>
        		 	</Segment>
	        	</Grid.Column>

				<Grid.Column required>
	        		<Segment basic className="no-padding margin-bottom-30" style={{marginTop:'-10px'}}>
	        			<Form.Select required name="estrato_socioeconomico" fluid label="Estrato Socioeconomico" options={options_estrato_socioeconomico} placeholder="Seleccione" value={estrato_socioeconomico} onChange={this.handleSelectChange} errors={formErrors.estrato_socioeconomico}/>
        		 	</Segment>
	        	</Grid.Column>

				<Grid.Column required>
	        		<Segment basic className="no-padding margin-bottom-30" style={{marginTop:'-10px'}}>
	        			<Form.Select required name="convive" fluid label="Convive con" options={options_convive} placeholder="Seleccione" value={convive} onChange={this.handleSelectChange} errors={formErrors.convive}/>
        		 	</Segment>
	        	</Grid.Column>

                  <Valid.Input	
                    id="email"
                    name="email"
                    value={email}
                    label='Correo electrónico'		                   
                    type="text" 		                     		                     		                     		                     
                    onTrueValid={this.onTrueValid} 
                    onFalseValid={this.onFalseValid} 		                    
                    onChange={this.handleInputChange} 
                    onFocus={this.handleFocus}
                    required
                    email
                    wrapperColumn
                    max_length={100}
                    min_length={7}
                    errors={formErrors.email}
                />	

                <Valid.Input 
                    type="text" 
                    name="telefono" 
                    id="telefono" 
                    value={telefono} 
                    label='Número de celular'
                    onTrueValid={this.onTrueValid} 
                    onFalseValid={this.onFalseValid} 			                	                    
                    onChange={this.handleInputChange}
                    onFocus={this.handleFocus}		                     
                    numeric
	                min_length={10}
	                max_length={15}	 
                    wrapperColumn
                    errors={formErrors.telefono}
                /> 	
                		                
    			<Grid.Column>
	        		<Segment basic className="no-padding margin-bottom-30" style={{marginTop:'-10px'}}>
	        			<Form.Select required name="nivel_estudio" fluid label="Nivel de estudios" options={options_nivel_estudios} placeholder="Seleccione" value={nivel_estudio} onChange={this.handleSelectChange} errors={formErrors.nivel_estudio}/>
        		 	</Segment>
	        	</Grid.Column>	         

                <Grid.Column>
                	<Segment basic className="no-padding margin-bottom-30" style={{marginTop:'-10px'}}>
                		<SearchServer required name="municipio_id" label="Municipio" url={params.URL_API+"query/municipios"} handleResultSelect={this.handleSearchServerSelect} handleSearchChange={this.handleSearchChange}/>
                	</Segment>	                	
                </Grid.Column>

                <Valid.Input  
                    type="text" 
                    name="direccion" 
                    id="direccion" 
                    value={direccion.toUpperCase()} 
                    label='Dirección' 
                    onTrueValid={this.onTrueValid} 
                    onFalseValid={this.onFalseValid}		                    
                    onChange={this.handleInputChange}
                    onFocus={this.handleFocus} 
                    required
                    min_length={3} 
                    max_length={60}  
                    errors={formErrors.direccion}		                    
                    wrapperColumn
                /> 			                	                		                	                                

                {fieldConsentimientoInformado}

                {fieldPassword}
                {fieldpassword_confirmation}
                {fieldVictimaMinas}
                {fielterminos_condiciones}
            </Grid>  	            
        );
    }
}

export default User;
