import React, {Component} from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import { actLoginCookie } from '../redux/app/actions';
import params from '../config/params';

class HandleAuthCookie extends Component 
{
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props)
    { 
        super(props);

        //si exite cookie de autenticación se cambia valor
        //de los items de estado de sesión en el store
        this.setStoreFromCookie();
    }

    componentDidMount()
    {        
        this.unsubscribe = this.props.store.subscribe(()=>{
            this.setCookieFromStore();
        })
    }

    componentWillUnmount()
    {
        this.unsubscribe();
    }

    /**
     * Controla las cookies de acuerdo al estado del store
     */
    setCookieFromStore()
    {
        //si está logueado se crean las cookies
        if(this.props.store.getState().app.userAuth){
            //si no existen las cookies de estado de autenticación, se crean
            if(!this.props.cookies.get(params.COOKIE_AUTH_STATE)){
                let date_ = new Date();
                if(this.props.store.getState().app.rememberMe){
                    date_.setMinutes(date_.getMinutes() + parseInt(params.COOKIE_AUTH_EXPIRE));
                    this.props.cookies.set(params.COOKIE_AUTH_REMEMBER, true, { path: '/', expires:date_ });
                }else{
                    date_ = null;
                }

                this.props.cookies.set(params.COOKIE_AUTH_STATE, true, { path: '/', expires:date_ });
                this.props.cookies.set(params.COOKIE_AUTH_USER, this.props.store.getState().app.user, { path: '/', expires:date_ });
            }
        }else{
            this.props.cookies.remove(params.COOKIE_AUTH_STATE);
            this.props.cookies.remove(params.COOKIE_AUTH_USER);
            this.props.cookies.remove(params.COOKIE_AUTH_REMEMBER);
        }
    }

    /**
     * controla el store de acuerdo al estado de las cookies
     */
    setStoreFromCookie()
    {
        //Si el usuario está logueado se inicia la sesion en el store
        if(this.props.cookies.get(params.COOKIE_AUTH_STATE)){
            const rememberMe = this.props.cookies.get(params.COOKIE_AUTH_REMEMBER)?true:false;
            this.props.store.dispatch(actLoginCookie(rememberMe, this.props.cookies.get(params.COOKIE_AUTH_USER)));
        }
    }

    render ()
    {
        return this.props.children || '';
    }
}

export default withCookies(HandleAuthCookie);
