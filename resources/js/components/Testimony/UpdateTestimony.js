import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import { Container, Header } from 'semantic-ui-react';
import { GeneralMessage, Btn } from '../Helpers/Helpers';
import FormTestimony from './FormTestimony';

class UpdateTestimony extends Component {
    constructor(props) {
        super(props);

        this.handleReturn = this.handleReturn.bind(this);
    }

    handleReturn(){
        if("onReturn" in this.props){
            this.props.onReturn();
        }
    }

    render() {
        return (
        	<Container  style={{marginTop:'30px'}}>
                <Btn.Return onClick={this.handleReturn}/>
                <Header as="h2" dividing className='text-white'>Actualizar testimonio</Header>
        		<FormTestimony
                    testimony={this.props.testimony}
        			onUpdate={(dataTestimony) => {
                            if("onUpdateTestimony" in this.props){
                                this.props.onUpdateTestimony(dataTestimony);
                            }
                        }
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateTestimony);
