import React, { PropTypes, createRef } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { actLoadTestimonies, actSaveBackup, actRestoreBackup } from '../../redux/testimony/actions';
import { actAddNotification } from '../../redux/notifications/actions';

import { Segment, Container, Modal, Icon, Grid, Message, Button, Header, Divider, } from 'semantic-ui-react';
import config_routes from '../../config/routes';
import Slider from 'react-animated-slider';
import {animateScroll} from 'react-scroll';



class Testimony extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
		};
	}

	setOpen = (value) => {
		this.setState({ open: value });
	}
	render() {
		animateScroll.scrollToTop();
		const { open } = this.state;
		let message = "";

		if (this.props.userType == "Administrador") {
			message = <Segment style={{ backgroundColor:'transparent', textAlign:'center'}}
				content={
					<Modal
						size='tiny'
						centered={false}
						open={open}
						onClose={() => this.setOpen(false)}
						onOpen={() => this.setOpen(true)}
						trigger={
							<Grid.Row style={{ justifyContent: 'space-evenly' }}>
								<Grid.Column >
									<h3 style={{ backgroundColor: "rgba(0,0,0,0.5)", padding:10 }} className='text-white'>Desea que las personas que visitan nuestro sistema de información conozcan su historia?</h3>
									<Button color='green' size='massive' animated style={{ marginTop: '20px' }}>
										<Button.Content visible>Registrar Testimonio </Button.Content>
										<Button.Content hidden>Memoria Oral</Button.Content>
									</Button>
								</Grid.Column>
								<Grid.Column>

								</Grid.Column>
							</Grid.Row>
						}
					>
						<Modal.Header>Recuerde que Usted ha iniciado sesion como Administrador</Modal.Header>
						<Modal.Content >
							<Message>
								<Message.Header>Para registrar un testimonio en el sistema debe tener los datos personales completos de quien da el testimonio.</Message.Header>
								<Divider />
								<span>Los testimonios registrados por usted quedarán públicos automáticamente.</span>
							</Message>
						</Modal.Content>
						<Modal.Actions>
							<Button color='green' onClick={() => this.props.history.push(config_routes.register_testimony.path)}>OK</Button>
						</Modal.Actions>
					</Modal>
				}
			/>

		} else if (this.props.userType == "Usuario") {
			message = <Segment style={{ backgroundColor:'transparent', textAlign:'center'}} content={
					<Modal
						size='mini'
						centered={false}
						open={open}
						onClose={() => this.setOpen(false)}
						onOpen={() => this.setOpen(true)}
						trigger={
							<Grid.Row style={{ justifyContent: 'space-evenly' }}>
								<Grid.Column  >
									<h3 style={{ backgroundColor: "rgba(0,0,0,0.5)", padding:10 }} className='text-white'>Desea que las personas que visitan nuestro sistema de información conozcan su historia?</h3>
									<Button color='green' size='massive' animated style={{ marginTop: '20px' }}>
										<Button.Content visible>Registrar Testimonio </Button.Content>
										<Button.Content hidden>Memoria Oral</Button.Content>
									</Button>
								</Grid.Column>
							</Grid.Row>
							
						}
					>
						<Modal.Content >
							<Message>
								<Message.Header>Una vez su Testimonio sea registrado debe esperar que sea autorizado para ser público en el sistema.</Message.Header>
							</Message>
						</Modal.Content>
						<Modal.Actions>
							<Button color='green' onClick={() => this.props.history.push(config_routes.register_testimony.path)}>OK</Button>
						</Modal.Actions>
					</Modal>

				}
			/>

		}

		return (
			<>
			<div  className='desktop-slider'>
				<Slider autoplay={3000} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
					<div className="slider-content" style={{ background: "url('/images/slide/grafitii.png') no-repeat center center" }}>
					</div>
					<div className="slider-content" style={{ background: "url('/images/slide/iglesia-san-andres.png') no-repeat center center" }}>
					</div>
					<div className="slider-content" style={{ background: "url('/images/slide/avifauna.png') no-repeat center center" }}>
					</div>
					<div className="slider-content" style={{ background: "url('/images/slide/chirimia.png') no-repeat top center" }}>
					</div>
				</Slider>
				</div>
				<Container style={{ marginTop: '-360px' }}>
					
					<Grid columns={2} style={{justifyContent:'space-around', marginTop: 10}}>
						<Grid.Column computer={8} tablet={10} mobile={15} floated="left">
							<Segment textAlign="left" basic style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "20px", fontSize: "4rem" }}>
								<p className='text-white'>Testimonios</p>
								<p className='text-white'>Memoria Oral</p>							
							</Segment>
						</Grid.Column>
						<Grid.Column>
							{message}
						</Grid.Column>
					</Grid>
					
					<Grid stackable columns={3}>
						<Grid.Column >
							<Link to={config_routes.pandemia.path}>
								<div className='animacion imagen1'>
									<div className="ui text">
										<span>Testimonios</span> <h1  style={{  fontWeight:'600'}}>Pandemia</h1>
									</div>
								</div>
							</Link>
						</Grid.Column>
						<Grid.Column >
							<Link to={config_routes.conflicto.path}>
								<div className='animacion imagen2'>
									<div className="ui text" >
										<span>Testimonios</span> <h1 style={{  fontWeight:'600'}}>Conflicto</h1>
									</div>
								</div>
							</Link>
						</Grid.Column>
						<Grid.Column >
							<Link to={config_routes.cultura.path}>
								<div className='animacion imagen3'>
									<div className="ui text">
										<span>Testimonios</span> <h1  style={{  fontWeight:'600'}}>Cultura</h1>
									</div>
								</div>
							</Link>
						</Grid.Column>
					</Grid>
				</Container>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		userType: state.app.user ? state.app.user.rol : false,
		user: state.app.userAuth ? state.app.user : false,
		testimonies: state.testimony.testimonies
	}
}

const mapDispatchToProps = (dispatch, state) => {
	return {
		load: (data, reload, noReloadOnEmpty) => {
			return dispatch(actLoadTestimonies(data, reload, noReloadOnEmpty));
		},
		saveBackup: () => {
			return dispatch(actSaveBackup());
		},
		restoreBackup: () => {
			return dispatch(actRestoreBackup());
		},
		addNotification: (notification) => {
			dispatch(actAddNotification(notification));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Testimony);
