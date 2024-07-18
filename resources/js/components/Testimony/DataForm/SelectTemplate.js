import React, { Component, PropTypes } from 'react';

import { ImageCheck } from '../../Helpers/Helpers';

class SelectTemplate extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	selection:("defaultValue" in this.props)?this.props.defaultValue:1,
        }

		this.handleChangeImageCheck = this.handleChangeImageCheck.bind(this);        
    }

    handleChangeImageCheck(i, value){
    	this.setState({
    		selection:value
    	})

    	if("onChange" in this.props){
    		this.props.onChange(this.props, value);
    	}
    }

    render() {
    	const { selection } = this.state;

        return (
            <ImageCheck
            	options={
            		[
            			{label:"Plantilla #1",description:"Fluido",value:"1",src:"/images/template_1.png"},
            			{label:"Plantilla #2",description:"Modal",value:"2",src:"/images/template_2.png"},
            			{label:"Plantilla #3",description:"Pestañas",value:"3",src:"/images/template_3.png"},
            			{label:"Plantilla #4",description:"Acordeón",value:"4",src:"/images/template_4.png"},
            		]
            	}
            	defaultValue={selection}
            	onChange={this.handleChangeImageCheck}
            	computer={4}
            	tablet={8}
            	mobile={12}
             />
        );
    }
}

export default SelectTemplate;
