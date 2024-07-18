import React, { Component, PropTypes } from 'react';

import { Responsive, Segment} from 'semantic-ui-react';

const defaultWidth = 350;
const defaultHeight = 300;

class StaticSidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	styles:{}
        }

    }

    componentWillMount() {
    }

    render() {
		if(this.props.modal =='filter'){
			return (
				<div style={stylesFilter(this.props)}>
					{this.props.children}
				</div>            
			);
		}
		if(this.props.modal =='documentacion'){
			return (
				<div style={getStyles(this.props)}>
					{this.props.children}
				</div>            
			);
		}
       
    }
}

const getStyles = (props) => {
	let styles = {
		position:"fixed",
		backgroundColor:"backgroundColor" in props?props.backgroundColor:"rgba(255,255,255,.98)",
		overflowY:"auto",
		zIndex:1,
		transition:"all .3s ease-out",
		border: "1px solid #ededed",
		boxShadow:"0px 0px 20px rgba(0,0,0,.2)"
	};

	if("right" in props || "left" in props){
		let width = "width" in props?props.width:defaultWidth+"px";

		const currentWidth = window.innerWidth;

    	if(currentWidth <= Segment.onlyMobile){
			width = "mobile" in props?props.mobile:width;
    	}else if(currentWidth <= Segment.onlyTablet){
    		width = "tablet" in props?props.tablet:width;
    	}else{
    		width = "computer" in props?props.computer:width;
    	}
    	
		styles.width = width;
		styles.height = "100%";
		styles.paddingRight = "20px";
		styles.paddingLeft = "20px";
		styles.paddingTop = "90px";
		styles.paddingBottom = "20px";
		styles.top = 60;

		if("right" in props){
			styles.right = "-"+width;
			if(props.visible)
				styles.transform = "translateX(-"+width+")";
		}else if("left" in props){
			styles.left = "-"+width;
			if(props.visible)
				styles.left = "0px";
				//styles.transform = "translateX("+width+")";
		}
	}else if("bottom" in props || "top" in props){
		const height = "height" in props?props.height:defaultHeight+"px";

		const currentWidth = window.innerWidth;

    	if(currentWidth <= Segment.onlyMobile){
			height = "mobile" in props?props.mobile:height;
    	}else if(currentWidth <= Segment.onlyTablet){
    		height = "tablet" in props?props.tablet:height;
    	}else{
    		height = "computer" in props?props.computer:height;
    	}

		styles.width = "100%";
		styles.height = height;
		styles.paddingBottom = "20px";
		styles.paddingLeft = "20px";
		styles.paddingRight = "20px";
		styles.left = 0;

		if("bottom" in props){
			styles.paddingTop = "20px";	
			styles.bottom = "-"+height;
			if(props.visible)
				styles.transform = "translateY(-"+height+")";
		}else if("top" in props){
			styles.paddingTop = "90px";	
			styles.top = "-"+height;
			if(props.visible)
				styles.transform = "translateY("+height+")";
		}
	}

	return styles;
}

const stylesFilter = (props) => {
	let styles = {
		position:"fixed",
		backgroundColor:"backgroundColor" in props?props.backgroundColor:"rgba(255,255,255,.98)",
		overflowY:"auto",
		zIndex:1,
		transition:"all .3s ease-out",
		border: "1px solid #ededed",
		boxShadow:"0px 0px 20px rgba(0,0,0,.2)"
	};

	if("right" in props || "left" in props){
		let width = "width" in props?props.width:defaultWidth+"px";

		const currentWidth = window.innerWidth;

    	if(currentWidth <= Segment.onlyMobile){
			width = "mobile" in props?props.mobile:width;
    	}else if(currentWidth <= Segment.onlyTablet){
    		width = "tablet" in props?props.tablet:width;
    	}else{
    		width = "computer" in props?props.computer:width;
    	}
    	
		styles.width = width;
		styles.height = "100%";
		styles.paddingRight = "20px";
		styles.paddingLeft = "20px";
		styles.paddingTop = "90px";
		styles.paddingBottom = "20px";
		styles.top = 60;

		if("right" in props){
			styles.right = "-"+width;
			if(props.visible)
				styles.transform = "translateX(-"+width+")";
		}else if("left" in props){
			styles.left = "-"+width;
			if(props.visible)
				styles.left = "0px";
				//styles.transform = "translateX("+width+")";
		}
	}else if("bottom" in props || "top" in props){
		const height = "height" in props?props.height:defaultHeight+"px";

		const currentWidth = window.innerWidth;

    	if(currentWidth <= Segment.onlyMobile){
			height = "mobile" in props?props.mobile:height;
    	}else if(currentWidth <= Segment.onlyTablet){
    		height = "tablet" in props?props.tablet:height;
    	}else{
    		height = "computer" in props?props.computer:height;
    	}

		styles.width = "100%";
		styles.height = height;
		styles.paddingBottom = "20px";
		styles.paddingLeft = "20px";
		styles.paddingRight = "20px";
		styles.left = 0;

		if("bottom" in props){
			styles.paddingTop = "20px";	
			styles.bottom = "-"+height;
			if(props.visible)
				styles.transform = "translateY(-"+height+")";
		}else if("top" in props){
			styles.paddingTop = "90px";	
			styles.top = "-"+height;
			if(props.visible)
				styles.transform = "translateY("+height+")";
		}
	}

	return styles;
}

export default StaticSidebar;
