import React, { PropTypes } from 'react';
import { Accordion, Segment, Header, Container, Divider, Card, Icon, Grid, Message, Button, Form,TextArea, Image} from 'semantic-ui-react';
import config_routes from '../../config/routes';
import {Btn, Valid,SearchServer, Comments} from '../Helpers/Helpers';
import GeneralMessage from '../Helpers/components/GeneralMessage';
import params from '../../config/params';
import { actList } from '../../redux/StorieConflict/actions';
import { connect } from 'react-redux';
import SvgMap from '../../components/SvgMap/SvgMap';

const opcionesTipoBusqueda = [
  { key: 'departamentos', text: 'Departamentos', value: 'departamentos' },
  { key: 'municipios', text: 'Municipios', value: 'municipios' },
]

class StorieConflict extends React.Component {
	constructor(props) {
	  super(props);
	  this.state={	  	   
			buscar:"",
			municipio_id:"",
			departamento:"",
			tipoBusqueda:"departamentos",
			message:"",
			storiesDisplayed:[],
			currentStories:[],
			isLoading:false,
			activeIndex: null,

			formValidations:{
				buscar:false,
				tipoBusqueda:false

			}
        };

        this.handleSearchServerSelect = this.handleSearchServerSelect.bind(this);        
        this.handleSearchChange = this.handleSearchChange.bind(this); 
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.reloadList = this.reloadList.bind(this);
        this.getIcon = this.getIcon.bind(this);        
        
        this.props.loadList(this.state, true);
	}

    handleInputChange(e, {name, value}){

    	this.setState({
    		[name]:value
    	});
    	this.reloadList();
    }

	handleSearchServerSelect(e, {input, result}){
		this.setState({[input.name]:result.key});
		this.reloadList();
	}
	
	handleSearchChange(e, {input, result}){
		this.setState({[input.name]:null});
		this.reloadList();
	} 	

    handleSelectChange(e, {name, value}){
    	if(name == "tipoBusqueda" && value == "departamentos"){
    		this.setState({
    			[name]:  value,
    			municipio_id:-1
    		}); 
			
			setTimeout(() => {
				this.setState({municipio_id:""}); 
			});
    	} else {
	        this.setState({ [name]:  value});
	    }

        this.reloadList();
    }

    reloadList(){
    	setTimeout(() => {
    		this.props.loadList(this.state, true);
    	}, 10);
    } 


    handleClick = (e, titleProps) => {
	    const { index } = titleProps
	    const { activeIndex } = this.state
	    const newIndex = activeIndex === index ? -1 : index

	    this.setState({ activeIndex: newIndex })
	  }	   

	getIcon(name){
		let arr = name.split(".");
		let ext = arr[arr.length-1];
		if(ext==="doc" || ext==="docx"){
			return <Icon size="huge" name="file word" />
		}else if(ext === "xls" || ext === "xlsx"){
			return <Icon size="huge" name="file excel" className="green-text"/>
		}else if(ext==="gif" || ext==="png" || ext==="jpeg" || ext==="jpg" || ext==="tiff" || ext==="tif"){
			return <Icon size="huge" name="file image outline" />
		}else if(ext === "pptx" || ext === "pptm" || ext ==="ppt"){
			return <Icon size="huge" name="file powerpoint outline" className="red-text text-darken-1"/>
		}else if(ext === "pdf"){
			return <Icon size="huge" name="file pdf outline" className="red-text text-darken-1"/>

		}else{
			return <Icon size="huge" name="file" />
		}
	}

