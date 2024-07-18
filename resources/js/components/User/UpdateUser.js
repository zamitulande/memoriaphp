import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Container, Header } from 'semantic-ui-react';
import GeneralMessage from '../Helpers/components/GeneralMessage';
import FormUser from './FormUser';
import { Btn } from '../Helpers/Helpers';

class UpdateUser extends Component {

    constructor(props) {
        super(props);  

        this.state = {
        	success:[]
        }
        this.onActionSuccess = this.onActionSuccess.bind(this);
    }
    onActionSuccess(){
    	this.setState({
    		success:["Usuario actualizado con éxito."],
    	})
    }

    render() {    	
        /*const user=('user' in this.props)?this.props.user:false;*/
    	const {success} = this.state;

        return (
        	<Container  style={{marginTop:'30px'}}>
                <Btn.Return onClick={() => this.props.history.goBack()}/>
                <Header as="h2" dividing className='text-white'>Actualización de usuarios</Header>
        		<GeneralMessage success messages={success} onDismiss={()=>this.setState({success:[]})}/>
	        	<FormUser action="update" onActionSuccess={this.onActionSuccess} userId={this.props.match.params.id}/>
            </Container>
        );
    }
}

const mapStateToProps = (state, props) => {
	return {
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		sendUtdateUser:(data) => {
			return dispatch(actUpdateUser(data));
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUser);