import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Card, Header, Icon, Grid, Segment, Label, Image, Divider} from 'semantic-ui-react';
import { Btn, Comments } from '../../Helpers/Helpers';
import params from '../../../config/params';

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

class Compact extends Component {
	isMounted = false;

    constructor(props) {
        super(props);

        this.handleMore = this.handleMore.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentWillMount() {
        this.isMounted = true;
    }

    componentWillUnmount() {
        this.isMounted = false;
    }

    handleMore(idTestimony){
    	if('onClickMore' in this.props && this.isMounted){
    		this.props.onClickMore(idTestimony);
    	}
    }

    handleUpdate(idTestimony){
    	if('onClickUpdate' in this.props && this.isMounted){
    		this.props.onClickUpdate(idTestimony);
    	}
    }

	getImages(testimony){
    	let images = "";
    	if("anexos" in testimony && testimony.anexos.length){
    			images = _.map(testimony.anexos, (el, i) => {
    				let date = el.fecha;
    				if(date){
	    				date = months[parseInt(date.split("-")[1])-1]
	    					+" "+date.split("-")[2]
	    					+" del "+date.split("-")[0];
	    			}
					let src= null;
					src = params.URL_API+"testimony/annexed/"+testimony.id+"/image/"+el.id;

	    			return src
	    		})    	
    	}
	    return images;
    }

    render() {
    	const { testimony } = this.props;
		let backgroundImageStyle = {};
		const images = this.getImages(testimony);

		if (images.length > 0) {
			backgroundImageStyle = {
				backgroundImage: `url(${images[0]})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundColor:"rgba(0,0,0,.5)"
			};
		}

    	let color = "";

    	let label = "";

    	let btnOption = <Btn.More floated="right" onClick={() => this.handleMore(testimony.id)}/>

    	if(this.props.user && (this.props.user.rol == "Administrador" || this.props.user.id == testimony.usuario_id)){
	    	
	    	if(testimony.estado == "Registrado"){
				label = <Label as='a' color='blue' corner>
		        	<Icon name="wait"/>
		        </Label>

		        color = "blue";
		    }

	    	if(testimony.estado == "Aprobado"){
				label = <Label as='a' color='green' corner>
		        	<Icon name="check circle"/>
		        </Label>

		        color = "green";
		    }


	    	if(testimony.estado == "Cancelado"){
				label = <Label as='a' color='grey' corner>
		        	<Icon name="times circle"/>
		        </Label>

		        color = "grey";
		    }
	    }
        return (
	            <Card style={backgroundImageStyle}>	
					<Card.Content style={{backgroundColor:"rgba(0,0,0,.4)", color:"#FFFFFF"}}>
						{label}		            	
						<Card.Header>
							<h1 className='dateWhite'>{testimony.titulo}</h1>
						</Card.Header>
						<Divider/>
						<Card.Meta>
							<span className='dateWhite'>{testimony.fecha_evento}</span>
						</Card.Meta>
						<Card.Meta>
							<span className='dateWhite'>{testimony.nombreMunicipio}</span>
						</Card.Meta>
						<Divider/>
						<Card.Description>
							<span className='dateWhite'>{testimony.descripcion_corta}</span>
						</Card.Description>				
					</Card.Content>
					<Card.Content extra style={{backgroundColor:"rgba(0,0,0,.4)"}}>
						<Label>
							<Icon name='comments' />
							<Comments
								onlyCount
		                        href={params.URL+"/testimony/"+testimony.id}
		                    />
						</Label>
						{btnOption}
					</Card.Content>
				</Card>
        );
    }
}

const mapStateToProps = (state) => {
	return {
		user:state.app.userAuth?state.app.user:false
	}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Compact);
