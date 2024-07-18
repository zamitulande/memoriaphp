import React, {Component} from 'react';

import axios from 'axios';
import { connect } from 'react-redux';
import { actLogin, actResetPassword } from '../../../redux/app/actions';

import params from '../../../config/params';

import { Form, Button, Icon, Segment, Grid, Message } from 'semantic-ui-react';
import { Valid } from '../../Helpers/Helpers';

class ResetPassword extends Component
{
    isMounted = false;
    constructor(props)
    {
        super(props);
        this.state = {
            email:'',
            password:'',
            password_confirmation:'',
            formValidations:{
                email:false,
                password:false,
                password_confirmation:false
            },
            formErrors:{
                email:[],
                password:[],
                password_confirmation:[],
            },
            loading:false,//define si está visible o no el loader
            formIsValid:false,
            token:props.match.params.token
        }

        this.onTrueValid = this.onTrueValid.bind(this);
        this.onFalseValid = this.onFalseValid.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.isMounted = true;
    }

    componentWillUnmount() {
        this.isMounted = false;
    }

    /*==============================================
    =            Manejadores de eventos            =
    ==============================================*/
    
    
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
        this.setState({loading:true});

        this.props.resetPassword(this.state)
        .then((response) => {
            if(response && response.status != 200){
                this.setState({loading:false});
                let errors = {};
                _.map(response.data, (el, i) => {
                    errors[i] = el;
                });
                this.setState((oldState, props) => {
                    return {formErrors: Object.assign({}, oldState.formErrors, errors)};
                })
            }
        })
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

    render()
    {
        const { 
            loading,
            email,
            password,
            password_confirmation,
            formErrors
        } = this.state;


        return  <Segment basic loading={loading} style={{paddingTop: '40px'}}>
                <Grid centered>
                    <Grid.Column mobile="14" tablet="10" computer="5">

                        <Form>
                            <Valid.Input 
                                id="email" 
                                name="email" 
                                value={email} 
                                label="Correo electrónico" 
                                type="text" 
                                onChange={this.handleChange}
                                onFocus={this.handleFocus}
                                onTrueValid={this.onTrueValid}
                                onFalseValid={this.onFalseValid}
                                required
                                email
                                max_length={100}
                                errors={formErrors.email}
                            />

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

                            <Valid.Input 
                                id="password-confirm" 
                                name="password_confirmation" 
                                value={password_confirmation} 
                                label="Confirme su contraseña" 
                                type="password" 
                                onChange={this.handleChange}
                                onFocus={this.handleFocus}
                                onTrueValid={this.onTrueValid}
                                onFalseValid={this.onFalseValid}
                                required
                                min_length={8}
                                max_length={60}
                                errors={formErrors.password_confirmation}
                            />
                            
                            
                            <Button disabled={!this.state.formIsValid} primary animated fluid onClick={this.handleSubmit}>
                              <Button.Content visible>Restablecer contraseña</Button.Content>
                              <Button.Content hidden>
                                <Icon name='send' />
                              </Button.Content>
                            </Button>
                        </Form>      

                    </Grid.Column>
                </Grid>
            </Segment>
    }
}

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login:(user) => {
            dispatch(actLogin(user))
        },

        resetPassword: (data) => {
            return dispatch(actResetPassword(data))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
