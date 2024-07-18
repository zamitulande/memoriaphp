import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import { Container, Header } from 'semantic-ui-react';
import GeneralMessage from '../Helpers/components/GeneralMessage';
import FormTestimony from './FormTestimony';

class RegisterTestimony extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	success:[]
        }
    }

    render() {
        const {success} = this.state;
		if(success.length){
			setTimeout(()=>{
				this.setState({success:[]})
			},7000)
		}

        const messageSuccess = this.props.userType == "Administrador"?
        	"El testimonio ha sido registrado exitosamente en el sistema, a partir de este momento será público y cualquier persona puede visualizarlo. La cuenta de usuario creada podrá ser activada ingresando al correo electrónico registrado.":
        	"Su testimonio ha sido registrado con éxito en el sistema, actualmente sólo puede ser visualizado por usted y los administradores de la plataforma, quienes se encargarán de verificar la información suministrada y habilitar el testimonio para que sea visualizado públicamente. Gracias por contar su historia!!";

        return (
        	<Container  style={{paddingTop:'20px'}}>
				<h2 style={{color:'white'}}>Registro de testimonio</h2>
        		<GeneralMessage success messages={success} onDismiss={()=>this.setState({success:[]})}/>
        		<FormTestimony
        			onRegister={() => this.setState({
        				success:[messageSuccess]
        			})}
        		/>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
	return {
		userType:state.app.user.rol
	}
}

const mapDispatchToProps = (dispatch) => {
	return {

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterTestimony);
