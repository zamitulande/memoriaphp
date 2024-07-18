import React, { Component } from 'react';

import { connect } from 'react-redux';
import { actChangePassword } from '../../../redux/app/actions';
import { actAddNotification } from '../../../redux/notifications/actions';

import { Modal, Header, Form } from 'semantic-ui-react';
import { Btn, Valid, Toast } from '../../Helpers/Helpers';

class ModalChangePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	password:"",
        	new_password:"",
        	password_confirmation:"",
        	formValidations:{
        		password:false,
	        	new_password:false,
	        	password_confirmation:false,
        	},
        	formErrors:{
                password:[],
                new_password:[]
            },
        	formIsValid:false,
        	loading:false,
        	modalOpen:false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.onTrueValid = this.onTrueValid.bind(this);
        this.onFalseValid = this.onFalseValid.bind(this);
        this.close = this.close.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    handleChange(e,{name}){
    	this.setState({[name]:e.target.value});
    }

    handleFocus(e, {name}){
        this.setState((oldState, props) => {
            return {formErrors: Object.assign({}, oldState.formErrors, {[name]:[]})}
        })
    }

    close(){
    	this.setState({modalOpen:false})
    }

    changePassword(){
    	this.setState({loading:true});
    	this.props.changePassword(this.state)
    	.then((response) => {
    		this.setState({loading:false});
    		if(response.status == 422){
	    		let errors = {};
	            _.map(response.data.errors, (el, i) => {
	                errors[i] = el;
	            });
	            this.setState((oldState, props) => {
	                return {formErrors: Object.assign({}, oldState.formErrors, errors)};
	            })
	        }else{
	        	this.setState({modalOpen:false});
	        	this.props.addNotificationChangePasswordSuccess();
	        }
    	});

    }

    /*=========================================================
    =            Estado de validaciòn de formulario            =
    =========================================================*/    

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

    /*=====  Fin de estado de validaciòn de formulario  ======*/

    render() {
    	const {password, new_password, password_confirmation, loading, formIsValid, formErrors, modalOpen} = this.state;
        return (
			<Modal closeOnDimmerClick={false} closeOnEscape={false} onOpen={()=>this.setState({modalOpen:true})} open={modalOpen} onClose={this.close} size="tiny" centered trigger={this.props.buttonShow} closeIcon>
				<Header icon='unlock alternate' content='Cambio de contraseña' />
				<Modal.Content style={{backgroundColor:'#00324D'}}>
					<Form loading={loading}>
						<Valid.Input
							name="password"
							value={password}
							label="Contraseña antigua"
							type="password"
							onChange={this.handleChange}
							onFocus={this.handleFocus}
							min_length={8}
							max_length={60}
							required
							onTrueValid={this.onTrueValid}
							onFalseValid={this.onFalseValid}
							errors={formErrors.password}
						/>
						<Valid.Input
							name="new_password"
							value={new_password}
							label="Contraseña nueva"
							type="password"
							onChange={this.handleChange}
							onFocus={this.handleFocus}
							min_length={8}
							max_length={60}
							required
							onTrueValid={this.onTrueValid}
							onFalseValid={this.onFalseValid}
							errors={formErrors.new_password}
						/>
						<Valid.Input
							name="password_confirmation"
							value={password_confirmation}
							label="Confirme la contraseña"
							type="password"
							onChange={this.handleChange}
							min_length={8}
							max_length={60}
							required
							onTrueValid={this.onTrueValid}
							onFalseValid={this.onFalseValid}
						/>
					</Form>
				</Modal.Content>

				<Modal.Actions>
					<Btn.Cancel onClick={this.close} disabled={loading}/>
					<Btn.Save disabled={(!formIsValid || loading)} onClick={this.changePassword}/>
				</Modal.Actions>

			</Modal>  
        );
    }
}

const mapStateToProps = (state, props) => {
	return {};
}

const mapDispatchToProps = (dispatch) => {
	return {
		changePassword:(data) => {
			return dispatch(actChangePassword(data));
		},

		addNotificationChangePasswordSuccess:() => {
			const notification = {
	    		header:"Confirmación",
	    		message:"Su contraseña ha sido actualizada con éxito.",
	    		closeIn:7,
	    		showButtonClose:true
	    	}

	    	dispatch(actAddNotification(notification));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalChangePassword);
