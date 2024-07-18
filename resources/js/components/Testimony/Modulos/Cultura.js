import React from 'react';

import { Container, Image } from 'semantic-ui-react';
import LogicaTestimomy from './LogicaTestimomy';

const categoriaTestimonioCultura = [
	{ key: '01', text: 'Todos', value: 'Todos' },
	{ key: '02', text: 'Mitos', value: 'Mitos' },
	{ key: '03', text: 'Leyendas', value: 'Leyendas' },
	{ key: '04', text: 'Saberes Ancestrales', value: 'Saberes Ancestrales' },
	{ key: '05', text: 'Historias', value: 'Historias' },
	{ key: '06', text: 'Otros', value: 'Otros' },
]
class Cultura extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const backgroundImageStyle = {
			backgroundImage: `url('../images/content/fondos/fondo-cultura.png')`,
			backgroundSize: 'cover', // Puedes ajustar esto según tus necesidades
			backgroundRepeat: 'no-repeat', // Puedes ajustar esto según tus necesidades
		}
		const pahtCultura = this.props.location.pathname;
		return (
			<Container style={backgroundImageStyle}>
				<h1 style={{paddingTop: "40px", color: "white", fontSize:"50px"}}>Cultura</h1>
				<LogicaTestimomy categoriaCultura={categoriaTestimonioCultura}
					pahtCultura={pahtCultura}
					goBack={this.props.history.goBack} />
			</Container>
		);
	}
}


export default Cultura;
