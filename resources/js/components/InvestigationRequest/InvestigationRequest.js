import React, { PropTypes } from 'react';
import { Accordion, Segment, Header, Container, Divider, Card, Icon, Grid, Message, Button, Form,TextArea, Image} from 'semantic-ui-react';
import config_routes from '../../config/routes';
import {Btn, Valid,SearchServer} from '../Helpers/Helpers';
import GeneralMessage from '../Helpers/components/GeneralMessage';
import params from '../../config/params';
import { actList } from '../../redux/StorieConflict/actions';
import { connect } from 'react-redux';
import SvgMap from '../../components/SvgMap/SvgMap';

const opcionesTipoBusqueda = [
  { key: 'departamentos', text: 'Departamentos', value: 'departamentos' },
  { key: 'municipios', text: 'Municipios', value: 'municipios' },
]

class InvestigationRequest extends React.Component {
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
		

		let message = "";


			message = <Message
	    			info
				    icon='microphone'
				    header='¿Desea registrar una nueva solicitud de investigación?'
				    content={
				    	<Segment basic className="no-padding">
				    		Para registrar una solicitud de investigación, haga clic sobre el siguiente botón 
					    	<Button onClick={() => this.props.history.push(config_routes.register_investigation_request.path)} positive type="button" className="margin-left-10">Registrar solicitud de investigación</Button>.
					    	A continuación, se desplegará el formulario de registro de la solicitud de investigación. Diligencie el formulario y haga clic en el botòn de guardar.
				    	</Segment>
				    }
				  />

			

	    return (
	    	<Container>
	    		{message}

	    		<Grid columns={3} doubling stackable>
	    		<Image src="http://mapamudo.net/wp-content/uploads/mapa-mudo-de-colombia-2.png"/>

        			 
	     		</Grid>

	        </Container>
	    );
	}
}

const mapStateToProps = (state, props) => {
	return {
	}
}

const mapDispatchToProps = (dispatch, props) => {
	return {
		
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(InvestigationRequest);