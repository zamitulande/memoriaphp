import React from 'react';

import { Container, Image } from 'semantic-ui-react';
import LogicaTestimomy from './LogicaTestimomy';

const categoriaTestimonioConflicto = [
	{ key: '0', text: 'Todos', value: 'Todos' },
	{ key: '1', text: 'Secuestro', value: 'Secuestro' },
	{ key: '2', text: 'Atentado', value: 'Atentado' },
	{ key: '3', text: 'Desplazamiento', value: 'Desplazamiento' },
	{ key: '4', text: 'Muerte por Conflicto Armado', value: 'Muerte por Conflicto Armado' },
	{ key: '5', text: 'Desaparición Forzada', value: 'Desaparición Forzada' },
	{ key: '6', text: 'Supervivencia', value: 'Supervivencia' }
]

class Conflicto extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const backgroundImageStyle = {
			backgroundImage: `url('../images/content/fondos/fondo-conflicto.png')`,
			backgroundSize: 'cover', // Puedes ajustar esto según tus necesidades
			backgroundRepeat: 'no-repeat', // Puedes ajustar esto según tus necesidades
		}
		const pahtConflicto = this.props.location.pathname;
		return (
			<Container style={backgroundImageStyle}>
				<h1 style={{paddingTop: "40px", color: "white", fontSize:"50px"}}>Conflicto Armado</h1>
				<LogicaTestimomy categoriaConflicto={categoriaTestimonioConflicto}
					pahtConflicto={pahtConflicto}
					goBack={this.props.history.goBack} />
			</Container>
		);
	}
}

export default Conflicto;
