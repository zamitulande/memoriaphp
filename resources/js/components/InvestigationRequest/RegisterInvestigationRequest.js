import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {actRegisterInvestigationRequest} from '../../redux/InvestigationRequest/actions';
import axios from 'axios';
import params from '../../config/params';
import { animateScroll} from 'react-scroll';

import { Grid, Form, Button,TextArea, Segment, Container,Select,Message, Input, Header, Icon, Confirm } from 'semantic-ui-react';
import GeneralMessage from '../Helpers/components/GeneralMessage';
import { Btn, Valid, SearchServer} from '../Helpers/Helpers';

const optionsTipoSolicitante = [
  { key: 'persona_jurídica', text: 'Persona Jurídica', value: 'Persona Jurídica' },
  { key: 'persona_natural', text: 'Persona Natural', value: 'Persona Natural' },
]

class RegisterInvestigationRequest extends Component {
    
    constructor(props) {
        super(props);

        this.state={    
        	nombres:"",
        	apellidos:"",
        	email:"",
        	telefono:"",
        	direccion:"",                    	
        	observaciones:"",
        	tipo_solicitante:"",
			loading:false,
			annexes:[],//almacena la información de los anexos existentes
			annexesValues:{},//almacena los valores de los anexos existentes
			formato:"",
			open:false,
			msjConfirm:"Está seguro de registrar una nueva solicitud de investigación",

			formValidations:{
				nombres:("InvestigationRequestId" in this.props)?true:false,
	        	apellidos:("InvestigationRequestId" in this.props)?true:false,
	        	email:("InvestigationRequestId" in this.props)?true:false,
	        	telefono:true,
	        	direccion:("InvestigationRequestId" in this.props)?true:false,
	        	observaciones:("InvestigationRequestId" in this.props)?true:false,
	        	tipo_solicitante:("InvestigationRequestId" in this.props)?true:false
	        					      					
			},
			formErrors:{
				nombres:[],
	        	apellidos:[],
	        	email:[],
	        	telefono:[],
	        	direccion:[],
				observaciones:[],
				tipo_solicitante:[],
				formato:[]
				
			},
			loading:false,
			formIsValid:false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSubmitFormRegisterInvestigationRequest = this.handleSubmitFormRegisterInvestigationRequest.bind(this);
        this.onTrueValid = this.onTrueValid.bind(this);
        this.handleFocus = this.handleFocus.bind(this);        
        this.onFalseValid = this.onFalseValid.bind(this);       
        this.addAnnexed = this.addAnnexed.bind(this);        
        this.removeAnnexed = this.removeAnnexed.bind(this);        
        this.handleChangeInputFile = this.handleChangeInputFile.bind(this); 
        this.deleteAnnexed = this.deleteAnnexed.bind(this);
		this.onActionSuccess = this.onActionSuccess.bind(this);      

    }

    onActionSuccess(){
        this.setState({
            success:["Se ha enviado una nueva solicitud de investigación exitosamente."],
        })
    }    

    componentWillMount() {
        this.addAnnexed();
    }

    handleInputChange(e, {name}){
        let value = (e.target.type == 'checkbox')?e.target.checked:e.target.value;
    	if(e.target.type == "file"){
    		value = e.target.files[0];
    	}
        
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

    handleSubmitFormRegisterInvestigationRequest(){
    	this.setState({loading:true, open:false});
    		this.props.sendRegisterInvestigationRequest(this.state)
	    	.then((response) => {
	    		if(response.status == 200){                  			
					this.setState({					
						nombres:'',
						apellidos:'',
						email:'',
						telefono:'',
						direccion:'',					 			   				
						observaciones:'',
						tipo_solicitante:'',
						formato:'',
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

    /**
     * Agrega un input file a la lista de anexos
     */
    addAnnexed(e){
    	if(e)
    		e.preventDefault();

    	if(this.state.annexes.length < 9){
    	let currentAnnexes = this.state.annexes;
    	let currentAnnexesValues = this.state.annexesValues;

    	let key = 0;//valor inicial

    	//si existen más files, el key es el valor de key, en el ultimo file, más uno
    	if(currentAnnexes.length)
    		key = parseInt(currentAnnexes[(currentAnnexes.length - 1)].key) + 1

    	//se agrega el valor del nuevo file
    	currentAnnexesValues = Object.assign({},currentAnnexesValues,{["value_"+key]:""});
    	currentAnnexes.push({
    		key,
    		name:key
    	});

		setTimeout(() => {
			this.setState({
				annexes:currentAnnexes,
				annexesValues:currentAnnexesValues
			})
		}, 10);
	  }
    }

    removeAnnexed(e, key){
    	if(e)
    		e.preventDefault();

    	if(this.state.annexes.length > 1){
	    	let currentAnnexes = this.state.annexes;
	    	//key para eliminar de la lista de valores
	    	let keyRemoveAnnexedValue = "value_"+currentAnnexes[key].key;

	    	currentAnnexes.splice(key,1);

	    	let currentAnnexesValues = this.state.annexesValues;

	    	delete currentAnnexesValues[keyRemoveAnnexedValue];

			setTimeout(() => {
				this.setState({
					annexes:currentAnnexes,
					annexesValues:currentAnnexesValues
				})
			}, 10);
		}
    }

    handleChangeInputFile(e, data){
    	let currentAnnexesValues = this.state.annexesValues;

    	currentAnnexesValues = Object.assign({},currentAnnexesValues,{["value_"+data.name]:e.target.files[0]});
    	
    	this.setState({
			annexesValues:currentAnnexesValues
		})
    }

    deleteAnnexed(e, key){
	    	let currentAnnexes = this.state.annexesLoaded;
	    	//key para eliminar de la lista de valores
	    	let keyRemoveAnnexedValue = currentAnnexes[key].id;

	    	currentAnnexes.splice(key,1);

	    	let currentAnnexesRemove = this.state.annexesRemove;

	    	currentAnnexesRemove.push(keyRemoveAnnexedValue);

			this.setState({
				annexesLoaded:currentAnnexes,
				annexesRemove:currentAnnexesRemove
			});
    }

    render() {
    	const {nombres, apellidos, email,direccion, telefono, observaciones,formato,tipo_solicitante,annexesLoaded,loading, formIsValid,formErrors,success, msjConfirm} = this.state;
		let annexedRender = "";

        return (
        	<Form loading={loading} style={{marginTop: "40px"}}>
        		<Grid centered>
        			<Grid.Column mobile={16} tablet={12} computer={10}>
			        	<Grid stackable doubling columns={2}>
			        	<GeneralMessage success messages={success} onDismiss={()=>this.setState({success:[]})}/>	

			          			<Valid.Input 
				                    type="text" 
				                    name="nombres" 
				                    id="nombres" 
				                    value={nombres} 
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
				                    value={apellidos} 
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
				                    name="direccion" 
				                    id="direccion" 
				                    value={direccion} 
				                    label='Dirección' 
				                    onTrueValid={this.onTrueValid} 
				                    onFalseValid={this.onFalseValid}		                    
				                    onChange={this.handleInputChange}
				                    onFocus={this.handleFocus} 
				                    min_length={8} 
				                    max_length={100}  
				                    errors={formErrors.direccion}		                    
				                    wrapperColumn
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
				        			<Form.Select required name="tipo_solicitante" fluid label="Tipo de solicitante" options={optionsTipoSolicitante} placeholder="Seleccione" value={tipo_solicitante} onChange={this.handleSelectChange} errors={formErrors.tipo_solicitante}/>
			        		 	</Segment>
				        	</Grid.Column>
						</Grid>		
			            <Grid.Column>
				        	<Grid stackable doubling columns={2}>	                
				    			<Grid.Column>
				                	<Container style={{padding:'0px', marginTop:'-10px', marginBottom:'30px'}}>
							    		<Message
							    			info
										    icon='info circle'
										    header='Formato de solicitud'
										    content={
										    	<Segment basic className="no-padding">
											    	El la parte inferior encontrara un link para descargar el formato de solicitud.
										    	</Segment>
										    } 
										  />
							        </Container>
				    				<Segment basic style={{padding:'0px', marginTop:'-10px', marginBottom:'30px'}}>
										<a href={"MemoriaOral/storage/public/FormatInvestigationRequest/Agosto2.pdf"} target="_blank" className='btn'>
												Descargar formato				
										</a>				    				    
				    				</Segment>
				    			</Grid.Column>
				    		
				                <Grid.Column>
				                	<Segment>
				                		<Header as="h3">
				                			Formato diligenciado
				                		</Header>

				                		<Grid stackable doubling columns={1}>					            
				                			<Grid.Column>
							            		<Input type="file">
							            			<Input type="file" name='formato' onChange={this.handleInputChange}/>									            			
							            		</Input>
								        	</Grid.Column>				                								                		                			                        		
					                	</Grid>		            		
				                	</Segment>
				                </Grid.Column>	        		          		
				            </Grid>		
			            </Grid.Column>	        										        	


		                <Grid stackable doubling columns={1}>
		                <Grid.Column>	                		          		  
							<Form.Field id='observaciones' name='observaciones' value={observaciones} control={TextArea} label='Observaciones' placeholder='Observaciones'
			                	 max_length={1000} errors={formErrors.observaciones} onChange={this.handleInputChange} />							  	              	                	
		                </Grid.Column>
		                </Grid>	

		                <Grid.Column>
		                	{annexedRender}
		                </Grid.Column>

		                <Grid.Column>
		                	<Segment>
		                		<Header as="h3">
		                			Anexos
		                		</Header>

		                		<Grid stackable doubling columns={2}>
			                		{
			                			_.map(this.state.annexes, (el, i) => {
			                				return <Grid.Column key={el.key}>
							            		<Input type="file">
							            			<Input type="file" name={el.key} onChange={this.handleChangeInputFile}/>
							            			<Button icon="close" onClick={(e) => {this.removeAnnexed(e, i)}}/>
							            		</Input>
							        		</Grid.Column>
			                			})
			                		}
			                	
			                		<Grid.Column width={16}>
			            				<Btn.Add onClick={this.addAnnexed}/>
			                		</Grid.Column>            		
			                	</Grid>		            		
		                	</Segment>
		                </Grid.Column>	    	                		                	                                	             
						<Grid.Column width={16} textAlign="center">
							<Btn.Save type="button" disabled={(!formIsValid && loading)} onClick={() => this.setState({open:true})} />		                   
			            </Grid.Column>
			            <Confirm 
			            	header="Confirmación"
			            	content={msjConfirm}
				    		open={this.state.open}
				    		onCancel={() => this.setState({open:false})}
				    		onConfirm={this.handleSubmitFormRegisterInvestigationRequest}
				    		size="tiny"
				    		cancelButton="No"
				    		confirmButton="Si"
				    	/>		    		
		    		</Grid.Column> 
            	</Grid>  	            
        	</Form>
        );
    }    
}

const mapStateToProps = (state, props) => {
	return {
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		sendRegisterInvestigationRequest:(data) => {
			return dispatch(actRegisterInvestigationRequest(data));
		},	
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterInvestigationRequest);