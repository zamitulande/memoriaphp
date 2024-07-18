import React, { Component, PropTypes } from 'react';

import {Grid, Segment, Header, Button, Icon, Modal, Popup, Form, TextArea, Message } from 'semantic-ui-react';
import { actAddNotification } from '../../redux/notifications/actions';
import GeneralMessage from '../Helpers/components/GeneralMessage';
import {actRegisterAllies} from '../../redux/Allies/actions';
import { Btn, Valid, Recaptcha_ } from '../Helpers/Helpers';
import { animateScroll} from 'react-scroll';
import params from '../../config/params';
import { connect } from 'react-redux';
import anime from "animejs";
import axios from 'axios';

class RegisterAllies extends Component {

	constructor(props) {
		super(props);

		this.state = {
        	nombre_organizacion:"",
        	sitio_web:"",
        	facebook:"",   
        	correo:"",
        	telefonos:"",
        	objeto_social:"",     	
			open:false,
			validReChaptcha:false,

			formValidations:{
				nombre_organizacion:false,	        
				//sitio_web:false,
				//facebook:false,
				correo:false,
				telefonos:false,
				objeto_social:true
	        					      					
			},
			formErrors:{
				nombre_organizacion:[],
				sitio_web:[],
				facebook:[],
				correo:[],
				telefonos:[],
				objeto_social:[]
				
			},
			loading:false,
			formIsValid:false,			


			styles:{
				position: 'fixed',
				bottom: '3%',
				right: '2%',
				zIndex: 1000,
				/*width:'100%',
				minWidth:'100%',*/
				padding:'0px',
				//margin:'1rem 0px',
			}
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.setFormIsValid = this.setFormIsValid.bind(this);
        this.onTrueValid = this.onTrueValid.bind(this);       
        this.onFalseValid = this.onFalseValid.bind(this);
        this.handleSubmitFormRegisterAllies = this.handleSubmitFormRegisterAllies.bind(this); 
        this.onActionSuccess = this.onActionSuccess.bind(this);

	}
	componentDidMount() {
		// Aplica la animación en componentDidMount
		anime({
		  targets: "#price",
		  scale: [0.75, 0.95],
		  direction: "alternate",
		  easing: "easeOutBack",
		  loop: true,
		});
	  }

    handleInputChange(e, {name}){
        let value = (e.target.type == 'checkbox')?e.target.checked:e.target.value;
        this.setState({ [name]:  value});
    }	

    handleSelectChange(e, {name, value}){
        this.setState({ [name]:  value});
    }

    handleFocus(e, {name}){
        this.setState((oldState, props) => {
            return {formErrors: Object.assign({}, oldState.formErrors, {[name]:[]})}
        })
    }

    /*=========================================================
    =            Estado de validaciòn de formulario            =
    =========================================================*/     

    setFormIsValid(){
        setTimeout(() => {
            let isValid = true;
            _.map(this.state.formValidations, (value, key) => {
                if(!value)isValid = false;
            });

            this.setState({
                formIsValid:isValid
            })   

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
	          

	/*==============================================
	=            Manejadores de eventos            =
	==============================================*/	

    handleSubmitFormRegisterAllies(){
    	this.setState({loading:true, open:false, validReChaptcha:false});
    		this.props.sendRegisterAllies(this.state)
	    	.then((response) => {
	    		if(response.status == 200){                  			
					this.setState({					
						nombre_organizacion:'',
						sitio_web:'',
						facebook:'',
						correo:'',
						telefonos:'',
						objeto_social:'',	
						loading:false,
						errors:[],
						formIsValid:false
					})

					this.onActionSuccess();				
					animateScroll.scrollToTop();
	    		}else{

	                let errors = {};
	                _.map(response.data.errors, (el, i) => {
	                    errors[i] = el;
	                });
	                this.setState((oldState, props) => {
	                    return {
	                    	formErrors: Object.assign({}, oldState.formErrors, errors),
			    			loading:false,
			    			success:[]
	                    };
	                })  

		    		this.setState({
		    		})
		    		animateScroll.scrollToTop();
		    	}		    	
	    	});    		
    }  

    onActionSuccess(){
        this.setState({
            success:["Se ha registrado una nueva solicitud de aliado exitosamente."],
        })
    }       

	render() {
		const {nombre_organizacion, sitio_web, facebook, correo, telefonos, objeto_social, loading, formIsValid, formErrors, success} = this.state;
		const {userAuth} = this.props;

		const triggerModa =  <Popup
					trigger={<Button 
			    			animated='vertical'
			    			size="big"
			    			color="green"
							id="price"
			    		>
							<Button.Content visible>¿Quieres ser un aliado? <Icon className="margin-left-10" name="handshake outline"/></Button.Content>
							<Button.Content hidden>Envianos tus datos <Icon className="margin-left-10" name="heart"/></Button.Content>
					    </Button>}	
					    content="Quienes son nuestros aliados. Nuestros aliados son organizaciónes dispuestas a resacir a las victimas del conflicto armado en colombia."					    
    					basic							  
				    />				    				

		const triggerModal =!userAuth?
		 		<Button 
	    			animated='vertical'
	    			size="big"
	    			color="green"
					id="price"
	    		>
					<Button.Content visible>¿Quiere ser un aliado? <Icon className="margin-left-10" name="handshake outline"/></Button.Content>
					<Button.Content hidden>Envienos sus datos <Icon className="margin-left-10" name="heart"/></Button.Content>
			    </Button>:"";
	

	    return (
	    	<Segment basic style={this.state.styles}>
			    <Modal trigger={triggerModal} size="small" closeIcon>
					<Header>
						<Icon name="handshake outline" />
						Envío de solicitud de aliados
					</Header>
					
					<Modal.Content  style={{backgroundColor:"#00324D"}}>
						<Message info>
						    <Message.Header>Quiere ser un aliado</Message.Header>
						    <p>
						      	Si desea ser un aliado nuestro y apoyar de alguna forma a las víctimas del
								conflicto armado en Colombia, o victimas por covid-19, dejenos los datos de la organización a la cual
								pertenece. Pronto nos pondremos en contácto.
						    </p>
						</Message>
						<GeneralMessage success messages={success} onDismiss={()=>this.setState({success:[]})}/>

						<Form loading={loading}>
							<Valid.Input 
			                    type="text" 
			                    name="nombre_organizacion" 
			                    id="nombre_organizacion" 
			                    value={nombre_organizacion.toUpperCase()} 
			                    label='Nombre organización'
			                    onTrueValid={this.onTrueValid} 
			                    onFalseValid={this.onFalseValid} 			                     
			                    onChange={this.handleInputChange} 
			                    onFocus={this.handleFocus}
			                    required
			                    min_length={3}
			                	max_length={60}			                
			                    wrapperColumn
			                    errors={formErrors.nombre_organizacion}
			                    alphabeticalSpace
			                />
					    		<Grid stackable doubling columns={2}>            

						   				<Valid.Input 
						                    type="url" 
						                    name="sitio_web" 
						                    id="sitio_web" 
						                    value={sitio_web} 
						                    label='Sitio Web'
						                    onTrueValid={this.onTrueValid} 
						                    onFalseValid={this.onFalseValid} 			                     
						                    onChange={this.handleInputChange} 
						                    onFocus={this.handleFocus}
						                    min_length={3}
						                	max_length={60}			                
						                    wrapperColumn
						                    errors={formErrors.sitio_web}
											placeholder="http://www.mipagina.com"
						                    help="En este campo podrá escribir la url de su titio web. Un ejemplo es: 'http://www.google.com'"						                    
						                />
						                
						    			<Valid.Input 
						                    type="url" 
						                    name="facebook" 
						                    id="facebook" 
						                    value={facebook} 
						                    label='Facebook'
						                    onTrueValid={this.onTrueValid} 
						                    onFalseValid={this.onFalseValid} 			                     
						                    onChange={this.handleInputChange} 
						                    onFocus={this.handleFocus}
						                    min_length={3}
						                	max_length={60}			                
						                    wrapperColumn
						                    errors={formErrors.facebook}
											placeholder="https://www.facebook.com/pepito.20"
						                    help="En este campo podrá escribir la url de su Facebook. Un ejemplo es: 'https://www.facebook.com'"						                   
						                />                        

						            	<Valid.Input	
						                    id="correo"
						                    name="correo"
						                    value={correo}
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
						                    errors={formErrors.correo}
						                />

						                <Valid.Input 
						                    type="text" 
						                    name="telefonos" 
						                    id="telefonos" 
						                    value={telefonos} 
						                    label='Telefonos'
						                    onTrueValid={this.onTrueValid} 
						                    onFalseValid={this.onFalseValid} 			                	                    
						                    onChange={this.handleInputChange}
						                    onFocus={this.handleFocus}
						                    required
							                min_length={10}
							                max_length={100}	 
						                    wrapperColumn
						                    errors={formErrors.telefonos}
						                    help="En este campo podrá describir los números de teléfono de la organización a la que se encuentra vinculado, los números de teléfono deben estar separados. Un ejemplo es: '3123458545-2146564.'"
					                	/>
					            </Grid>    	
			                	<Grid.Column>	                		          		  
									<Form.Field id='objeto_social' name='objeto_social' value={objeto_social} control={TextArea} label='Objeto social' placeholder='Objeto social' required
					                	 max_length={1000} errors={formErrors.objeto_social} onChange={this.handleInputChange} />							  	              	                	
				                </Grid.Column>
				                <br/>				  				                

				                <Grid.Column>	                		          		  
									<Recaptcha_ 
						                onChange={(value) => this.setState({validReChaptcha:true})}
						            />
				                </Grid.Column>				                					                
					    </Form>

					</Modal.Content>

					<Modal.Actions>
				      <Btn.Save disabled={(!formIsValid || !this.state.validReChaptcha || loading)} onClick={this.handleSubmitFormRegisterAllies} />
				    </Modal.Actions>
				</Modal>
			</Segment>       
	    )
	}
}


const mapStateToProps = (state, props) => {
	return {
		userAuth:state.app.userAuth,
		user:state.app.user
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		sendRegisterAllies:(data) => {
			return dispatch(actRegisterAllies(data));
		},
		messageUserState:() => {
            return dispatch(actAddNotification({message:"Se registro una nueva solicitud de aliado con éxito", closeIn:6, showButtonClose:true}));
        },
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterAllies);
