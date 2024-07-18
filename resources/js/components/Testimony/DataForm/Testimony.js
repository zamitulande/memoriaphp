import React, { Component, PropTypes } from 'react';

import params from '../../../config/params';

import { Grid, Form, Segment, Select } from 'semantic-ui-react';

import { Valid, SearchServer } from '../../Helpers/Helpers';

import SelectTemplate from './SelectTemplate';
import Annexes from './Annexes';
import Data from './Data';

class Testimony extends Component {
    
    constructor(props) {
        super(props);

        this.state={
        	titulo:"",
        	descripcionCorta:"",
        	fechaEvento:"",
			municipioTestimonio:null,
        	tipoTestimonio:"",
			categoriaTestimonio:"",
        	plantilla:"testimony" in this.props?this.props.testimony.plantilla:1,
        	nombreMunicipio:"",
			
			descripcionDetallada:"",
        	video:null,
        	audio:null,
        	audioRecord:null,
        	annexes:[],//almacena la información de los anexos existentes
			annexesValues:{},//almacena los valores de los anexos existentes
			annexesData:{},//almacena la información de las imagenes (nombre, fecha y descripción)

        	deleteVideo:false,//determina si se debe eliminar el video almacenado en el servidor
        	deleteAudio:false,//determina si se debe eliminar el audio almacenado en el servidor

			dataIsValid:false,
			annexesIsValid:false,
			resetForms:false,
			formErrors:{
				titulo:[],
	        	descripcionCorta:[],
	        	fechaEvento:[],
				municipioTestimonio:[],
	        	tipoTestimonio:[],
				categoriaTestimonio:[]
			}
        };

        this.handleUpdateState = this.handleUpdateState.bind(this);        
        this.handleFormUpdateState = this.handleFormUpdateState.bind(this);
    }	

    componentWillReceiveProps(nextProps) {
        if("resetForm" in nextProps && nextProps.resetForm){
        	this.setState({
        		titulo:"",
	        	descripcionCorta:"",
	        	fechaEvento:"",
				municipioTestimonio:null,
	        	tipoTestimonio:"",
				categoriaTestimonio:"",
	        	plantilla:1,
	        	nombreMunicipio:"",
				
				descripcionDetallada:"",
	        	video:null,
	        	deleteVideo:false,
	        	audio:null,
	        	deleteAudio:false,
	        	audioRecord:null,
	        	annexes:[],//almacena la información de los anexos existentes
				annexesValues:{},//almacena los valores de los anexos existentes
				annexesData:{},//almacena la información de las imagenes (nombre, fecha y descripción)

				dataIsValid:false,
				annexesIsValid:false,
				resetForms:true
        	})
        }else{
        	this.setState({resetForms:false})
        }

        if("formErrors" in nextProps){
	        this.setState({
	        	formErrors:nextProps.formErrors
	        })
	    }
    }

    /**
     * Dispara evento de actualización en el componente padre
     * si se envia la propiedad onUpdate
     */
    handleUpdateState(){
    	setTimeout(() => {
			if('onUpdate' in this.props){
				const {
					tipoTestimonio,
					categoriaTestimonio,
					titulo,
					descripcionCorta,
					fechaEvento,
					municipioTestimonio,
					nombreMunicipio,
					descripcionDetallada,
					annexes,
					annexesValues,
					annexesData,
					video,
					audio,
					audioRecord,
					plantilla,
					formErrors,
					deleteAudio,
					deleteVideo
				} = this.state;

				this.props.onUpdate({
					tipoTestimonio,
					categoriaTestimonio,
					titulo,
					descripcionCorta,
					fechaEvento,
					municipioTestimonio,
					nombreMunicipio,
					descripcionDetallada,
					annexes,
					annexesValues,
					annexesData,
					video,
					audio,
					audioRecord,
					plantilla,
					formErrors,
					deleteAudio,
					deleteVideo
				});
			}
		}, 10);
    }

   
    handleFormUpdateState(){
        setTimeout(() => {
        	const {dataIsValid, annexesIsValid} = this.state;
            if("onFormStateChange" in this.props){
            	this.props.onFormStateChange((dataIsValid && annexesIsValid)?true:false);
            }

        }, 10)
    }

    render() {	
    	const { plantilla, resetForms, formErrors } = this.state;
		const { rol } = this.props;
        return (
        	<Segment basic className="no-padding no-margin">
	        	<Data  
	        		initialData={"testimony" in this.props?this.props.testimony:false}
        	    	onFormStateChange={(state) => {
            	    	 	this.setState({dataIsValid:state});
            	    	 	this.handleFormUpdateState();
            	    	}
        	    	}

        	    	onUpdate={(state) => {
        	    			const newState = Object.assign({}, this.state, state);
        	    			this.setState(newState);
        	    			this.handleUpdateState();
            	    	}
            	    }
            	    resetForm={resetForms}
            	    formErrors={formErrors}
					rol={rol}
            	   />
	        	<Grid>	               
	                <Grid.Column mobile={16} tablet={16} computer={16}>
	            	    <Annexes 
	            	    	initialData={"testimony" in this.props?this.props.testimony:false}
	            	    	onFormStateChange={(state) => {
		            	    	 	this.setState({annexesIsValid:state});
		            	    	 	this.handleFormUpdateState();
		            	    	}
	            	    	}

	            	    	onUpdate={(state) => {
	            	    			const newState = Object.assign({}, this.state, state);
	            	    			this.setState(newState);
	            	    			this.handleUpdateState();
		            	    	}
		            	    }
		            	    resetForm={resetForms}
		            	    errors={formErrors.annexes}
	            	    	/>	
	                </Grid.Column>   	     
	            </Grid>  	            
            </Segment>
        );
    }
}

export default Testimony;
