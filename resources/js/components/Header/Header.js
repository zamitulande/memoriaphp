import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { Grid, Button, Menu, Segment, Header as H, Icon, Image, Dropdown, Divider, Responsive, Label } from 'semantic-ui-react'
import ModalChangeComponent from '../Auth/ModalChangePassword/ModalChangePassword';

import routes from '../../config/routes';
import config_routes from '../../config/routes';
import { actChangeActiveItem } from '../../redux/header/actions';

import { actLogout } from '../../redux/app/actions';

class Header extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			showMenuMobile: false,
			showMenuAuthMovile: false
		};

		this.toggleMenuMobile = this.toggleMenuMobile.bind(this);
		this.toggleMenuAuthMobile = this.toggleMenuAuthMobile.bind(this);
	}

	toggleMenuMobile() {
		this.setState((oldState, props) => ({ showMenuMobile: !oldState.showMenuMobile }))
		this.state.showMenuAuthMovile = false;
	}

	toggleMenuAuthMobile() {
		this.setState((oldState, props) => ({ showMenuAuthMovile: !oldState.showMenuAuthMovile }))
		this.state.showMenuMobile = false;
	}

	render() {
		const { activeItem, handleItemClick, history, logout, userAuth, user } = this.props;


		/*======================================
		=            Items del menú            =
		======================================*/

		const logo = <div key={0} className="desktop-only-logo">
			<Menu.Item style={{ textAlign: 'center'}}>
				<Image src="/images/icono.ico" size="tiny" style={{ display: 'inline-block' }} />
			</Menu.Item>
		</div>

		const icono = <Segment textAlign='center' style={{ padding: '0px' }}>
						<Image src="/images/icono.ico" size="tiny" style={{ margin: '0 auto'}}/>
					</Segment>
		const optionHome = <Menu.Item
			icon='home'
			key={1}
			content={routes.home.name}
			item={routes.home.item}
			path={routes.home.path}
			active={activeItem === routes.home.item}
			onClick={(e, data) => {
				handleItemClick(e, data);
				this.toggleMenuMobile()
			}}
		/>

		const optionMision = <Menu.Item
			icon='users'
			key={2}
			content={routes.mision.name}
			item={routes.mision.item}
			path={routes.mision.path}
			active={activeItem === routes.mision.item}
			onClick={(e, data) => {
				handleItemClick(e, data);
				this.toggleMenuMobile()
			}}
		/>

		const optionTestimony = <Menu.Item
			icon='microphone'
			key={3}
			name={routes.testimony.name}
			item={routes.testimony.item}
			path={routes.testimony.path}
			active={activeItem === routes.testimony.item}
			onClick={(e, data) => {
				handleItemClick(e, data);
				this.toggleMenuMobile()
			}}
		/>

		//Si es administrador debe mostrar la opcion de usuarios
		const optionUsers = userAuth ? (
			user.rol == 'Administrador' ?
				<Menu.Item
					icon='user circle'
					key={5}
					name={routes.user.name}
					item={routes.user.item}
					path={routes.user.path}
					active={activeItem === routes.user.item}
					onClick={(e, data) => {
						handleItemClick(e, data);
						this.toggleMenuMobile()
					}}
				/>
				: ""
		) : "";

		//Si es administrador debe mostrar la opcion de allies
		const optionAllies = userAuth ? (
			user.rol == 'Administrador' ?
				<Menu.Item
					icon='handshake outline'
					key={8}
					name={routes.allies.name}
					item={routes.allies.item}
					path={routes.allies.path}
					active={activeItem === routes.allies.item}
					onClick={(e, data) => {
						handleItemClick(e, data);
						this.toggleMenuMobile()
					}}
				/>
				: ""
		) : "";

		const optionOpenData = <Menu.Item
			icon='settings'
			key={6}
			name={routes.open_data.name}
			item={routes.open_data.item}
			path={routes.open_data.path}
			active={activeItem === routes.open_data.item}
			onClick={(e, data) => {
				handleItemClick(e, data);
				this.toggleMenuMobile()
			}}
		/>

		const optionInstructivo = <Menu.Item
			icon='question circle outline'
			key={9}
			name={routes.instructivo.name}
			item={routes.instructivo.item}
			path={routes.instructivo.path}
			active={activeItem === routes.instructivo.item}
			onClick={(e, data) => {
				handleItemClick(e, data);
				this.toggleMenuMobile()
			}}
		/>

		const buttonShowChangePassword = <ModalChangeComponent buttonShow={<Dropdown.Item>Cambiar contraseña</Dropdown.Item>} />

		const userText = userAuth ?
			<H as="h5" textAlign="right" className="no-margin">
				 <Label color='green'>{user.nombres + ' ' + user.apellidos}</Label>
				<H.Subheader>
					 {user.rol}
				</H.Subheader>
			</H> : "";
		//Muestra botón para navegar a ingreso o opciones de usuario si esta logueado
		//<Dropdown.Item>Perfil</Dropdown.Item>
		const optionAuth = userAuth ?
			<Menu.Menu position="right" key={7}>
				<Dropdown item trigger={userText}>
					<Dropdown.Menu>
						{buttonShowChangePassword}
						<Divider />
						<Link to={config_routes.home.path}>
							<Dropdown.Item onClick={logout}>Salir</Dropdown.Item>
						</Link>
					</Dropdown.Menu>
				</Dropdown>
			</Menu.Menu> :
			<Menu.Menu position="right" key={9}>
				<Menu.Item style={{padding:1}} >
					<Link to={config_routes.login.path}>
						<Button color='green' onClick={this.toggleMenuAuthMobile}>Ingresar</Button>
					</Link>
					<Divider />
					</Menu.Item>
					<Menu.Item style={{padding:0}}>
					<Link to={config_routes.registerUser.path} onClick={this.toggleMenuAuthMobile}>
						<Button color='green'>Registrarse</Button>
					</Link>
				</Menu.Item>
			</Menu.Menu>
		/*=====  Fin de Items del menú  ======*/

		const optionsMenu = [
			optionHome,
			optionMision,
			optionTestimony,
			optionUsers,
			optionAllies,
			optionOpenData,
			optionInstructivo
		];

		return (
			<Segment className='navbar_header'>
				<Grid columns={3} textAlign='center' style={{ marginTop: '5px'}}>
					<Grid.Column only="mobile tablet" style={{ padding:0}}>
						<Segment>
							<Button icon="sidebar" size='tiny' primary onClick={this.toggleMenuMobile} />
						</Segment>
						{
							this.state.showMenuMobile ?
								<Grid.Column>
									<Menu stackable vertical fluid={true} style={{ paddingTop: '1px' }}>
										{optionsMenu}
									</Menu>
								</Grid.Column> : ""
						}
					</Grid.Column>
					<Grid.Column only="mobile tablet" style={{ paddingTop: '5px' }}>
						{icono}
					</Grid.Column>
					<Grid.Column only="mobile tablet" style={{ padding: '0px' }}>
						<Segment >
							<Button icon="user" size='small' primary onClick={this.toggleMenuAuthMobile} />
						</Segment>
						{
							this.state.showMenuAuthMovile ?
								<Grid.Column>
									<Menu stackable  fluid={true} style={{ paddingTop: '1px' }}>
										{optionAuth}
									</Menu>
								</Grid.Column> : ""
						}
					</Grid.Column>
					
					
				</Grid>

				<Grid columns={3} style={{alignItems: 'center', paddingTop:'0px'}} >
					<Grid.Column width={2}>
						{logo}
					</Grid.Column>
					<Grid.Column only="computer" width={11} style={{padding:'0px 0px 15px 0px'}}>					
						<Menu tabular style={{marginTop:'0px'}} >
							{optionsMenu}
						</Menu>
					</Grid.Column>
					<Grid.Column only="computer" width={3}>
						<Menu secondary stackable>
							{optionAuth}
						</Menu>
					</Grid.Column>
				</Grid>
			</Segment>
		)
	}
}

const mapStateToProps = (state, props) => {
	let activeItem = null;

	//determina el item activo segun la url
	_.forIn(routes, (value, key) => {
		if (value.path == props.history.location.pathname) {
			activeItem = value.item;
		}
	})

	return {
		activeItem,
		history: props.history,
		userAuth: state.app.userAuth,
		user: state.app.user
	}
}

const mapDispatchToProps = (dispatch, { history }) => {
	return {
		//manejador de click de los items del menú
		handleItemClick: (e, { path, item }) => {
			dispatch(actChangeActiveItem(item));
			history.push(path);
		},
		logout: () => (dispatch(actLogout(true)))
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
