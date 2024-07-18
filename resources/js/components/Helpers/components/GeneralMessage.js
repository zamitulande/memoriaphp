import React, { Component, PropTypes } from 'react';
import { Message, Icon } from 'semantic-ui-react';

class GeneralMessage extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	icon:"",
        	propsMessage:{},
        };

        this.onDismiss = this.onDismiss.bind(this);
    }

    componentDidMount() {
    	let propsMessage = {};
    	let iconMessage = "";
    	if('error' in this.props){
    		propsMessage = {negative:true};
    		iconMessage = <Icon name="ban"/>
    	}else if('success' in this.props){
    		propsMessage = {positive:true};
    		iconMessage = <Icon name="check circle"/>
    	}else if('info' in this.props){
    		propsMessage = {info:true};
    		iconMessage = <Icon name="info circle"/>
    	}else if('warning' in this.props){
    		propsMessage = {color:'yellow'};
    		iconMessage = <Icon name="warning circle"/>
    	}

    	this.setState({
        	icon:this.props.icon?iconMessage:"",
        	propsMessage:propsMessage,
    	})
    }

    onDismiss(){
        if(this.props.onDismiss)this.props.onDismiss();
    }

    render() {
    	const { icon, propsMessage } = this.state;
        const { messages } = this.props;

        return (
            <Message {...propsMessage} icon hidden={messages && messages.length?false:true} onDismiss={this.onDismiss}>
            	{ icon }
				<Message.List items={messages} />
			</Message>
        );
    }
}

export default GeneralMessage;
