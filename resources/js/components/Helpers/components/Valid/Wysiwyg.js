import React, { Component, PropTypes } from 'react';

import { Segment } from 'semantic-ui-react';

import CKEditor from '@ckeditor/ckeditor5-react';
import balloonBlockEditor from '@ckeditor/ckeditor5-build-balloon-block';
import es from '@ckeditor/ckeditor5-build-balloon-block/build/translations/es.js'

import { validateLength } from './Validations';
import { setError, clearError, setValidState, getErrors } from './Helpers';
import { eventForValidationState } from './Events';

class Wysiwyg extends Component {
	
    constructor(props) {
        super(props);
        this.state = {
        	data:"value" in this.props?this.props.value:"",
    		errors:[],
    		otherErrors:props.errors,
        }

        //indica cuando se va a producir un evento automatico (no lo genera un usuario)
		let automatic_event = false;
		//Determina si toda la validación del campo es correcta o falsa
		let validState = false;

        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    componentWillReceiveProps(nextProps) {
	    this.setState({
            otherErrors:nextProps.errors,
            data:nextProps.value
        });
	}

    handleChange(evt, editor){

    	const data = editor.getData();

    	let dataRender = editor.getData().replace(/<[^>]*>?/g, '');
    	//se borran espacios de HTML
    	dataRender = dataRender.replace(/&nbsp;/g, ' ');

    	let value = dataRender;

    	//almacena el estado de validación actual
    	let oldValidState = this.validState;

    	//se inicia como si la validación fuera correcta
    	setValidState(true, true, this);

    	//si se debe detener el evento y no mostrar cambios en pantalla
    	let stopEvent = false;
    	
    	//validación de cantidad de caracteres
    	if('min_length' in this.props || 'max_length' in this.props){
    		const vLength = validateLength(dataRender, this.props.min_length, this.props.max_length);	
    		//validacion falló
    		if(!vLength.state && dataRender.length || vLength.msj.length){
    			setError('v_length', vLength.msj,this);
    			setValidState(vLength.state, false, this);
    		}else{
    			//si el campo es requerido pero se encuentra vacio
    			//la validacion se da por fallida
    			if('required' in this.props && !dataRender.length)
    				setValidState(false, false, this);

    			clearError('v_length', this);
    		}

    		stopEvent = vLength.stopEvent;
    	}

    	if(!stopEvent){
			this.setState({
				data:data
			})	
		}else{
			//después de usar setData se producirá automáticamente
			//un evento onChange -- si es automático no se debe validar
			this.automatic_event = true;

			value = this.state.data.replace(/<[^>]*>?/g, '');
	    	//se borran espacios de HTML
	    	value = value.replace(/&nbsp;/g, ' ');

    		evt.stop();
			editor.setData(this.state.data);
		}

		if('onChange' in this.props){
			this.props.onChange(data, dataRender);
		}

		//dispara eventos de estado general de validación
		eventForValidationState(oldValidState, this, value, this.props.name);
    }

    handleFocus(evt, editor){
    	//console.log(editor.getData().replace(/<[^>]*>?/g, ''));
    	this.setState({
    		errors:[],
    		otherErrors:[]
    	})

    	if('onFocus' in this.props){
    		this.props.onFocus(editor);
    	}
    }

    handleBlur(evt, editor){
    	if("required" in this.props && !editor.getData().length){
    		setError('required','Este campo es obligatorio',this);
    	}
    	//editor.getData().replace(/<[^>]*>?/g, '')

    	if('onBlur' in this.props){
    		this.props.onFocus(editor);
    	}
    }    

    render() {
    	const { data } = this.state;

    	let errors = getErrors(this);

        return (
        	<Segment basic className="no-padding">
	            <CKEditor
	                editor={ balloonBlockEditor}
	                data={data}
	                onInit={ editor => {
	                    // You can store the "editor" and use when it is needed.
	                    //console.log( 'Editor is ready to use!', editor );
	                    //console.log(Array.from( editor.ui.componentFactory.names() ));
	                } }
	                onChange={ ( evt, editor) => {
	                	if(!this.automatic_event)
	                		this.handleChange(evt,editor);
	                	else
	                		this.automatic_event = false;
	                } }
	                onBlur={ (evt, editor) => {
						this.handleBlur(evt, editor);
                    } }
                    onFocus={ (evt, editor) => {;
                    	this.handleFocus(evt, editor);
                    } }
	                config={{
	                	blockToolbar: [ 'heading', '|', 'insertTable', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'undo', 'redo'],
	                	toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ],
				        heading: {
				            options: [
				                { model: 'paragraph', title: 'Parrafo', class: 'ck-heading_paragraph' },
				                { model: 'heading1', view: 'h3', title: 'Título 1', class: 'ck-heading_heading1' },
				                { model: 'heading2', view: 'h4', title: 'Título 2', class: 'ck-heading_heading2' },
				                { model: 'heading3', view: 'h5', title: 'Título 3', class: 'ck-heading_heading3' }
				            ]
				        },
				        placeholder:"placeholder" in this.props?this.props.placeholder:"",
				        language:"es"
	                }}
	            />
            	<Segment basic style={{padding:'0px', marginTop:'10px'}}>
					{ errors }
				</Segment>
            </Segment>
        );
    }
}

export default Wysiwyg;