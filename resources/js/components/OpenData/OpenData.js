import React, { Component, PropTypes } from 'react';

import { Responsive, Segment, Header, Container, Message, Grid, Form, Icon, Divider, Button } from 'semantic-ui-react';
import { TableJL1805, StaticSidebar, Btn } from '../Helpers/Helpers';
import params from '../../config/params';
import axios from 'axios';

import { connect } from 'react-redux';
import { actUpdateTableJL1805, actInitTableJL1805, actUpdateOtherParamsTableJL1805 } from '../../redux/tableJL1805/actions';

import Documentation from './Documentation';
import Filter from './Filter';
import {animateScroll} from 'react-scroll';


class OpenData extends Component {
	constructor(props) {
		super(props);

		let headers = [
			{ name: 'titulo', label: 'Testimonio'/*,textAlign:'center',textAlignContent:'center'*/ },
			{ name: 'tipo', label: 'Tipo'/*,textAlign:'center',textAlignContent:'center'*/ },
			{ name: 'categoria', label: 'Categoria'/*,textAlign:'center',textAlignContent:'center'*/ },
			{ name: 'descripcion_detallada', label: 'Descripción detallada', width: 3 },
			{ name: 'fecha_evento', label: 'Fecha' },
			{ name: 'municipio', label: 'Municipio', name_column: ['municipios.nombre'] },
			{ name: 'departamento', label: 'Departamento', name_column: ['departamentos.nombre'] },
			{ name: 'genero', label: 'Genero', no_server: true },
			{ name: 'rango_edad', label: 'Edad' },
			{ name: 'poblacion', label: 'Poblacion', no_server: true },
			{ name: 'nivel_estudio', label: 'Nivel estudio' },
			{ name: 'estado_civil', label: 'Estado civil' },
			{ name: 'situacion_laboral', label: 'Situacion laboral' },
			{ name: 'discapacidad', label: 'Discapacidad' },
			{ name: 'estrato_socioeconomico', label: 'Estrato socioeconomico' },
			{ name: 'convive', label: 'Convive' },
			{ name: 'audio', label: 'Audio', no_server: true },
			{ name: 'video', label: 'Video', no_server: true },
			{ name: 'anexos', label: 'Anexos', no_server: true },
		];

		this.state = {
			configTable: {
				search: false,
				rows_current: 10,
				rows: [10, 20, 50, 100],
				headers: headers,
				data_source: 'server',
				data_source_url: params.URL_API + 'testimony/list/1',
				data: [],
				assignValueCell: (header, row, value) => {
					if (header.name == "municipio") {
						return value.nombre;
					}
					if (header.name == "poblacion") {
						return row.usuario.poblacion;
					}
					if (header.name == "genero") {
						return row.usuario.genero;
					}
					if (header.name == "rango_edad") {
						return row.usuario.rango_edad;
					}
					if (header.name == "nivel_estudio") {
						return row.usuario.nivel_estudio;
					}
					if (header.name == "estado_civil") {
						return row.usuario.estado_civil;
					}
					if (header.name == "situacion_laboral") {
						return row.usuario.situacion_laboral;
					}
					if (header.name == "discapacidad") {
						return row.usuario.discapacidad;
					}
					if (header.name == "estrato_socioeconomico") {
						return row.usuario.estrato_socioeconomico;
					}
					if (header.name == "convive") {
						return row.usuario.convive;
					}
					if (header.name == "departamento") {
						return row.municipio.departamento.nombre;
					}
					if (header.name == "descripcion_detallada") {
						return <div style={{ width: "300px", height: "50px" }} dangerouslySetInnerHTML={{ __html: value }}></div>
					}
					if (header.name == "audio" && value) {
						return <a href={params.URL_API + 'testimony/annexed/' + row.id + "/audio/" + value.id} target="_blank">{value.nombre}</a>;
					}
					if (header.name == "video" && value) {
						return <a href={params.URL_API + 'testimony/annexed/' + row.id + "/video/" + value.id} target="_blank">{value.nombre}</a>;
					}
					if (header.name == "anexos" && value) {
						const items = _.map(value, (el, i) => {
							return <li key={el.id}>
								<Header as="h4">{el.nombre}</Header>
								<p>{el.fecha}</p>
								<p>{el.descripcion}</p>
								<a href={params.URL_API + 'testimony/annexed/' + row.id + "/image/" + el.id} target="_blank">{el.nombre_archivo}</a>
							</li>
						})
						//console.log(value);
						return <ul>
							{items}
						</ul>
					}
					return value;
				},
				//assignRow:assignRow,
				//assignCell:assignCell,
				props: {
					sortable: true,
					selectable: true,
					celled: true,
					fixed: true,
					style: {
						width: "auto"
					}
				},
				otherParams: {
					busqueda: "",
					tipo: "",
					categoria: "",
					municipio: "",
					departamento: "",
					fechaInicio: "",
					fechaFin: "",
					//excepciones:"",
					cantidad: ""
				}

			},
			busqueda: "",
			tipo: "",
			categoria: "",
			municipio: "",
			departamento: "",
			fechaInicio: "",
			fechaFin: "",
			sidebarVisible: false,
			metodoFilter: false,
			modalDocumentacion: 'documentacion',
			modalFilter: 'filter'
		}

		this.handleChangeFilter = this.handleChangeFilter.bind(this);
		this.export = this.export.bind(this);
	}

