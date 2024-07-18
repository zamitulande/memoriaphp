import React, { PropTypes } from 'react';
import store from '../../../redux/store';
import { withRouter, Link } from 'react-router-dom';

import { Grid, Form, Checkbox, Button, Icon, Segment, Container, Label } from 'semantic-ui-react';
import { GeneralMessage, Valid, Btn, SearchServer } from '../../Helpers/Helpers';

import config_routes from '../../../config/routes';
import { actLogin } from '../../../redux/app/actions';
import {animateScroll} from 'react-scroll';

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            remember: false,
            loading: false,
            showPassword: false,
            formValidations: {
                username: false,
                password: false
            },
            formIsValid: false,
            error: [],//errores generales de la autenticaciòn
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.onTrueValid = this.onTrueValid.bind(this);
        this.onFalseValid = this.onFalseValid.bind(this);
    }


    /*==============================================
    =            Manejadores de eventos            =
    ==============================================*/

    /**
     * Función para mantener actualizados y sincronizados los datos del form y el store
     * @param  {event}  e               evento que se produjo
     * @param  {String} options.name    Name del campo que produjo el evento
     */
    handleInputChange(e, { name }) {
        //si es un checkbox se toma como valor el estado de checked
        //de lo contrario se toma el valor del campo
        let value = (e.target.type == 'checkbox') ? e.target.checked : e.target.value;
        this.setState({ [name]: value });
    }

    /**
     * Dispara la acciòn de login y actualiza el error en el estado(si hay error)
     */
    handleLogin() {
        this.setState((oldState, props) => {
            return { loading: true }
        })

        store.dispatch(actLogin(this.state))
            .then((p) => {
                //si se obtiene una respuesta es porque existe un error en la autenticación
                if (typeof p != 'undefined') {
                    this.setState({
                        loading: false,
                        error: [p.message]
                    })
                }
            })
    }

    /*=====  Fin de Manejadores de eventos  ======*/


    /*=========================================================
    =            Estado de validaciòn de formulario            =
    =========================================================*/

    setFormIsValid() {
        setTimeout(() => {
            let isValid = true;

            _.map(this.state.formValidations, (value, key) => {
                if (!value) isValid = false;
            });

            this.setState({
                formIsValid: isValid
            })
        }, 10)
    }

    onTrueValid({ name }) {
        this.setState((oldState, props) => {
            return {
                formValidations: Object.assign({}, oldState.formValidations, { [name]: true })
            }
        });

        this.setFormIsValid();
    }

    onFalseValid({ name }) {
        this.setState((oldState, props) => {
            return {
                formValidations: Object.assign({}, oldState.formValidations, { [name]: false })
            }
        });

        this.setFormIsValid();
    }

    /*=====  Fin de estado de validaciòn de formulario  ======*/

    render() {
        const { username, password, remember, loading, error } = this.state;
        animateScroll.scrollToTop();
        return (
            <Container style={{paddingTop: '40px'}}>
                <Grid centered>
                    <Grid.Column computer={6} tablet={10} mobile={14}>
                        <Form loading={loading}>
                            <Valid.Input
                                noRenderFails
                                email
                                onTrueValid={this.onTrueValid}
                                onFalseValid={this.onFalseValid}
                                type="text"
                                name="username"
                                id="username"
                                value={username}
                                label='Usuario'
                                onChange={this.handleInputChange}
                                required
                            />

                            <Valid.Input
                                noRenderFails
                                onTrueValid={this.onTrueValid}
                                onFalseValid={this.onFalseValid}
                                min_length={8}
                                max_length={60}
                                id="password"
                                name="password"
                                value={password}
                                label="Contraseña"
                                type='password'
                                onChange={this.handleInputChange}
                                required
                            />
                            <GeneralMessage error messages={error} onDismiss={() => this.setState({ error: [] })} />
                            <Form.Field id="remember" name="remember" checked={remember} label="Recordarme" control={Checkbox} onChange={this.handleInputChange} />

                            <Button disabled={!this.state.formIsValid} color='green' animated fluid onClick={this.handleLogin}>
                                <Button.Content color='green'>Ingresar</Button.Content>
                                <Button.Content hidden>
                                    <Icon name='arrow right' />
                                </Button.Content>
                            </Button>

                            <Segment basic textAlign='center'>
                                <Link to={config_routes.password_reset_request.path}>¿Olvidó su contraseña?</Link>
                            </Segment>

                            <p className='text-white'>
                                Si aún no tiene una cuenta de usuario, haga <Link to={config_routes.registerUser.path}>click aquí</Link> para registrarse.
                            </p>
                        </Form>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}

export default Login;
