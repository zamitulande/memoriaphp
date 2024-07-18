import React from 'react';

import { connect } from 'react-redux';
import { actChangePageTableJL1805 } from '../../../../redux/tableJL1805/actions';

import { Table, Menu, Icon, Pagination as Pag } from 'semantic-ui-react';

const Pagination = ({config, handleChangePage}) => {
	const {rows_current, current_page, pagination, pagination_config, headers, full_data_length} = config;
	if(pagination){
		//cantidad de paginas que debe tener la tabla
		const pages = Math.ceil(full_data_length/rows_current);

		return <Table.Footer>
					<Table.Row>
						<Table.HeaderCell colSpan={headers.length} textAlign='left'>
							<Pag 
								defaultActivePage={current_page} 
								totalPages={pages} 
								//inverted={props.props.inverted?true:false} 
								onPageChange={handleChangePage}
								/*nextItem='>'
								lastItem='>>'
								firstItem='<<'
								prevItem='<'*/
								/>

						</Table.HeaderCell>
					</Table.Row>
				</Table.Footer>
	}

	return <Table.Footer/>;
}

const mapStateToProps = (state, {id_table}) => {
	return {
		config:state.tableJl1805.config_tables[id_table]
	};
}

const mapDispatchToProps = (dispatch, props) => {
	return {
		handleChangePage:(e, {activePage}) => {
			dispatch(actChangePageTableJL1805(props.id_table, activePage))
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);