import React, { Component, createRef } from 'react';

import { Segment, Sticky, Divider, Icon, Grid, Button, Container } from 'semantic-ui-react';
import { Btn, Comments } from '../../Helpers/Helpers';
import params from '../../../config/params';

import Template1 from '../Templates/Template1';
import Template2 from '../Templates/Template2';
import Template3 from '../Templates/Template3';
import Template4 from '../Templates/Template4';

class Detail extends Component {
	contextRef = createRef()
    constructor(props) {
        super(props);

        this.handleReturn = this.handleReturn.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.stickyTop = "showNavigation" in this.props && this.props.showNavigation?102:0;
    }

    handleReturn(){
    	if("onReturn" in this.props){
    		this.props.onReturn();
    	}
    }

    handleNext(){
    	if("onNext" in this.props){
    		this.props.onNext(this.props.testimony.id);
    	}
    }

    handlePrevious(){
    	if("onPrevious" in this.props){
    		this.props.onPrevious(this.props.testimony.id);
    	}
    }

    render() {
    	let template = "";

        switch(this.props.testimony.plantilla ){
        	case "1":
        		template = <Template1 testimony={this.props.testimony} user={{nombres:"PRUEBA",apellidos:"REALIZADA"}} fromServer/>
        		break;
        	case "2":
        		template = <Template2 testimony={this.props.testimony} user={{nombres:"PRUEBA",apellidos:"REALIZADA"}} fromServer/>
        		break;
        	case "3":
        		template = <Template3 testimony={this.props.testimony} user={{nombres:"PRUEBA",apellidos:"REALIZADA"}} fromServer/>
        		break;
        	case "4":
        		template = <Template4 testimony={this.props.testimony} user={{nombres:"PRUEBA",apellidos:"REALIZADA"}} fromServer/>
        		break;
        }

        const btnReturn = "returnable" in this.props?(
        		this.props.returnable?<Btn.Return onClick={this.handleReturn}/>:""
        	):"";

        const navigation = "showNavigation" in this.props && this.props.showNavigation?
        					<Sticky context={this.contextRef} offset={window.innerHeight - this.stickyTop}>
        			<Segment className="no-border no-margin padding-bottom-none">
	        			<Divider className="no-margin" horizontal>
	        				<Icon name="angle left"/>
	        				<Icon name="angle left"/>
	        				<Icon name="ellipsis horizontal"/>
	        				<Icon name="angle right"/>
	        				<Icon name="angle right"/>
	        			</Divider>
        			</Segment>

        			<Segment className="no-border no-margin">
        				<Grid columns={2}>
        					<Grid.Column>
	        					<Btn.Previous fluid size="big" onClick={this.handlePrevious}/>
        					</Grid.Column>

        					<Grid.Column>
	        					<Button fluid size="big" onClick={this.handleNext}>Siguiente <Icon name="arrow right"/></Button>
        					</Grid.Column>
        				</Grid>
        			</Segment>
        		</Sticky>:"";

        const comments = (this.props.testimony.estado == "Aprobado"
                         ||(this.props.user && this.props.user.rol == "Administrador")
                         ||(this.props.user && this.props.user.rol == "Usuario" && this.props.user.id == this.props.testimony.usuario_id))?
                            <Container className="no-padding">
                                <Segment basic>
                                    <Comments
                                        href={params.URL+"/testimony/"+this.props.testimony.id}
                                    />
                                </Segment>
                            </Container>:"";

        let btnUpdate = "";

        if(
                (this.props.user && this.props.user.rol == "Administrador")
                || (
                    this.props.user.rol == "Usuario"
                    && this.props.testimony.estado == "Registrado"
                    && this.props.testimony.usuario_id == this.props.user.id
                )
            )
                btnUpdate = <Segment basic>
                        <Btn.Update floated="right" onClick={() => {
                            this.props.handleUpdate(this.props.testimony.id)
                        }}/>
                    </Segment>

        return (
        	<div ref={this.contextRef} style={{marginTop:"-"+this.stickyTop+"px"}}>
        		{navigation}

	            <Segment basic className="padding-top-none padding-left-none padding-right-none" style={{paddingBottom:this.stickyTop+"px"}}>
	            	<Segment basic className="padding-left-30 margin-bottom-none margin-top-none padding-bottom-none padding-top-none">{btnReturn}</Segment>
	            	{template}
                    {btnUpdate}
                    {comments}
	            </Segment>
            </div>
        );
    }
}

export default Detail;
