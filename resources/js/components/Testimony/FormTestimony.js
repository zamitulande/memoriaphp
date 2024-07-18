import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { actOpenFullLoader, actCloseFullLoader } from '../../redux/fullLoader/actions';
import axios from 'axios';
import params from '../../config/params';

import { Step, Form, Confirm, Segment, Icon, Dropdown, Header, TextArea, Item } from 'semantic-ui-react';
import GeneralMessage from '../Helpers/components/GeneralMessage';
import { Btn, Valid } from '../Helpers/Helpers';

import Testimony from './DataForm/Testimony';
import User from '../User/DataForm/User';

import Template1 from './Templates/Template1';
import Template2 from './Templates/Template2';
import Template3 from './Templates/Template3';
import Template4 from './Templates/Template4';

import {animateScroll} from 'react-scroll';

class FormTestimony extends Component {
    
    constructor(props) {
        super(props);

        this.isUpdate = ("testimony" in this.props);

        this.state={
			loading:false,
			confirmModalState:false,
			
			dataTestimony:this.isUpdate?this.props.testimony:null,
			stateFormTestimony:false,
			formTestimonyErrors:{
	        	titulo:[],
	        	descripcionCorta:[],
	        	fechaEvento:[],
				municipioTestimonio:[],
	        	ubicacion:[],
	        	tipoTestimonio:[],
				categoriaTestimonio:[],
	        	observaciones:[],
			},

			dataUser:this.isUpdate?props.testimony.usuario:(props.userType == "Administrador"?{}:props.user),
			stateFormUser:this.isUpdate?true:(props.userType == "Administrador"?false:true),
			formUserErrors:[],

			activeStep:this.isUpdate?"testimony":(props.userType == "Administrador"?"user":"testimony"),
			template:1,
			resetForms:false,
			errors:[],
			showOptionsSave:false,
			onlySave:false,
			saveAndApprove:false,
			saveAndCancel:false
        }

        this.setActiveStep = this.setActiveStep.bind(this);
        this.send = this.send.bind(this);
    }

    setActiveStep(e, {step}){
    	this.setState({
    		activeStep:step
    	});
		animateScroll.scrollToTop();
    }

