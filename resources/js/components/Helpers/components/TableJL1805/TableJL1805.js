import React from 'react';

import _ from 'lodash'

import { connect } from 'react-redux';
import { actInitTableJL1805 } from '../../../../redux/tableJL1805/actions';

import { Table, Segment, Dimmer, Loader, Message } from 'semantic-ui-react'

import Body from './Body';
import Pagination from './Pagination';
import Helpers from './Helpers';
import Headers from './Headers';

import axios from 'axios';

const TableJL1805 = ({ id_table, config, height }) => {
	if (typeof config == 'undefined') {
		//return <p>No se ha encontrado información para configurar de la tabla especificada</p>;
		//console.warn(id_table, "No se ha encontrado información para configurar de la tabla especificada");
		return "";

	} else {
		return (
			<Segment basic>

				<Dimmer active={config.load_table} inverted>
					<Loader>Cargando ...</Loader>
				</Dimmer>

				<Helpers id_table={id_table} />
				<Message success
					size='tiny'
					header='Al dar click sobre el encabezado cada columna, esta tomara un orden ascendente o descendente'
					icon='sort alphabet down' />

				<Segment basic style={{ padding: '0px', overflow: "auto", height: height ? height + "px" : "auto" }}>
					<Table {...config.props} >
						<Headers id_table={id_table} />

						<Table.Body>
							<Body id_table={id_table} />
						</Table.Body>

						<Pagination id_table={id_table} />
					</Table>
				</Segment>
			</Segment>
		)
	}
}

const mapStateToProps = (state, props) => {
	return {
		config: state.tableJl1805.config_tables[props.id],
		id_table: props.id
	}
}

const mapDispatchToProps = (dispatch, props) => {
	return {
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableJL1805);