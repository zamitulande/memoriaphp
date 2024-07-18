import React from 'react';

import { connect } from 'react-redux';
import { actSearchTableJL1805, actChangeRowsTableJL1805 } from '../../../../redux/tableJL1805/actions';

import { Form, Container, Grid } from 'semantic-ui-react';

const Helpers = ({ config, handleRows, handleSearchChange }) => {

	const { rows, rows_current, search, load_search, search_value } = config;
	let rows_select = '';

	//define que mostrar en la opcion de cantidad de filas
	if (typeof rows == 'object') {
		const values = rows.map(function (el, i) {
			return { key: el, value: el, text: el };
		})

		rows_select = <Form>
			<Form.Select fluid options={values} label="Filas" value={rows_current} onChange={handleRows} />
		</Form>
	}

	//define que mostrar en la opcion de busqueda
	let search_input = search ? <div>
		<Form.Input type='search' fluid icon='search' label="Buscar" placeholder="Buscar ..." size='big' loading={load_search} onChange={handleSearchChange} value={search_value} />
	</div> : '';

	return <Container fluid style={{ padding: "0px" }}>
		<Grid>
			<Grid.Column mobile="16" tablet="16" computer="2">
				{rows_select}
			</Grid.Column>

			<Grid.Column textAlign='right' mobile="16" tablet="16" computer="4" floated="right">
				{search_input}
			</Grid.Column>
		</Grid>
	</Container>
}

const mapStateToProps = (state, { id_table }) => {
	return {
		config: state.tableJl1805.config_tables[id_table]
	};
}

const mapDispatchToProps = (dispatch, props) => {
	return {
		handleRows: (e, { value }) => {
			dispatch(actChangeRowsTableJL1805(props.id_table, value));
		},
		handleSearchChange: (e, { value }) => {
			dispatch(actSearchTableJL1805(props.id_table, value));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Helpers);