    send(){
    	this.setState({
    		loading:true,
    		confirmModalState:false
    	})

    	this.props.openLoader("Estamos guardando la información del testimonio, este proceso puede tardar varios segundos o minutos.");

    	const formData = new FormData();

    	//datos del testimonio
    	formData.append("tipo", this.state.dataTestimony.tipoTestimonio);
		formData.append("categoria", this.state.dataTestimony.categoriaTestimonio);
		formData.append("titulo", this.state.dataTestimony.titulo);
		formData.append("descripcion_corta", this.state.dataTestimony.descripcionCorta);
		formData.append("fecha_evento", this.state.dataTestimony.fechaEvento);
		formData.append("municipio", this.state.dataTestimony.municipioTestimonio);
		formData.append("descripcion_detallada", this.state.dataTestimony.descripcionDetallada?this.state.dataTestimony.descripcionDetallada:"");

		if(this.state.dataTestimony.annexes && this.state.dataTestimony.annexes.length){
			let annexesSend = [];

			_.map(this.state.dataTestimony.annexes, (el,i) => {
				if(
					(
						"data_"+el.name in this.state.dataTestimony.annexesData
						&& this.state.dataTestimony.annexesData["data_"+el.name].name
						&& this.state.dataTestimony.annexesData["data_"+el.name].description
					)
					|| 

					(
						"value_"+el.name in this.state.dataTestimony.annexesValues)
						&& this.state.dataTestimony.annexesValues["value_"+el.name]
					)
	    			annexesSend.push(el);
			})	

			if(annexesSend.length){
				formData.append("anexos", JSON.stringify(annexesSend));

				_.map(annexesSend, (el, i) => {
					if("data_"+el.name in this.state.dataTestimony.annexesData)
		    			formData.append("anexos_datos_"+el.name, JSON.stringify(this.state.dataTestimony.annexesData["data_"+el.name]));
		    		
					if("value_"+el.name in this.state.dataTestimony.annexesValues)
		    			formData.append("anexos_valores_"+el.name, this.state.dataTestimony.annexesValues["value_"+el.name]);
		    	});
			}
		}
		if(this.state.dataTestimony.video && this.state.dataTestimony.video instanceof File)
			formData.append("video", this.state.dataTestimony.video);

		if(this.state.dataTestimony.audio || this.state.dataTestimony.audioRecord){
			if(this.state.dataTestimony.audio && this.state.dataTestimony.audio instanceof File)
				formData.append("audio", this.state.dataTestimony.audio);
			else if(this.state.dataTestimony.audioRecord)
				formData.append("audio", this.state.dataTestimony.audioRecord, this.state.dataTestimony.titulo+".webm");
		}

		formData.append("plantilla", this.state.dataTestimony.plantilla);

		if(this.isUpdate){
			formData.append('id', this.state.dataTestimony.id);
			
			if(this.state.dataTestimony.observaciones)
				formData.append('observaciones', this.state.dataTestimony.observaciones);

			formData.append('onlySave', this.state.onlySave);
			formData.append('saveAndApprove', this.state.saveAndApprove);
			formData.append('saveAndCancel', this.state.saveAndCancel);
			formData.append('deleteAudio', this.state.dataTestimony.deleteAudio);
			formData.append('deleteVideo', this.state.dataTestimony.deleteVideo);
		}

		//Datos del usuario
		if(this.props.userType == "Administrador" && !this.isUpdate){
			formData.append("numero_identificacion", this.state.dataUser.numero_identificacion);
			formData.append("nombres", this.state.dataUser.nombres);
			formData.append("apellidos", this.state.dataUser.apellidos);
			formData.append("fecha_nacimiento", this.state.dataUser.fecha_nacimiento);
			formData.append("genero", this.state.dataUser.genero);
			formData.append("rango_edad", this.state.dataUser.rango_edad);
			formData.append("poblacion", this.state.dataUser.poblacion);
			formData.append("estado_civil", this.state.dataUser.estado_civil);
			formData.append("situacion_laboral", this.state.dataUser.situacion_laboral);
			formData.append("discapacidad", this.state.dataUser.discapacidad);
			formData.append("regimen_salud", this.state.dataUser.regimen_salud);
			formData.append("ingreso_economico", this.state.dataUser.ingreso_economico);
			formData.append("estrato_socioeconomico", this.state.dataUser.estrato_socioeconomico);
			formData.append("convive", this.state.dataUser.convive);
			formData.append("email", this.state.dataUser.email);
			formData.append("telefono", this.state.dataUser.telefono);
			formData.append("nivel_estudio", this.state.dataUser.nivel_estudio);
			formData.append("municipio_id", this.state.dataUser.municipio_id);
			formData.append("direccion", this.state.dataUser.direccion);
			formData.append("consentimiento_informado", this.state.dataUser.consentimientoInformado);
			formData.append("victima_minas", this.state.dataUser.victima_minas);
		}

		let url = params.URL_API+"testimony/register";
		
		if(this.isUpdate)
			url = params.URL_API+"testimony/update/"+this.state.dataTestimony.id;

        axios.post(url,formData,
        {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        )
        .then((response) => {

	    	this.props.closeLoader();
	    	animateScroll.scrollToTop();
            if(this.isUpdate){
            	this.setState({
		    		loading:false,
		    		activeStep:"testimony"
		    	})

            	if("onUpdate" in this.props){
		    		return this.props.onUpdate(this.state.dataTestimony);
		    	}
            }else{
	            //se reinician los datos del estado
	            this.setState({
		    		loading:false,
		    		resetForms:true,
		    		dataTestimony:null,
					stateFormTestimony:false,
					dataUser:this.props.userType == "Administrador"?{}:this.props.user,
					stateFormUser:this.props.userType == "Administrador"?false:true,
					activeStep:this.props.userType == "Administrador"?"user":"testimony",
					template:1,
					resetForms:true
		    	})

		    	setTimeout(() => {
		    		this.setState({
			    		resetForms:false
			    	})
		    	}, 10);

		    	if("onRegister" in this.props){
		    		return this.props.onRegister();
		    	}
		    }

        })
        .catch((error) => {
			
        	this.props.closeLoader();
        	let messageError = "El registro del testimonio no se pudo completar, revise y corrija cada uno de los errores que pueden aparecer en cada pestaña.";

        	if(this.isUpdate)
        		messageError = "La actualización del testimonio no se pudo completar, revise y corrija cada uno de los errores que aparecen en este formulario.";

        	this.setState({
	    		loading:false,
	    		activeStep:this.isUpdate?"testimony":(this.props.userType == "Administrador"?"user":"testimony"),
	    		errors:[messageError]
	    	});


	    	const errorsUser = {
		    	numero_identificacion: error.response.data.errors.numero_identificacion,
				nombres: error.response.data.errors.nombres,
				apellidos: error.response.data.errors.apellidos,
				fecha_nacimiento: error.response.data.errors.fecha_nacimiento,
				genero: error.response.data.errors.genero,
				rango_edad: error.response.data.errors.rango_edad,
				poblacion: error.response.data.errors.poblacion,
				estado_civil: error.response.data.errors.estado_civil,
				situacion_laboral: error.response.data.errors.situacion_laboral,
				discapacidad: error.response.data.errors.discapacidad,
				regimen_salud: error.response.data.errors.regimen_salud,
				ingreso_economico: error.response.data.errors.ingreso_economico,
				estrato_socioeconomico: error.response.data.errors.estrato_socioeconomico,
				convive: error.response.data.errors.convive,
				email: error.response.data.errors.email,
				telefono: error.response.data.errors.telefono,
				nivel_estudio: error.response.data.errors.nivel_estudio,
				municipio_id: error.response.data.errors.municipio_id,
				direccion: error.response.data.errors.direccion,
				consentimientoInformado: error.response.data.errors.consentimiento_informado,
				victima_minas: error.response.data.errors.victima_minas
			}

			let errorsAnnexes = [];

			if("audio" in error.response.data.errors){
				_.map(error.response.data.errors.audio, (el,i) => {
					if(!errorsAnnexes.includes(el))
						errorsAnnexes.push(el);
				})
			}
			
			if("video" in error.response.data.errors){
				_.map(error.response.data.errors.video, (el,i) => {
					if(!errorsAnnexes.includes(el))
						errorsAnnexes.push(el);
				})
			}
			if("anexos_valores_0" in error.response.data.errors){
				_.map(error.response.data.errors.anexos_valores_0, (el,i) => {
					if(!errorsAnnexes.includes(el))
						errorsAnnexes.push(el);
				})
			}

			if("descripcion_detallada" in error.response.data.errors){
				_.map(error.response.data.errors.descripcion_detallada, (el,i) => {
					if(!errorsAnnexes.includes(el))
						errorsAnnexes.push(el);
				})
			}

	    	const errorsTestimony = {
	    		titulo:error.response.data.errors.titulo,
	        	descripcionCorta:error.response.data.errors.descripcion_corta,
	        	fechaEvento:error.response.data.errors.fecha_evento,
				municipioTestimonio:error.response.data.errors.municipio,
	        	tipoTestimonio:error.response.data.errors.tipo,
				categoriaTestimonio:error.response.data.errors.categoria,
	        	observaciones:error.response.data.errors.observaciones,
	        	annexes:errorsAnnexes
			}

            this.setState({
            	formUserErrors:errorsUser,
            	formTestimonyErrors:errorsTestimony
            })

            animateScroll.scrollToTop();

			setTimeout(() => {
				this.setState({
				  errors: [], // Limpiar el array de errores después de 7 segundos
				});
			  }, 8000);
        });
    }

    render() {
    	const { loading, dataTestimony, stateFormTestimony, dataUser, stateFormUser, activeStep, template, resetForms, formUserErrors, formTestimonyErrors, errors, showOptionsSave } = this.state;
    	let templateRender = "";
    	if(dataTestimony && dataUser && stateFormTestimony && stateFormUser){
	    	switch(template.toString()){
				case "1": templateRender = <Template1 testimony={dataTestimony} user={dataUser}/>
					break;
				case "2": templateRender = <Template2 testimony={dataTestimony} user={dataUser}/>
					break;
				case "3": templateRender = <Template3 testimony={dataTestimony} user={dataUser}/>
					break;
				case "4": templateRender = <Template4 testimony={dataTestimony} user={dataUser}/>
					break;
			}
		}

		let steps = [];
		let stepNumber = 1;

		let formUser = "";

		let observations = "";

		if(this.isUpdate){

			let observationsList = <GeneralMessage
				info
				messages={["No se han registrado observaciones"]}
			/>;

			let observationsListItems = _.filter(this.props.testimony.gestion, (el, i) => {
				return el.observaciones;
			})

			if(observationsListItems.length){
				observationsList = <Item.Group divided>
					{
						_.map(observationsListItems, (el, i) => {
							return <Item key={i}>
								<Item.Content>
									<Item.Header>{el.nombres+" "+el.apellidos+" ("+el.rol+")"}</Item.Header>
									<Item.Meta>
										<span className='cinema'>{el.fecha}</span>
									</Item.Meta>
									<Item.Description>{el.observaciones}</Item.Description>
								</Item.Content>
						    </Item>
						})
					}
				</Item.Group>
			}

			observations = <Segment basic className="grey lighten-5">
				<Header as="h2">
					Observaciones del testimonio
				</Header>
				{
					this.props.userType == "Administrador"?
					<Valid.Input textArea required min_length={30} max_length={500} onChange={(e, {value}) => {
						this.setState((oldState) => {
							return {
								dataTestimony:Object.assign({}, oldState.dataTestimony, {observaciones:value})
							}
						})
					}} 
					placeholder='Ingrese las observaciones de los cambios que acaba de realizar en el testimonio.' 
					errors={formTestimonyErrors.observaciones}
					onFocus={() => {
						this.setState((oldState) => {
							return {
								formTestimonyErrors:Object.assign({},oldState.formTestimonyErrors,{observaciones:[]})
							}
						})
					}}
					/>
					:""
				}
				{observationsList}
			</Segment>
		}

		let formTestimony = <Segment className={activeStep != "testimony"?"d-none":""}>
	        			<Testimony
							rol={this.props.userType}
	        				onUpdate={(dataTestimony) => {
	        						const newData = Object.assign({},this.state.dataTestimony, dataTestimony);
		        					this.setState({
		        						dataTestimony:newData,
		        						template:5,
		        						formTestimonyErrors:dataTestimony.formErrors,
		        					});

		        					setTimeout(() => {
		        						this.setState({
			        						template:dataTestimony.plantilla
			        					});
		        					}, 10);
		        				}
		        			}
	        				onFormStateChange={(state) => {
	        						this.setState({stateFormTestimony:state})
		        				}
		        			}
		        			resetForm={resetForms}
		        			formErrors={formTestimonyErrors}
        				/>
        				{observations}
        				<Segment basic textAlign="right" className="no-padding">
        					{
        						this.props.userType == "Administrador"?
        						<Btn.Previous type="button" step="user" onClick={this.setActiveStep}/>
        						:""
        					}
        					<Btn.Next type="button" step="save" disabled={(!stateFormTestimony)} onClick={this.setActiveStep} />
        				</Segment>
    				</Segment>

		if(!this.isUpdate && this.props.userType == "Administrador"){
			steps.push(<Step key="1" completed={stateFormUser} active={(activeStep == "user")} link step="user" onClick={this.setActiveStep}>
						<Icon name='user circle' />
						<Step.Content>
							<Step.Title>Paso #{stepNumber}</Step.Title>
							<Step.Description>Datos del usuario</Step.Description>
						</Step.Content>
					</Step>);

			formUser = <Segment className={activeStep != "user"?"d-none":""} style={{backgroundColor:'transparent'}}>
		        		<User
		        			noRenderPassword
		        			noRenderPasswordConfirmation
		        			noRenderTyC
		        			renderConsentimientoInformado
		    				onUpdate={(dataUser) => {
		        					this.setState({
		        						dataUser,
		        						formUserErrors:dataUser.formErrors
		        					});
		        				}
		        			}
		    				onFormStateChange={(state) => {
		    						this.setState((oldState) => {
		    							return {
		    								stateFormUser:state,
		    								//stateFormTestimony:!state?false:oldState.stateFormTestimony
		    							}
		    						})
		        				}
		        			}
		        			resetForm={resetForms}
		        			formErrors={formUserErrors}
						/>
						<Segment basic textAlign="right" className="no-padding">
        					<Btn.Next type="button" step="testimony" disabled={(!stateFormUser)} onClick={this.setActiveStep} />
        				</Segment>
    				</Segment>;

			stepNumber++;
		}

		if(this.isUpdate){
			formTestimony = <Segment className={activeStep != "testimony"?"d-none":""} style={{backgroundColor:'transparent'}}>
	        			<Testimony
	        				testimony={this.props.testimony}
	        				onUpdate={(dataTestimony) => {
	        						const newData = Object.assign({},this.state.dataTestimony, dataTestimony);
		        					this.setState({
		        						dataTestimony:newData,
		        						template:5,
		        						formTestimonyErrors:dataTestimony.formErrors,
		        					});

		        					setTimeout(() => {
		        						this.setState({
			        						template:dataTestimony.plantilla
			        					});
		        					}, 10);
		        				}
		        			}
	        				onFormStateChange={(state) => {
	        						this.setState({stateFormTestimony:state})
		        				}
		        			}
		        			resetForm={resetForms}
		        			formErrors={formTestimonyErrors}
        				/>
        				{observations}
        				<Segment basic textAlign="right" className="no-padding">
        					{
        						this.props.userType == "Administrador" && !this.isUpdate?
        						<Btn.Previous type="button" step="user" onClick={this.setActiveStep}/>
        						:""
        					}
        					<Btn.Next type="button" step="save" disabled={(!stateFormTestimony)} onClick={this.setActiveStep} />
        				</Segment>
    				</Segment>
		}

		steps.push(<Step key="2" completed={stateFormTestimony} active={(activeStep == "testimony")} disabled={!stateFormUser} link step="testimony" onClick={this.setActiveStep}>
						<Icon name='book' />
						<Step.Content>
							<Step.Title>Paso #{stepNumber}</Step.Title>
							<Step.Description>Datos del testimonio</Step.Description>
						</Step.Content>
					</Step>)

		stepNumber++;

		steps.push(<Step key="3" active={(activeStep == "save")} disabled={!(stateFormTestimony && stateFormUser)} link step="save" onClick={this.setActiveStep}>
						<Icon name='save' />
						<Step.Content>
							<Step.Title>Paso #{stepNumber}</Step.Title>
							<Step.Description>Vista previa y guardar</Step.Description>
						</Step.Content>
					</Step>)

		let btnSave = <Btn.Save type="button" onClick={() => this.setState({
			confirmModalState:true,
			confirmModalMessage:this.isUpdate?"¿Está seguro de guardar los cambios realizados en el testimonio?":"¿Está seguro de guardar el testimonio diligenciado?",
			onlySave:true,
			saveAndApprove:false,
			saveAndCancel:false,
		})} />
        if(this.isUpdate && this.props.user.rol == "Administrador"){
        	btnSave = <Dropdown
							    text='Guardar'
							    color="blue"
							    floating
							    labeled
							    button
							    icon='save'
							    className='icon primary'
							    open={showOptionsSave}
							    onMouseEnter={() => this.setState({showOptionsSave:true})}
							    onClick={() => {
								    	this.setState((oldState) => {
								    		return {showOptionsSave:!oldState.showOptionsSave}
								    	});
								    }
								}
							  >
							    <Dropdown.Menu onMouseLeave={() => this.setState({showOptionsSave:false})}>
									<Dropdown.Header icon='info circle' content='Seleccione una opción de guardado' />
									<Dropdown.Divider />
									<Dropdown.Item onClick={() => this.setState({
											confirmModalState:true,
											onlySave:false,
											saveAndApprove:true,
											saveAndCancel:false,
											confirmModalMessage:"¿Está seguro de guardar los cambios realizados y aprobar el testimonio?"
										})} disabled={this.props.testimony.estado == "Aprobado"} text='1. Guardar y aprobar testimonio' />
									<Dropdown.Item onClick={() => this.setState({
											confirmModalState:true,
											onlySave:false,
											saveAndApprove:false,
											saveAndCancel:true,
											confirmModalMessage:"¿Está seguro de guardar los cambios realizados y cancelar el testimonio?"
										})} disabled={this.props.testimony.estado == "Cancelado"} text='2. Guardar y cancelar testimonio' />
									<Dropdown.Item onClick={() => this.setState({
											confirmModalState:true,
											onlySave:true,
											saveAndApprove:false,
											saveAndCancel:false,
											confirmModalMessage:"¿Está seguro de guardar los cambios realizados en el testimonio?"
										})} text='3. Sólo guardar cambios' />
							    </Dropdown.Menu>
							  </Dropdown>
        }

        return (
        	<Segment basic className="no-padding">
        		<GeneralMessage error messages={errors} onDismiss={()=>this.setState({errors:[]})}/>
        		<Step.Group stackable='tablet' fluid>
					{steps}
				</Step.Group>
				
	        	<Form className="margin-top-20 no-padding" style={{backgroundColor:"transparent"}}>

        			{formUser}

        			{formTestimony}

        			<Segment className={activeStep != "save"?"d-none":""}  style={{backgroundColor:'transparent'}}>
        				{templateRender}
        				<Segment basic textAlign="right">
        					<Btn.Previous type="button" step="testimony" onClick={this.setActiveStep}/>
        					{btnSave}
        					<Confirm
						          header='Confirmación'
						          content={this.state.confirmModalMessage}
						          open={this.state.confirmModalState}
						          onCancel={() => this.setState({confirmModalState:false})}
						          onConfirm={this.send}
						          size='tiny'
						          cancelButton="No"
						          confirmButton="Si"
					        />
        				</Segment>
    				</Segment>
	            </Form>
            </Segment>
        );
    }
}

const mapStateToProps = (state) => {
	return {
		userType:state.app.user.rol,
		user:state.app.user
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		openLoader:(message = "Cargando.") => {
			return dispatch(actOpenFullLoader(message));
		},
		closeLoader:() => {
			return dispatch(actCloseFullLoader());
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FormTestimony);
