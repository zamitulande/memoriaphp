import React, { Component, PropTypes } from 'react';
import Colombia from "./co.svg";
import SVG from 'react-inlinesvg';
import svgPanZoom from 'svg-pan-zoom';
import { Header, Segment } from 'semantic-ui-react';

class SvgMap extends Component {
    constructor(props) {
        super(props);

        this.setListener = this.setListener.bind(this);
        this.onClickDepto = this.onClickDepto.bind(this);

        this.state = {
        	selected:null,
            idSelected:null,
        	hovered:null
        }
    }

    setListener(){
    	let zoomSvg = svgPanZoom("#mapa_colombia",{
			panEnabled: true
			, controlIconsEnabled: true
			, zoomEnabled: true
			, dblClickZoomEnabled: false
			, mouseWheelZoomEnabled: true
			, preventMouseEventsDefault: true
			, zoomScaleSensitivity: 0.2
			, minZoom: 1
			, maxZoom: 3
			, fit: true
			, contain: false
			, center: true
			, refreshRate: 'auto'
		});

    	let deptos = document.getElementsByClassName("svg_departamento");

    	for(let depto of deptos){
        	depto.addEventListener('click', (e) => {
        		let classDeptos = document.querySelector(".active_dpto");
                
                if(classDeptos)
        		  classDeptos.classList.remove('active_dpto');

                if(e.target.id.split("_")[0] != this.state.idSelected){
        		  e.target.classList.add("active_dpto");
        		  this.onClickDepto(e.target.id.split("_")[0], e.target.id.split("_")[1]);
                }else{
                    this.onClickDepto(null, null);
                }
        	});

        	depto.addEventListener('mouseenter', (e) => {
        		let name = e.target.id.split("_")[1]
        		this.setState({
		    		hovered:name
		    	});
        	});

        	depto.addEventListener('mouseleave', (e) => {
        		this.setState({
		    		hovered:null
		    	});
        	});
        }
    }

    onClickDepto(id, name){
    	this.setState({
    		selected:name,
            idSelected:id
    	});
    	if("onselectDepto" in this.props){
    		this.props.onselectDepto(id, name);
    	}
    }

    render() {
    	const { selected, hovered } = this.state;

        return <Segment loading={'loading' in this.props?this.props.loading:false}>
        	<SVG
	        	src={Colombia}
	        	loader={<p>Cargando mapa</p>}
	        	onLoad={this.setListener}
	        	style={{width:"100%",height:"auto"}}
	        	id="mapa_colombia"
	     	/>
	     	<Header as="h2" textAlign="center" dividing>
	     		<span style={{color:"#01579b"}}>{(selected?selected:"")}</span>
	     		<span style={{color:"#949799"}}>{(hovered?(selected?" // "+hovered:hovered):"")}</span>
     		</Header>
     	</Segment>
    }
}

export default SvgMap;
