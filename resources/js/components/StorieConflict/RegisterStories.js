import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Container, Header, Grid } from 'semantic-ui-react';
import GeneralMessage from '../Helpers/components/GeneralMessage';
import FormStories from './FormStories';
import { Btn } from '../Helpers/Helpers';

class RegisterStories extends Component {

    constructor(props) {
        super(props);  

        this.state = {
            success:[]
        }
        this.onActionSuccess = this.onActionSuccess.bind(this);
    }

    onActionSuccess(){
        this.setState({
            success:["Se ha registrado una nueva reseña histórica exitosamente."],
        })
    }

    render() {      
        const {success} = this.state;

        return (
            <Container>
                <Grid centered>
                    <Grid.Column mobile={16} tablet={12} computer={10}>
                        <Btn.Return onClick={() => this.props.history.goBack()}/>
                        <Header as="h2" dividing>Registro de reseña histórica</Header>
                        <GeneralMessage success messages={success} onDismiss={()=>this.setState({success:[]})}/>
                        <FormStories action="register" onActionSuccess={this.onActionSuccess}/>
                    </Grid.Column>
                </Grid>                            
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
        sendRegisterUser:(data) => {
            return dispatch(actRegisterUser(data));
        },

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterStories);