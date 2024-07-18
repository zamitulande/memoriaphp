import React from 'react';

import { Container, Image } from 'semantic-ui-react';
import LogicaTestimomy from './LogicaTestimomy';

const categoriaTestimonioPandemia = [
	{ key: '5', text: 'Todos', value: 'Todos' },
	{ key: '6', text: 'Social', value: 'Social' },
	{ key: '7', text: 'Económico', value: 'Económico' },
	{ key: '8', text: 'Convivencia', value: 'Convivencia' },
	{ key: '9', text: 'Muerte por pandemia', value: 'Muerte por pandemia' },
	{ key: '10', text: 'Secuelas Físicas', value: 'Secuelas Físicas' }
]

class Pandemia extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const pahtPandemia = this.props.location.pathname;
		const backgroundImageStyle = {
			backgroundImage: `url('../images/content/fondos/fondo-pandemia.png')`,
			backgroundSize: 'cover', 
			backgroundRepeat: 'no-repeat', 
		}
		return (
			<Container style={backgroundImageStyle}>
					<h1 style={{paddingTop: "40px", color: "white", fontSize:"50px"}}>Pandemia</h1>
					<LogicaTestimomy categoriaPandemia={categoriaTestimonioPandemia}
								     pahtPandemia={pahtPandemia}
									 goBack={this.props.history.goBack} />
			</Container>
		);
	}
}

export default Pandemia;