	render(){	
		const {municipio_id, departamento, buscar, load_search, search_value, tipoBusqueda, activeIndex} = this.state;

		let items = "";

		if(this.props.storiesConflict.length){
			items = _.map(this.props.storiesConflict, (el, i) => {
					let annexedRender = "";

					if(
						"annexes" in this.props 
						&& this.props.annexes.length
						&& el.id in this.props.annexes
						&& this.props.annexes[el.id].length
					){				
						annexedRender = _.map(this.props.annexes[el.id], (el_, i_) => {						

								return <a href={params.URL_API+"storie_conflict/get-annexed/"+el_.id_hc+"/"+el_.id} target="_blank" key={i_}>
												
											<Segment>
												{this.getIcon(el_.nombre_archivo)}
												{el_.nombre_archivo}
											</Segment>
										</a>
						});

						annexedRender = <Accordion>
							        <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
							          <Icon name='dropdown' />
							          Anexos
							        </Accordion.Title>
							        <Accordion.Content active={activeIndex === 0}>
							        	<Segment basic>
							         		{annexedRender}
							        	</Segment>
							        </Accordion.Content>
						        </Accordion>				
					}

					let opcionActualizar = "";

					const storieComments = <Comments
										startHidden
                                        href={params.URL+"/storie-conflict/"+el.id}
                                    />

					if(this.props.userType == "Administrador"){
						opcionActualizar = <Card fluid>
							<Card.Content>
								<Card.Header content={el.titulo} />
								<Card.Meta content={el.ubicacion} />
								{el.texto}
								{annexedRender}
							</Card.Content>
							<Card.Content extra>	                      	                     		               
								{storieComments}
								<Button onClick={() => this.props.history.push("/storie-conflict/update/"+el.id)} primary type="button" className="margin-left-10" floated="right"><Icon name="pencil alternate"/>Actualizar</Button>		                	
							</Card.Content>
						</Card>

					}else{
						opcionActualizar = <Card fluid>
							<Card.Content>
								<Card.Header content={el.titulo} />
								<Card.Meta content={el.ubicacion} />
								{el.texto}
								{annexedRender}
							</Card.Content>

							<Card.Content extra>
								{storieComments}
							</Card.Content>
						</Card>

					}				

					return <Grid.Column key={i}>				
							{opcionActualizar}
						</Grid.Column>
			})
		}else{
			items = <GeneralMessage
						warning
						icon
						messages={["No se encontraron resultados con los criterios de búsqueda seleccionados."]}
					/>;
		}

		let message = "";

		if(this.props.userType == "Administrador"){
			message = <Message
	    			info
				    icon='microphone'
				    header='¿Desea registrar una reseña histórica?'
				    content={
				    	<Segment basic className="no-padding">
				    		Para registrar una reseña histórica, haga clic sobre el siguiente botón 
					    	<Button onClick={() => this.props.history.push(config_routes.storie_conflict_register.path)} positive type="button" className="margin-left-10">Registrar reseña histórica</Button>.
					    	A continuación, se desplegará el formulario de registro de reseñas históricas. Diligencie el formulario y haga clic en el botón de guardar.
				    	</Segment>
				    }
				  />

		}		

	    return (
	    	<Container>
	    		{message}

	    		<Grid columns={3} doubling stackable>

	    			<Grid.Column floated="right">
	    				<Segment basic style={{padding:'0px', marginTop:'-10px', marginBottom:'30px'}}>
	    					<Form.Input type='search' fluid icon='search' name="buscar" label="Buscar" placeholder="Busqueda por texto..." onChange={this.handleInputChange}/>
	    				</Segment>
	    			</Grid.Column>

	                <Grid.Column>	                         	           
     	            	<Form>
                			<SearchServer disabled={tipoBusqueda == "departamentos"?true:false} name="municipio_id" label="Municipio" predetermined={municipio_id} url={params.URL_API+"query/municipios"} handleResultSelect={this.handleSearchServerSelect} handleSearchChange={this.handleSearchChange} otherParams={[{name:"departamento", value:departamento}]}/>
                		</Form>                	               	
	                </Grid.Column>

        			<Grid.Column>
		        		<Segment basic className="no-padding margin-bottom-30" style={{marginTop:'-10px'}}>
		        			<Form.Select name="tipoBusqueda" fluid label="Tipo de busqueda" options={opcionesTipoBusqueda} placeholder="Seleccione" value={tipoBusqueda} onChange={this.handleSelectChange} />		        			
	        		 	</Segment>
		        	</Grid.Column>  
	    		</Grid>

	    		<Grid>
	    			<Grid.Column computer={5} tablet={8} mobile={16}>
	    				<Header centered="true">
	    					Seleccione un departamento
	    				</Header>
		    			<SvgMap 
			    			onselectDepto={(id) => {
				    				this.setState({departamento:id, municipio_id:-1}); 
				    				setTimeout(() => {
										this.setState({municipio_id:""}); 
									});
				    				this.reloadList()
			    				}
			    			}
			    		/>
		    		</Grid.Column>

		    		<Grid.Column computer={11} tablet={8} mobile={16}>
			    		<Grid columns={1} doubling stackable>
			    			{items}
			    		</Grid>						
		    		</Grid.Column>			    				    		
	    		</Grid>
	        </Container>
	    );
	}
}

const mapStateToProps = (state, props) => {
	return {
		userType:state.app.user?state.app.user.rol:false,
		storiesConflict:state.StorieConflict.storiesDisplayed,
		annexes:state.StorieConflict.annexes
	}
}

const mapDispatchToProps = (dispatch, props) => {
	return {
		loadList: (data, reload) => {
			dispatch(actList(data, reload));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(StorieConflict);