import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { actRegisterStories, actUpdateStories, actList } from '../../redux/StorieConflict/actions';
import axios from 'axios';
import params from '../../config/params';
import { animateScroll} from 'react-scroll';

import { Grid, Form, Button,TextArea, Segment, Container,Select,Message, Input, Header, Icon, Confirm } from 'semantic-ui-react';
import GeneralMessage from '../Helpers/components/GeneralMessage';
import { Btn, Valid, SearchServer} from '../Helpers/Helpers';

class FormStories extends Component {
    
    constructor(props) {
        super(props);

        this.state={
        	id:"StorieConflictId" in this.props?this.props.StorieConflictId:false,
        	titulo:"",
        	texto:"",
			municipio_id:null,
			departamento_id:null,
			loading:false,
			annexes:[],//almacena la información de los anexos existentes
			annexesValues:{},//almacena los valores de los anexos existentes
			annexesRemove:[],//almacena los anexos que se van a eliminar
			annexesLoaded:[],
			open:false,
			msjConfirm:"StorieConflictId" in this.props?"¿Está seguro de actualizar la historia del conflicto armado?":"¿Está seguro de registrar la historia del conflicto armado?",

			formValidations:{
	        	titulo:("StorieConflictId" in this.props)?true:false,
	        	texto:("StorieConflictId" in this.props)?true:false,
	        	municipio_id:("StorieConflictId" in this.props)?true:false,
	        	departamento_id:("StorieConflictId" in this.props)?true:false				      					
			},
			formErrors:{
				titulo:[],
				texto:[],
				municipio_id:[],
				departamento_id:[]
			},
			loading:false,
			formIsValid:false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSubmitFormRegisterStories = this.handleSubmitFormRegisterStories.bind(this);
        this.onTrueValid = this.onTrueValid.bind(this);
        this.handleFocus = this.handleFocus.bind(this);        
        this.onFalseValid = this.onFalseValid.bind(this);
        this.setFormIsValid = this.setFormIsValid.bind(this);        
        this.handleSearchServerSelect = this.handleSearchServerSelect.bind(this);        
        this.handleSearchChange = this.handleSearchChange.bind(this);        
        this.addAnnexed = this.addAnnexed.bind(this);        
        this.removeAnnexed = this.removeAnnexed.bind(this);        
        this.handleChangeInputFile = this.handleChangeInputFile.bind(this); 
        this.deleteAnnexed = this.deleteAnnexed.bind(this);
        this.loadStorieConflict = this.loadStorieConflict.bind(this);

        this.props.loadList(this.state, true);
    }

    componentDidMount() {
    	this.loadStorieConflict();
	}   

	loadStorieConflict(){
		if("StorieConflictId" in this.props){
        	this.setState({
        		loading:true
        	});

	    	axios.post(params.URL_API+"storie_conflict/show/"+this.props.StorieConflictId)
	    	.then(
	    		(response) => {        			
	    			this.setState({
		        		formIsValid:true,
		        		loading:false,
		        		titulo:response.data.titulo?response.data.titulo:"",
		        		departamento_id:response.data.departamento_id?response.data.departamento_id:"",
		        		municipio_id:response.data.municipio_id?response.data.municipio_id:"",
		        		texto:response.data.texto?response.data.texto:"",
		        		annexesLoaded:response.data.anexos
		    	    
			        });
	        	}, 
	    		(error) => {        		
	    			this.setState({
		        		loading:false
		        	});
	    		}
	    	)
	    }
	} 	

    componentWillMount() {
        this.addAnnexed();
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

	handleSearchServerSelect(e, {input, result}){
		if(input.name == "departamento_id"){
			this.setState({
				[input.name]:result.key,
				municipio_id:-1
			})

			setTimeout(() => {
				this.setState({
					municipio_id:""
				})
			}, 10);
		}else if(input.name == "municipio_id"){
			this.setState({
				[input.name]:result.key,
				departamento_id:-1
			})

			setTimeout(() => {
				this.setState({
					departamento_id:""
				})
			}, 10);
		}else{
			this.setState({[input.name]:result.key})
		}
		this.onTrueValid(input);
	}
	

	handleSearchChange(e, {input, result}){
		this.setState({[input.name]:null})
		this.onFalseValid(input);
	}            

	/*==============================================
	=            Manejadores de eventos            =
	==============================================*/	

    handleSubmitFormRegisterStories(){
    	this.setState({loading:true, open:false});

    	if(this.props.action == "register"){
    		this.props.sendRegisterStories(this.state)
	    	.then((response) => {
	    		if(response.status == 200){                  			
					this.setState({
						titulo:'',
						texto:'',
						municipio_id:'',
						departamento_id:'', 			   				
						loading:false,
						errors:[],
						formIsValid:false
					})

					if("onActionSuccess" in this.props){
						this.props.onActionSuccess();
					}

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
    	}else if(this.props.action == "update"){
    		this.props.sendUpdateStories(this.state, this.props.StorieConflictId)
	    	.then((response) => {
	    		if(response.status == 200){                  			
					this.setState({			
						loading:false,
						errors:[],
						formIsValid:false
					})

					if("onActionSuccess" in this.props){
						this.props.onActionSuccess();
					}	
					this.loadStorieConflict();				
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

		    		animateScroll.scrollToTop();
		    		
		    	}
	    	});

    	}    	
    	
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

	getIcon(name){
		let arr = name.split(".");
		let ext = arr[arr.length-1];
		if(ext==="doc" || ext==="docx"){
			return <Icon size="large" name="file word" />
		}else if(ext === "xls" || ext === "xlsx"){
			return <Icon size="large" name="file excel" className="green-text"/>
		}else if(ext==="gif" || ext==="png" || ext==="jpeg" || ext==="jpg" || ext==="tiff" || ext==="tif"){
			return <Icon size="large" name="file image outline" />
		}else if(ext === "pptx" || ext === "pptm" || ext ==="ppt"){
			return <Icon size="large" name="file powerpoint outline" className="red-text text-darken-1"/>
		}else if(ext === "pdf"){
			return <Icon size="large" name="file pdf outline" className="red-text text-darken-1"/>

		}else{
			return <Icon size="large" name="file" />
		}
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
    	const {titulo,texto,municipio_id,departamento_id,annexesLoaded,loading, formIsValid,formErrors,success, msjConfirm} = this.state;
		let annexedRender = "";

		if(annexesLoaded.length){				
			annexedRender = _.map(annexesLoaded, (el_, i_) => {									

					return <Grid.Column key={i_}>
								<a href={params.URL_API+"storie_conflict/get-annexed/"+el_.id_hc+"/"+el_.id} target="_blank" key={i_}>
									<Segment>
										{this.getIcon(el_.nombre_archivo)}
										{el_.nombre_archivo}
									</Segment>
								</a>
	                			<Grid.Column width={16}>			                					                				                									          
					            	<Btn.Delete fluid onClick={(e) => {this.deleteAnnexed(el_, i_)}}/>							            							        				                						                			                					            		
		                		</Grid.Column> 								
							</Grid.Column>	
			});

			annexedRender = <Segment>
	                		<Header as="h3">
	                			Anexos existentes
	                		</Header>
		                		            			                	
		                	<Grid stackable doubling columns={2}>
		                		{annexedRender}		         	           		
		                	</Grid>
		                </Segment>
	
		}

        return (
        	<Form loading={loading} style={{marginTop: "40px"}}>
	        	<Grid stackable doubling columns={1}>	
	          		<Valid.Input 		                    
		                    type="text" 
		                    name="titulo" 
		                    id="titulo" 
		                    value={titulo} 
		                    label='Título' 
		                    onTrueValid={this.onTrueValid} 
		                    onFalseValid={this.onFalseValid} 
							onChange={this.handleInputChange}
		                    onFocus={this.handleFocus} 				                    			                    
		                    required
		                    min_length={6}
		                    max_length={250}
		                    wrapperColumn
		                    errors={formErrors.titulo}
		                />  
		            <Grid.Column>
			        	<Grid stackable doubling columns={2}>	                
			    			<Grid.Column>
			                	<Container style={{padding:'0px', marginTop:'-10px', marginBottom:'30px'}}>
						    		<Message
						    			info
									    icon='info circle'
									    header='Selección de departamento'
									    content={
									    	<Segment basic className="no-padding">
										    	Seleccione únicamente si la reseña histórica a registrar está relacionada con un departamento.
									    	</Segment>
									    }
									  />
						        </Container>
			    				<Segment basic style={{padding:'0px', marginTop:'-10px', marginBottom:'30px'}}>
			    				    <SearchServer name="departamento_id" label="Departamento" predetermined={departamento_id} url={params.URL_API+"query/departamentos"} handleResultSelect={this.handleSearchServerSelect} handleSearchChange={this.handleSearchChange}/>
			    				</Segment>
			    			</Grid.Column>
			    		
			                <Grid.Column>
								<Container style={{padding:'0px', marginTop:'-10px', marginBottom:'30px'}}>
						    		<Message
						    			info
									    icon='info circle'
									    header='Selección de municipio'
									    content={
									    	<Segment basic className="no-padding">
										    	Seleccione únicamente si la reseña histórica a registrar está relacionada con un municipio.
									    	</Segment>
									    }
									  />
						        </Container>
			                	<Segment basic style={{padding:'0px', marginTop:'-10px', marginBottom:'30px'}}>
			                		<SearchServer name="municipio_id" label="Municipio" predetermined={municipio_id} url={params.URL_API+"query/municipios"} handleResultSelect={this.handleSearchServerSelect} handleSearchChange={this.handleSearchChange}/>
			                	</Segment>	                	
			                </Grid.Column>	        		          		
			            </Grid>		
		            </Grid.Column>

	                <Grid.Column>	                		          		  
						<Form.Field id='texto' name='texto' value={texto} control={TextArea} label='Texto' placeholder='Texto' required  min_length={6}
		                	 max_length={2000} errors={formErrors.texto} onChange={this.handleInputChange} />							  	              	                	
	                </Grid.Column>

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
						<Btn.Save type="button" disabled={(!formIsValid && loading)} onClick={() => this.setState({open:true})}/>		                   
		            </Grid.Column>
		            <Confirm 
		            	header="Confirmación"
		            	content={msjConfirm}
			    		open={this.state.open}
			    		onCancel={() => this.setState({open:false})}
			    		onConfirm={this.handleSubmitFormRegisterStories}
			    		size="tiny"
			    		cancelButton="No"
			    		confirmButton="Si"
			    	/>
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
		sendRegisterStories:(data) => {
			return dispatch(actRegisterStories(data));
		},
		sendUpdateStories:(data, StorieConflictId)=>{
			return dispatch(actUpdateStories(data, StorieConflictId));
		},
		loadList: (data, reload) => {
			dispatch(actList(data, reload));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FormStories);