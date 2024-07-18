import React from 'react';

import { connect } from 'react-redux';
import { actSortTableJL1805 } from '../../../../redux/tableJL1805/actions';

import { Table } from 'semantic-ui-react';

const Headers = ({ config, handleSort, id_table }) => {
	const { sortable, column, direction, headers } = config;

	//se establecen los encabezados de acuerdo a la configuración
	let items_header = headers.map((el, i) => {
		return <Table.HeaderCell 
		sorted={el.no_sortable?null:sortable?(column === el.name ? direction : null):null}
		onClick={el.no_sortable?null:sortable?handleSort(el.name):null}
		key={el.name} 
		textAlign={el.textAlign}
		width={el.width?el.width:1}
		>
			{el.label}
		</Table.HeaderCell>
	})
	
	return <Table.Header>
		      <Table.Row>
					{items_header}	      	
		      </Table.Row>
		    </Table.Header>
}

const mapStateToProps = (state, {id_table}) => {
	return {
		config:state.tableJl1805.config_tables[id_table]
	};
}

const mapDispatchToProps = (dispatch, props) => {
	return {
		handleSort:clicked_column => () => {
			dispatch(actSortTableJL1805(props.id_table, clicked_column))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Headers);