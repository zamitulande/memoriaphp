import React from 'react';

import { connect } from 'react-redux';

import { Table } from 'semantic-ui-react';

const Body = ({config}) => {
	const {rows_current, headers, data, assignValueCell, assignRow, assignCell} = config;
	//si existen datos en la variable data
    if(data && data.length){
    	let cont = 0;
	    return data.map((el, i) => {
			let row = (props) => <Table.Row {...props} width={100}>
	    		{
	    			headers.map((elm, ind) => {
	    				let cell = (props) => <Table.Cell {...props} key={elm.name} textAlign={elm.textAlignContent}>{assignValueCell(elm, el, el[elm.name])}</Table.Cell>

	    				return assignCell(elm, el, cell, ind);
	    			})
	    		}
	    	</Table.Row>

	    	return assignRow(el, row, i);
	    });
	}

	//mensaje a mostrar cuando la tabla está vacia
	return <Table.Row>
		<Table.Cell colSpan={headers.length} textAlign='center'>No se encontraron resultados.</Table.Cell>
	</Table.Row>
}

const mapStateToProps = (state, {id_table}) => {
	return {
		config:state.tableJl1805.config_tables[id_table]
	};
}

const mapDispatchToProps = (dispatch, props) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Body);