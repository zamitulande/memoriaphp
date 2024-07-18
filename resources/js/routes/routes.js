import React, {Component} from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Header from '../components/Header/Header';
import config_routes from '../config/routes';

import store from '../redux/store';

/*----------  Componentes del sistema  ----------*/

import Home from '../components/Home/Home';

import Testimony from '../components/Testimony/Testimony';
import RegisterTestimony from '../components/Testimony/RegisterTestimony';

import User from '../components/User/User';
import RegisterUser from '../components/User/RegisterUser';
import UpdateUser from '../components/User/UpdateUser';
import AccountActivation from '../components/User/AccountActivation';


import OpenData from '../components/OpenData/OpenData';

//import InvestigationRequest from '../components/InvestigationRequest/InvestigationRequest';
//import RegisterInvestigationRequest from '../components/InvestigationRequest/RegisterInvestigationRequest';

import Login from '../components/Auth/Login/Login';
import PasswordResetRequest from '../components/Auth/PasswordResetRequest/PasswordResetRequest';
import ResetPassword from '../components/Auth/ResetPassword/ResetPassword';

import E404 from '../components/Errors/E404';
import Footer from '../components/Footer/Footer';

import { Notifications, FullLoader } from '../components/Helpers/Helpers';
import RegisterAllies from '../components/Allies/RegisterAllies';
import Allies from '../components/Allies/Allies';
import Conflicto from '../components/Testimony/Modulos/Conflicto';
import Pandemia from '../components/Testimony/Modulos/Pandemia';
import Cultura from '../components/Testimony/Modulos/Cultura';
import Mision from '../components/Mision/Mision';
import Instructivo from '../components/Instructivo/Instructivo';

/*----------  Componentes del sistema  ----------*/

const redirect_no_auth = '/login';//donde redireccionar cuando acceda a url
                                //que requiera autenticación y no esta autenticado
const redirect_auth = '/';//donde redirecciona cuando acceda a url que requiera que
                        //no este autenticado, pero si esta autenticado

/**
 * Crea una ruta admitida solo para usuarios logueados
 * @param  {Component}  options.component: Component   Componente que se debe renderizar si el usuario está autenticado
 * @param  {object}     options.rest                   Contiene todos los atributos enviados
 * @return {Component}                                 Si el usuario está autenticado retorna el componente enviado
 *                                                     de lo contrario redirecciona a la ruta almacenada en redirect_no_auth
 */
const AuthRoute = ({component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render={
                (props) =>{

                    /* Si esta autenticado abre el componente, sino redirecciona */                    
                    return store.getState().app.userAuth === true
                    ? 
                        rest.userType?
                            (store.getState().app.user.rol === rest.userType?<Component {...props} />:<Redirect to={{pathname: redirect_no_auth, state: {from: props.location}}} />)
                            :<Component {...props} />
                    : <Redirect to={{pathname: redirect_no_auth, state: {from: props.location}}} />
                }
            }
        />
    )
}

/**
 * Crea una ruta admitida solo para usuarios que no están logueados
 * @param  {Component}  options.component: Component   Componente que se debe renderizar si el usuario no está autenticado
 * @param  {object}     options.rest                   Contiene todos los atributos enviados
 * @return {Component}                                 Si el usuario no está autenticado retorna el componente enviado
 *                                                     de lo contrario redirecciona a la ruta almacenada en redirect_auth
 */
const GuestRoute = ({component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render={
                (props) => {
                    /* Si no esta autenticado abre el componente, sino redirecciona */                    
                    return !store.getState().app.userAuth
                    ? <Component {...props} />
                    : <Redirect to={{pathname: redirect_auth, state: {from: props.location}}} />
                }
            }
        />
    )
}

/**
 * Crea una ruta que es admitida para cualquier usuario
 * @param  {Component}  options.component: Component  Componente a renderizar
 * @param  {object}     options.rest       Contiene todos los atributos enviados
 * @return {Component}                     Retorna el componente enviado
 */
const FreeRoute = ({component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render={
                (props) => {
                    return  <Component {...props} />
                }
            }
        />
    )
}

class Routes extends Component 
{
    constructor(props)
    {
        super(props);

        //se almacena el valor del estado de app en el estado local
        //para saber cuando se inicia o cierra sesión y restringir o habilitar el acceso a las rutas
        this.state = {
            app:props.store.getState().app,
        }

        //cuando se inicie o cierre la sesion se actualiza el state local con el store
        props.store.subscribe(() => {
            this.setState((oldState, props) => {
                return {
                    app:props.store.getState().app
                }
            })
        })
    }
    
    render ()
    {
        const { app } = this.state;
        return <BrowserRouter>
            <div>
                <Header/>
                <div style={{ paddingTop: '150px' }}>
                <Switch>
                    <FreeRoute exact path={config_routes.home.path} component={Home} />
                    
                    <FreeRoute exact path={config_routes.testimony.path} component={Testimony} />
                    <FreeRoute exact path={config_routes.conflicto.path} component={Conflicto} />
                    <FreeRoute exact path={config_routes.pandemia.path} component={Pandemia} />
                    <FreeRoute exact path={config_routes.cultura.path} component={Cultura} />
                    <FreeRoute exact path={config_routes.mision.path} component={Mision} />
                    <AuthRoute exact path={config_routes.register_testimony.path} component={RegisterTestimony} />

                    <AuthRoute exact userType="Administrador" path={config_routes.user.path} component={User} />
                    <AuthRoute exact userType="Administrador" path={config_routes.updateUser.path} component={UpdateUser} />
                    <GuestRoute exact path={config_routes.registerUser.path} component={RegisterUser} />
                    <GuestRoute exact path={config_routes.account_activation.path} component={AccountActivation} />

                    <FreeRoute exact path={config_routes.open_data.path} component={OpenData} />
                    <FreeRoute exact path={config_routes.instructivo.path} component={Instructivo}/>

                    
                    <GuestRoute exact path={config_routes.login.path} component={Login} />
                    <GuestRoute exact path={config_routes.password_reset_request.path} component={PasswordResetRequest} />
                    <GuestRoute exact path={config_routes.reset_password.path} component={ResetPassword} />

                    <AuthRoute exact userType="Administrador" path={config_routes.allies.path} component={Allies} />

                    <FreeRoute component={E404} />
                </Switch>
                <Notifications/>
                <RegisterAllies/>
                <FullLoader/>
                </div>
            </div>
            <Footer/>
        </BrowserRouter>;    
    }
}

export default Routes;
