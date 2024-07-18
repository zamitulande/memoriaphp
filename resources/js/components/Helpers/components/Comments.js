import React, { Component } from 'react';

import { Segment, Button } from 'semantic-ui-react';

class Comments extends Component {
    isMounted = false;
    constructor(props) {
        super(props);

        const startHidden = ("startHidden" in props && props.startHidden)?true:false;

        this.state = {
        	showButton:startHidden?true:false,
        	startHidden,
        	loading:false,
            classComments:"",
            classCommentsCount:""
        };

        this.loadComments = this.loadComments.bind(this);
    }

    componentWillMount() {
        this.isMounted = true;
    	this.loadComments();
    }

    componentWillUnmount() {
        this.isMounted = false;
    }

    loadComments(clickButtonComments = false){

    	const {startHidden, showButton} = this.state;
    	if(!startHidden || (startHidden && !showButton) || clickButtonComments){
    		this.setState({
    			loading:true,
                classCommentsCount:"fb-comments-count",
                classComments:"fb-comments"
    		})
    		//console.log(FB.XFBML);
	    	setTimeout(() => {
	    		FB.XFBML.parse(null, () => {
                    if(this.isMounted){
    	    			this.setState({
    		    			loading:false
    		    		})
                    }
	    		});

	    		if(clickButtonComments && this.isMounted){
	    			this.setState({showButton:false});
	    		}
	    	}, 10);
	    }
    }

    componentWillReceiveProps(nextProps) {
    	this.loadComments();           
    }

	//<span className="fb-comments-count" data-href="http://127.0.0.1:8000/testimony"></span>
	//<Button content="recargar" onClick={this.loadComments}/>
    render() {
    	const { showButton, loading, classComments, classCommentsCount } = this.state;

    	let content = "";

    	if("onlyCount" in this.props && this.props.onlyCount){
    		content = <span className={classCommentsCount} data-href={this.props.href}></span>
    	}else{
    		const buttonComments = showButton?<Button fluid icon="comments" primary content="Ver comentarios" onClick={() => {
    			this.loadComments(true);
    		}}/>:"";

    		content = <Segment loading={loading}>
    					{buttonComments}
			            <div
							className={classComments}
							data-href={this.props.href} 
							data-width="100%"
							data-numposts="10"
			              >
			            </div>
			        </Segment>	
    	}

        return content;
    }
}

export default Comments;
