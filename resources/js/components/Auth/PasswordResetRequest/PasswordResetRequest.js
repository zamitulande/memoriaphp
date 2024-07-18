import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { actSendPassResetRequest } from '../../../redux/app/actions';

import { Grid, Form, Button, Icon, Segment } from 'semantic-ui-react';
import { GeneralMessage, Valid, Recaptcha_ } from '../../Helpers/Helpers';

class PasswordResetRequest extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			identificationNumber:'',
			formValidations:{
				identificationNumber:false
			},
			formIsValid:false,
			recaptchaIsValid:false,
			loadingForm:false,
            success:[],
            errors:[],	
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmitForm = this.handleSubmitForm.bind(this);
		this.onFalseValid = this.onFalseValid.bind(this);
		this.onTrueValid = this.onTrueValid.bind(this);
	}

	/*==========================================================
	=            Estado de validaciòn de formulario            =
	==========================================================*/
	
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
	
	/*=====  Fin de Estado de validaciòn de formulario  ======*/

	
	/*==============================================
	=            Manejadores de eventos            =
	==============================================*/	

    handleInputChange(e, {name, value}){
    	this.setState({[name]:  value});
    }

    handleSubmitForm(){
    	this.setState({loadingForm:true});
    	this.props.sendPasswordResetRequest(this.state.identificationNumber)
    	.then((response) => {
    		if(response.status == 200){
    			this.setState({
    				identificationNumber:"",
					loadingForm:false,
					success:["Ha sido enviado un correo electrónico para restablecer la contraseña."],
					errors:[],
					formIsValid:false
				})	
    		}else{
	    		this.setState({
	    			loadingForm:false,
	    			errors:response.data.error,
	    			success:[]
	    		})
	    	}
    	});
    }

	/*=====  Fin de Manejadores de eventos  ======*/

	render(){
		const {identificationNumber, formIsValid, recaptchaIsValid, loadingForm} = this.state;
		return (
			<Grid centered style={{paddingTop: '40px'}}>
				<Grid.Column computer={5} tablet={10} mobile={14}>
					<Form loading={loadingForm}>
						<Valid.Input 
							id="identificationNumber" 
							name="identificationNumber" 
							value={identificationNumber} 
							label="Número de identificación" 
							type="text"
							onChange={this.handleInputChange}
							onTrueValid={this.onTrueValid}
							onFalseValid={this.onFalseValid}
							noRenderFails
							required
							numericPositive
							min_length={6}
							max_length={10}
						/>

						<Grid centered className="margin-bottom-20">
							<Segment compact>
								<Recaptcha_ 
					                onChange={(value) => this.setState({recaptchaIsValid:value?true:false})}
					            />
				            </Segment>
				        </Grid>

						<GeneralMessage error messages={this.state.errors} onDismiss={()=>this.setState({errors:[]})}/>
						<GeneralMessage success messages={this.state.success} onDismiss={()=>this.setState({success:[]})}/>

						<Button disabled={!formIsValid || !recaptchaIsValid} primary animated fluid onClick={this.handleSubmitForm}>
							<Button.Content visible>Enviar</Button.Content>
							<Button.Content hidden>
								<Icon name='send' />
							</Button.Content>
						</Button>
					</Form>
				</Grid.Column>
			</Grid>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
	}
}

const mapDispatchToProps = (dispatch, {history}) => {
	return {
		sendPasswordResetRequest:(identificationNumber) => {
			return dispatch(actSendPassResetRequest(identificationNumber))
		}
	}  
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetRequest);
