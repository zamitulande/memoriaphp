import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Icon, Loader, Segment, Header, Form, Grid } from 'semantic-ui-react';
import axios from 'axios';
import params from '../../config/params';
import { Valid, Btn, GeneralMessage } from '../Helpers/Helpers';
import {actLogin} from '../../redux/app/actions';

class AccountActivation extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	loading:false,
        	message:"",
        	password:"",
        	formValidations:{
                password:false,
            },
            formErrors:{
                password:[],
            },
            formIsValid:false,
        }

        this.onTrueValid = this.onTrueValid.bind(this);
        this.onFalseValid = this.onFalseValid.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Función para mantener actualizados y sincronizados los datos del form y el store
     * @param  {event}  e               evento que se produjo
     * @param  {String} options.name    Name del campo que produjo el evento
     */
    handleChange(e, {name}){
        //si es un checkbox se toma como valor el estado de checked
        //de lo contrario se toma el valor del campo
        let value = (e.target.type == 'checkbox')?e.target.checked:e.target.value;
        this.setState({ [name]:  value});
    }

    handleFocus(e, {name}){
        this.setState((oldState, props) => {
            return {formErrors: Object.assign({}, oldState.formErrors, {[name]:[]})}
        })
    }


    /**
     * Función encargada de enviar los datos al servidor
     */
    handleSubmit(){
        this.setState({
        	loading:true,
        	message:"",
        	formIsValid:false
        });

        setTimeout(() => {
        	this.setState({message:<GeneralMessage info messages={["Un momento por favor, estamos activando su cuenta ..."]} onDismiss={() => this.setState({message:""})}/>,});
        },10);

        const paramsSend = Object.assign({},this.props.match.params,{password:this.state.password});

        axios.post(params.URL_API+"user/account-activation", paramsSend)
    	.then(
    		(response) => {
    			const password = this.state.password;
    			this.setState({
		        	loading:false,
		        	message:<GeneralMessage success messages={["La cuenta ha sido activada con éxito, su sesión iniciará en unos segundos."]} onDismiss={() => this.setState({message:""})}/>,
		        	password:"",
		        	formIsValid:false
		        });
    			setTimeout(() => {
    				this.props.login({
    					username:response.data.email,
    					password:password,
    					rememberMe:false
    				});
		        }, 5000)

    		}, 
    		({response}) => {
    			this.setState({
			        	message:"",
			        	formIsValid:true
			        });

    			setTimeout(() => {
	    			this.setState({
		        		loading:false,
			        	message:<GeneralMessage error messages={[response.data.error]} onDismiss={() => this.setState({message:""})}/>
			        });
    			},10);
    		});
    }

    
    /*=====  Fin de Manejadores de eventos  ======*/

    setFormIsValid(){
        setTimeout(() => {
            let isValid = true;

            _.map(this.state.formValidations, (value, key) => {
                if(!value)isValid = false;
            });

            this.setState({
                formIsValid:isValid
            })    
        }, 10)
    }

    onTrueValid({name}){
        this.setState((oldState, props) => {
            return {
                formValidations:Object.assign({},oldState.formValidations,{[name]:true})
            }
        });

        this.setFormIsValid();
    }

    onFalseValid({name}){
        this.setState((oldState, props) => {
            return {
                formValidations:Object.assign({},oldState.formValidations,{[name]:false})
            }
        });

        this.setFormIsValid();
    }

    render() {
    	const {loading, message, password, formErrors} = this.state;
        return (
        	<Segment textAlign="center" basic>
	        	<Segment basic textAlign="center">
		            <Loader active={loading} size='medium' style={{marginTop:"-10px"}}/>
		            <Icon name="laptop" size="massive"/>
	            </Segment>
	            <Grid columns={3} centered>
	            	<Grid.Column>
			            <Form>
			            	<Valid.Input
			            	 	id="password" 
                                name="password" 
                                value={password} 
			            	 	label="Ingrese su contraseña"
                                type="password" 
                                onChange={this.handleChange} 
                                onFocus={this.handleFocus} 
                                onTrueValid={this.onTrueValid}
                                onFalseValid={this.onFalseValid}
                                required
                                min_length={8}
                                max_length={60}
                                errors={formErrors.password}
			            	 />
			            	<Btn.Send fluid disabled={!this.state.formIsValid} onClick={this.handleSubmit}/>
			            </Form>
			            {message}
		            </Grid.Column>
	            </Grid>
            </Segment>
        );
    }
}

const mapStateToProps = (state) => {
	return {};
}

const mapDispatchToProps = (dispatch) => {
	return {
		login:(data) => {
			return dispatch(actLogin(data));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountActivation);
