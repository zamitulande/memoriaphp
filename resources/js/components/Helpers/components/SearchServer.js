import React, { Component, PropTypes } from 'react';

import axios from 'axios';

import { Search, Button, Segment } from 'semantic-ui-react';

class SearchServer extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	results:[],
        	isLoading:false,
        	value:"",
        	errors:[],
        	selected:false
        }

        //indica si un valor se debe encontrar seleccionado 
        //este valor se busca automaticamente en el servidor si se asigna y es diferente
        //de null y de -1
        this.selectPredeterminate = this.selectPredeterminate.bind(this);
        this.clearError = this.clearError.bind(this);
        this.clearAllErrors = this.clearAllErrors.bind(this);
        this.setError = this.setError.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        //indica la cantidad de veces que se seleccionó un calor predeterminado
        this.countSelectedPredeterminate = 0;
    }

    componentDidMount() {
        this.selectPredeterminate(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.selectPredeterminate(nextProps);
    }

    /**
     * Selecciona un valor por defecto
     */
    selectPredeterminate(props_){ 
    	//si existe un valor predeterminado
        if("predetermined" in props_){
        	//si el valor predeterminado es -1 se restablecen los valores
        	//esto limpirá el input en la interaz de usuario
        	if(props_.predetermined == null || props_.predetermined == "" ){
        		this.setState({
		        	results:[],
		        	isLoading:false,
		        	value:"",
		        	errors:[],
		        	selected:false
		        });

	        //si se seleccionó un valor predeterminado yna vez, no se puede dos veces
        	}else if(this.countSelectedPredeterminate < 1 && props_.predetermined){
	        	this.countSelectedPredeterminate++;

	        	let params = {search:props_.predetermined};

	        	if('otherParams' in this.props){
	        		_.map(this.props.otherParams, (el, i) => {
	        			params[el.name] = el.value
	        		})
	        	}

	        	axios({
					method:props_.method?props_.method:"post",
					url:props_.url,
					data:params
				})
				.then((response) => {
					this.setState({
						value:response.data[0].title,
						results:response.data,
						selected:true
					});
				})
			}

        }
    }

    handleResultSelect = (e, data) => {
    	this.setState({ value: data.result.title, selected:true })

    	if('handleResultSelect' in this.props){
    		this.props.handleResultSelect(e, data)
    	}
    }

	handleSearchChange = (e, data) => {
		this.setState({ isLoading: true, value:data.value, selected:false })

		if('handleSearchChange' in this.props){
    		this.props.handleSearchChange(e, data);
    	}
		if(this.props.url){
			let dataServer = {
				search:data.value
			};

        	if('otherParams' in this.props){
        		_.map(this.props.otherParams, (el, i) => {
        			dataServer[el.name] = el.value
        		})
        	}

			axios({
				method:this.props.method?this.props.method:"post",
				url:this.props.url,
				data:dataServer
			})
			.then((response) => {				
				this.setState({
					isLoading:false,
					results:response.data
				})
			})
		}
	}

	/**
	 * Deja en null un error en la lista de errores del campo
	 * @param  {String} name Nombre identificador del error
	 */
	clearError(name){
		this.setError(name, null);
	}

	clearAllErrors(){
		this.setState({errors:{}});
	}

	/**
	 * Asigna el valor a un error
	 * @param {String} name    Nombre identificador del error
	 * @param {String} message Mensaje a mostrar en el error
	 */
	setError(name, message){
		this.setState((oldState, props) => {
			return {
				errors:Object.assign({},oldState.errors,{[name]:message})
			}
		})
	}

	handleBlur(e, data){
		if(!this.state.selected && 'required' in this.props)
			this.setError("required","Este campo es obligatorio");
	}

    render() {
    	const {results, isLoading, value, errors} = this.state;

    	let errors_ = "";
		if(!("noRenderFails" in this.props)){
			errors_ = _.map(this.state.errors, (el, i) => {
						if(typeof el === "string")
		                	return <p key={i} style={{color:"#fff", marginBottom:"0px"}}>{el}</p>
	                });

			//une los mensajes enviados desde el componente que instancia
			_.map(this.state.otherErrors, (el, i) => {
				if(typeof el === "string")
                	errors_.push(<p key={i} style={{color:"#fff", marginBottom:"0px"}}>{el}</p>)
            });
		}

        return (
        	<Segment basic style={{padding:"0px"}}>
        		<div className={"field "+("required" in this.props?"required":"")+("disabled" in this.props?(this.props.disabled?"disabled":""):"")}>
        			
	        		{
	        			"label" in this.props?
	        			<label>
		        			{this.props.label}
		        		</label>:""
	        		}
        		
		            <Search
		            	input={{ icon: ('noRenderIcon' in this.props?<i></i>:'search'), fluid: true, name:('name' in this.props)?this.props.name:"", placeholder:('placeholder' in this.props)?this.props.placeholder:"Escriba..."}}
		            	fluid
			            loading={isLoading}
			            onResultSelect={this.handleResultSelect}
			            onSearchChange={this.handleSearchChange}
			            results={results}
			            value={value}
			            noResultsMessage="Sin resultados."
			            size={this.props.size}
			            onFocus={this.clearAllErrors}
			            onBlur={this.handleBlur}
			            disabled={"disabled" in this.props?this.props.disabled:false}
			          />
			       	<Segment basic style={{padding:'0px', marginTop:'5px'}}>
						{ errors_ }
					</Segment>
	          	</div>
          	</Segment>
        );
    }
}

export default SearchServer;