	componentWillMount() {
		this.props.initTable(this.state.configTable);
	}

	/**
	* Evento para manejar los cambios registrados en lso filtros
	*/
	handleChangeFilter(e, { name, value }) {
		this.setState((oldState) => {
			return {
				[name]: value
			}
		}, () => {
			let otherParams = {
				busqueda: this.state.busqueda,
				tipo: this.state.tipo,
				categoria: this.state.categoria,
				municipio: this.state.municipio,
				departamento: this.state.departamento,
				fechaInicio: this.state.fechaInicio,
				fechaFin: this.state.fechaFin
			};

			this.props.updateOtherParams(otherParams);
		})
	}


	export() {

		const paramsSend = "busqueda=" + this.state.busqueda
			+ "&tipo=" + this.state.tipo
			+ "&categoria=" + this.state.categoria
			+ "&municipio=" + this.state.municipio
			+ "&departamento=" + this.state.departamento
			+ "&fechaInicio=" + this.state.fechaInicio
			+ "&fechaFin=" + this.state.fechaFin

		window.location = params.URL_API + 'testimony/export?' + paramsSend;
	}

	render() {
		const { sidebarVisible, metodoFilter, modalDocumentacion, modalFilter, busqueda } = this.state;
		animateScroll.scrollToTop();
		return (
			<Container>
				<StaticSidebar left visible={sidebarVisible} computer="90%" tablet="60%" mobile="90%" modal={modalDocumentacion}>
					<Segment onClick={() => this.setState({ sidebarVisible: false })} />
					<Btn.Close floated="right" onClick={() => this.setState({ sidebarVisible: false })} />
					<Documentation />
				</StaticSidebar>
				<StaticSidebar left visible={metodoFilter}  mobile="90%" modal={modalFilter}>
					<Segment onClick={() => this.setState({ metodoFilter: false })} />
					<Btn.Close floated="right" onClick={() => this.setState({ metodoFilter: false })} />
					<Filter props={this.props} />
				</StaticSidebar>
				<Message info>
					<Message.Header>Bienvenido al sistema de investigación</Message.Header>
					<p>el modulo de datos abiertos proporciona la opción de promover la investigación de los testimonios y la obtención de estadísticas respecto a la información de los datos almacenados en la 
						plataforma Memoria Oral, que pueden ser consumidos mediante sistema API y exportados 
						en archivo en formato excel, donde desarrolladores, fundaciones, investigadores y entidades 
						privadas sin animo de lucro, pueden utilizar estos datos para crear nuevas aplicaciones, 
						servicios y soluciones que beneficien a la sociedad en áreas como la salud, educación y apoyo psicológico para las victimas.
						</p>
				</Message>

				<Grid>
					<Grid.Column computer={16} tablet={16} mobile={16}>
						<Segment basic>
							<Grid columns={2} style={{ justifyContent: 'flex-end' }}>
								<Grid.Column width={12}>
									<Grid columns={3}>
										<Grid.Column>
											<Button primary onClick={() => {
												this.setState((oldState) => {
													return {
														metodoFilter: !oldState.metodoFilter
													}
												})
											}}>
												<Icon name="filter" />
												<span className='open'>Filtrar</span>
											</Button>
										</Grid.Column>
										<Grid.Column>
											<Button positive onClick={this.export}>
												<Icon name="file excel"/>
												<span className='open'>Exportar</span>
											</Button>
										</Grid.Column>
										<Grid.Column>
											<Button primary onClick={() => {
												this.setState((oldState) => {
													return {
														sidebarVisible: !oldState.sidebarVisible
													}
												})
											}} >
												<Icon name="book" />
												<span className='open'>Documentation</span>
											</Button>
										</Grid.Column>
									</Grid>
								</Grid.Column>

								<Grid.Column width={4}>
										<Grid.Column>
											{/* <Form.Input type='search' value={busqueda} name="busqueda" fluid label="Busqueda" placeholder="Texto para buscar ..." onChange={this.handleChangeFilter}/> */}
											<Form>
												<Form.Input type='search' value={busqueda} name="busqueda" size='small' icon='search' placeholder="Texto para buscar ..." onChange={this.handleChangeFilter} />
											</Form>
										</Grid.Column>
								</Grid.Column>
							</Grid>
							<Divider />
						</Segment>
						<Segment basic className="no-padding" style={{ marginTop: "-50px" }}>
							<TableJL1805 id="table_api" height={400} />
						</Segment>
					</Grid.Column>
				</Grid>
			</Container>
		);
	}
}

const mapStateToProps = (state) => {
	return {

	};
}

const mapDispatchToProps = (dispatch, props) => {
	return {
		updateTable: () => {
			return dispatch(actUpdateTableJL1805("table_api"));
		},
		initTable: (config) => {
			return dispatch(actInitTableJL1805("table_api", config));
		},
		updateOtherParams: (newOtherParams) => {
			return dispatch(actUpdateOtherParamsTableJL1805("table_api", newOtherParams));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenData);
