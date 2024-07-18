import React, { Component, PropTypes } from 'react';

import { Link } from 'react-router-dom';
import routes from '../../config/routes';

import { Segment, Grid, Header, Container, Image, Icon, Divider } from 'semantic-ui-react';

class Footer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
    	let year = new Date();
    	year = year.getFullYear();
        return (
            <Segment className="no-padding  margin-top-50 no-border-radius" style={{backgroundColor:'transparent'}}>
            	<Container className="padding-top-30 padding-bottom-20">
	            	<Grid>
	            		<Grid.Column mobile={16} tablet={8} computer={7}>
	            			<Image src="/images/logo_txt_blanco.png" size="small"/>
	            			<p className="margin-top-10 text-white">
	            				Sistema para la recuperación de la memoria oral de las víctimas del conflicto armado, Pandemia y Cultura en Colombia.
	            			</p>
	            		</Grid.Column>

	            		<Grid.Column mobile={16} tablet={8} computer={5}>
	            			<Header as="h3" inverted>Contácto</Header>
	            			<p className='text-white'><Icon name="mail"/>comerciocauca@misena.edu.co</p>
	            			<p className='text-white'><Icon name="mobile alternate"/>+57 (2) 8205108 – 8205903 - Ext. 22408 - 22029</p>
	            			<p className='text-white'><Icon name="map marker alternate"/>Calle 4 #2-80 - Popayán (Cauca)</p>
	            		</Grid.Column>

	            		<Grid.Column mobile={16} tablet={8} computer={4}>
	            			<Header as="h3" inverted>Navegación</Header>
	            			<div><Link to={routes.home.path}>Página principal</Link></div>
	            			<div><Link to={routes.testimony.path}>Testimonios</Link></div>
							{
								//<div><Link to={routes.investigation_request.path}>Solicitudes de investigación</Link></div>
							}
	            			<div><Link to={routes.open_data.path}>Datos abiertos</Link></div>
							<div><Link to={routes.mision.path}>Misión y visión</Link></div>
	            		</Grid.Column>	            		
	            	</Grid>

	            	<Divider horizontal inverted className="margin-top-50 margin-bottom-50">
	            		Nuestros Aliados
	            	</Divider>

            		<Grid centered divided verticalAlign='middle' inverted>
            			<Grid.Column textAlign="center" mobile={6} tablet={3} computer={2}>
            				<a href="http://www.sena.edu.co/es-co/Paginas/default.aspx" target="_blank">
            					<Image src="/images/aliados/sena.png" centered className="margin-bottom-20"/>
            				</a>
            			</Grid.Column>
            			<Grid.Column textAlign="center" mobile={12} tablet={6} computer={5}>
            				<a href="http://sennova.senaedu.edu.co/" target="_blank">
            					<Image src="/images/aliados/sennova.png" centered className="margin-bottom-20"/>
            				</a>
            			</Grid.Column>
            		</Grid>
            	</Container>
            	<Segment inverted textAlign="center" className="no-border-radius light-blue darken-4">
            		&copy; Copyright {year}, Sena
            	</Segment>
            </Segment>
        );
    }
}

export default Footer;


/*<Grid.Column mobile={16} tablet={8} computer={3}>
	            			<Header as="h3" inverted>Apoya</Header>
	            			<div>
	            				<a href="http://www.sena.edu.co/es-co/Paginas/default.aspx" target="_blank">
	            					SENA
	            				</a>
            				</div>
	            			<div>
	            				<a href="http://40.70.207.114/" target="_blank">
	            					Sennova
	            				</a>
            				</div>
	            			<div>
	            				<a href="http://www.accioncontraminas.gov.co/accion/desminado/Paginas/Resena-Polus-Center.aspx" target="_blank">
	            					Polus Colombia
	            				</a>
            				</div>
	            		</Grid.Column>*/