import React from 'react';
import { connect } from 'react-redux';

import { Grid, Icon, Header, Divider, Button, Image } from 'semantic-ui-react';

const E404 = ({history}) => {
        //<Image src="/images/404.jpg"/>
    return (
		<Grid verticalAlign='middle' columns={1} centered>
			<Grid.Row>
				<Grid.Column textAlign="center">
					<Header as="h1" style={{fontSize:"10rem"}} color="orange">404</Header>
					<Header as="h3">Elemento no localizado</Header>
					<Grid centered>
						<Grid.Column computer={5} tablet={10} mobile={14}>
							<p style={{textAlign:"center"}}>El elemento o la página que está buscando no se ha logrado localizar, esto puede ocurrir porque nunca existió en el sistema o porque el nombre del recurso ha sido editado.</p>
						</Grid.Column>
					</Grid>
				</Grid.Column>
			</Grid.Row>
		</Grid>
    );
}

const mapStateToProps = (state, props) => {
	return {
        history:props.history
	};
}

const mapDispatchToProps = (dispatch, props) => {
	return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(E404);
