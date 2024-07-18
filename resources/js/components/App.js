import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { CookiesProvider } from 'react-cookie';
import HandleAuthCookie from '../handles/handleAuthCookie';
import Routes from '../routes/routes';
import axios from 'axios';

import { Provider } from 'react-redux';
import store from '../redux/store';
import { actLogout } from '../redux/app/actions';
import { Segment } from 'semantic-ui-react';

export default class App extends Component {
    constructor(props)
    {
        super(props);

        //se interceptan todas las peticiones http realizadas
        axios.interceptors.response.use(function (response) {
            // Do something with response data
            return response;
          }, function (error) {
            //si el error retornado es de un usuario no autorizado
            //se cierra la sesión
            if(error.response && error.response.status == 401)
                store.dispatch(actLogout());
            
            return Promise.reject(error);            
          });
    }

    render() 
    {
        return (
            <Segment style={{ padding: "0px",
            background: `#00324D url('/images/Logo_Blanco.png')`,
            backgroundSize: '1150px 500px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            justifyContent: 'center'}}>
                <Provider store={store}>
                    <CookiesProvider>
                        <HandleAuthCookie store={store}/>
                        <Routes store={store}/>
                    </CookiesProvider>
                </Provider>
            </Segment>
        );
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
