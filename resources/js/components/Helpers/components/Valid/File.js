import React, { Component, PropTypes } from 'react';
import { Input, Segment } from 'semantic-ui-react';

class File extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	errors:[],
        	otherErrors:[],
            reset:false
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let dataSet = {};

    	if("errors" in nextProps && nextProps.errors){
            dataSet = Object.assign({}, dataSet, {otherErrors:nextProps.errors});
    	}

        if("reset" in nextProps && nextProps.reset){
            dataSet = Object.assign({}, dataSet, {reset:true});
        }else{
            dataSet = Object.assign({}, dataSet, {reset:false});
        }

        this.setState(dataSet);
    }

    handleInputChange(e, props){
    	if(e.target.files[0]){
    		let valid = true;
	    	//se valida el tamaño del archivo en megas
	    	if("maxSize" in this.props){
	    		//Se convierten los valores a kilobytes
	    		const size = this.props.maxSize * 1024;
	    		const currentSize = e.target.files[0].size / 1000;

	    		if(currentSize > size){
					delete e.target.files[0];    			
					e.target.value = "";
					this.setState({
						errors:["Archivo demasiado pesado. Sólo se permiten archivos de "+this.props.maxSize+" Mb."]
					})
					valid = false;
	    		}
	    	}

	    	if(valid){
	    		this.setState({
		    		errors:[],
		    		otherErrors:[]
		    	});
	    	}
	    }

    	if("onChange" in this.props){
    		this.props.onChange(e, props);
    	}
    }

    handleFocus(e, props){
    	if("onFocus" in this.props){
    		this.props.onFocus(e, e.target);
    	}
    }

    render() {
    	const {name, label, accept, reset} = this.props;

    	let errors_ = "";
		if(!("noRenderFails" in this.props)){
			errors_ = _.map(this.state.errors, (el, i) => {
						if(typeof el === "string")
		                	return <p key={i} style={{color:"#9f3a38", marginBottom:"0px"}}>{el}</p>
	                });

			//une los mensajes enviados desde el componente que instancia
			_.map(this.state.otherErrors, (el, i) => {
				if(typeof el === "string")
                	errors_.push(<p key={i} style={{color:"#9f3a38", marginBottom:"0px"}}>{el}</p>)
            });
		}

        let inputFIle = <Input type="file" name={name} onChange={this.handleInputChange} onFocus={this.handleFocus} accept={accept} fluid/>

        if(reset){
            inputFIle = "";
        }

        return (
            <Segment basic className={"field no-padding no-margin "+("required" in this.props?"required":"")}>
            	<label>{label?label:""}</label>
        		{inputFIle}
        		<Segment basic style={{padding:'0px', marginTop:'5px'}}>
					{ errors_ }
				</Segment>
            </Segment>
        );
    }
}

export default File;
