import React, { Component, PropTypes } from 'react';

import { Segment, Image, Grid, Header } from 'semantic-ui-react';

class ImageCheck extends Component {
    constructor(props) {
        super(props);

        let defaultValue = null;

        if('defaultValue' in this.props){
        	_.map(this.props.options, (el, i) => {
    			if(el.value == this.props.defaultValue)defaultValue = i;
    		})
        }

        this.state = {
        	options:this.props.options,
        	indexSelected:defaultValue
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(i, value){
    	this.setState({
    		indexSelected:i
    	})

    	if('onChange' in this.props){
    		this.props.onChange(i, value);
    	}
    }

    render() {
    	const { options, indexSelected } = this.state;
    	const {computer, tablet, mobile} = this.props;

    	let optionsRender = options.map((el, i) => {
    		let classSegment = "cursor_pointer hoverable";

    		if(indexSelected == i)classSegment += " gradient-active"

    		return <Grid.Column key={i} computer={computer} tablet={tablet} mobile={mobile}>
	    		<Segment className={classSegment} onClick={() => this.handleChange(i, el.value)}>
	    			<Header as="h4">
	    				{el.label}
	    				<Header.Subheader>
	    					{el.description}
	    				</Header.Subheader>
    				</Header>
	    			<Image centered src={el.src}/>
	    		</Segment>
    		</Grid.Column>
    	})

        return (
            <Grid centered>
            	{optionsRender}
            </Grid>
        );
    }
}

export default ImageCheck;
