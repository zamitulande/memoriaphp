import React, { Component, PropTypes } from 'react';

import params from '../../../config/params';

import { Grid, Form, Segment, Select, Message, Icon } from 'semantic-ui-react';

import { Valid, SearchServer } from '../../Helpers/Helpers';

import SelectTemplate from './SelectTemplate';
import Annexes from './Annexes';
import Header from '../../Header/Header';

const optionsTypeTestimony = [
	{ key: '0', text: 'Conflicto Armado', value: 'Conflicto Armado' },
	{ key: '1', text: 'Pandemia', value: 'Pandemia' },
	{ key: '2', text: 'Cultura', value: 'Cultura' },
];

const optionsCategoryTestimonyConflicto = [
	{ key: '0', text: 'Secuestro', value: 'Secuestro' },
	{ key: '1', text: 'Atentado', value: 'Atentado' },
	{ key: '2', text: 'Desplazamiento', value: 'Desplazamiento' },
	{ key: '3', text: 'Muerte por Conflicto Armado', value: 'Muerte por Conflicto Armado' },
	{ key: '4', text: 'Desaparición Forzada', value: 'Desaparición Forzada' },
	{ key: '5', text: 'Supervivencia', value: 'Supervivencia' },
];
const optionsCategoryTestimonyPandemia = [
	{ key: '6', text: 'Social', value: 'Social' },
	{ key: '7', text: 'Económico', value: 'Económico' },
	{ key: '8', text: 'Convivencia', value: 'Convivencia' },
	{ key: '9', text: 'Muerte por pandemia', value: 'Muerte por pandemia' },
	{ key: '10', text: 'Secuelas Físicas', value: 'Secuelas Físicas' },
];
const optionsCategoryTestimonyCultura = [
	{ key: '11', text: 'Mitos', value: 'Mitos' },
	{ key: '12', text: 'Leyendas', value: 'Leyendas' },
	{ key: '13', text: 'Saberes Ancestrales', value: 'Saberes Ancestrales' },
	{ key: '14', text: 'Historias', value: 'Historias' },
	{ key: '15', text: 'Otros', value: 'Otros' },
];


class Data extends Component {

	constructor(props) {
		super(props);

		this.state = {
			titulo: "",
			descripcionCorta: "",
			fechaEvento: "",
			municipioTestimonio: null,
			tipoTestimonio: "",
			categoriaTestimonio: "",
			nombreMunicipio: "",

			formValidations: {
				titulo: false,
				descripcionCorta: false,
				fechaEvento: false,
				municipioTestimonio: false,
				tipoTestimonio: false,
				categoriaTestimonio: false,
			},
			formErrors: {
				titulo: [],
				descripcionCorta: [],
				fechaEvento: [],
				municipioTestimonio: [],
				ubicacion: [],
				tipoTestimonio: [],
				categoriaTestimonio: [],
			},
			formIsValid: false,
		};

		this.handleUpdateState = this.handleUpdateState.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.onTrueValid = this.onTrueValid.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.onFalseValid = this.onFalseValid.bind(this);
		this.setFormIsValid = this.setFormIsValid.bind(this);
		this.handleSearchServerSelect = this.handleSearchServerSelect.bind(this);
		this.handleSearchChange = this.handleSearchChange.bind(this);

	}

	componentWillMount() {
		if ("initialData" in this.props && this.props.initialData) {
			const { initialData } = this.props;

			this.setState({
				titulo: initialData.titulo,
				descripcionCorta: initialData.descripcion_corta,
				fechaEvento: initialData.fecha_evento,
				municipioTestimonio: initialData.municipio_id,
				tipoTestimonio: initialData.tipo,
				categoriaTestimonio: initialData.categoria,
				nombreMunicipio: initialData.nombreMunicipio,

				formValidations: {
					titulo: true,
					descripcionCorta: true,
					fechaEvento: true,
					municipioTestimonio: true,
					tipoTestimonio: true,
					categoriaTestimonio: true
				},
				formIsValid: false,
			})

			this.handleUpdateState();
			this.setFormIsValid();
		}
	}

	componentWillReceiveProps(nextProps) {
		if ("resetForm" in nextProps && nextProps.resetForm) {
			this.setState({
				titulo: "",
				descripcionCorta: "",
				fechaEvento: "",
				municipioTestimonio: null,
				tipoTestimonio: "",
				categoriaTestimonio: "",
				nombreMunicipio: "",

				formValidations: {
					titulo: false,
					descripcionCorta: false,
					fechaEvento: false,
					municipioTestimonio: false,
					tipoTestimonio: false,
					categoriaTestimonio: false
				},
				formErrors: {
					titulo: [],
					descripcionCorta: [],
					fechaEvento: [],
					municipioTestimonio: [],
					tipoTestimonio: [],
					categoriaTestimonio: []
				},
				formIsValid: false,
			})
		}

		if ("formErrors" in nextProps) {
			this.setState({
				formErrors: nextProps.formErrors
			})
		}
	}

	/**
	 * Dispara evento de actualización en el componente padre
	 * si se envia la propiedad onUpdate
	 */
	handleUpdateState() {
		setTimeout(() => {
			if ('onUpdate' in this.props) {
				this.props.onUpdate(this.state);
			}
		}, 10);
	}

	handleInputChange(e, { name }, toUpper = false) {
		let value = (e.target.type == 'checkbox') ? e.target.checked : e.target.value;
		const newValue = toUpper ? value.toUpperCase() : value;

		this.setState(
			{
				[name]: newValue,
			},
			() => {
				this.handleUpdateState();
			}
		);
	}

	handleSelectChange(e, { name, value }) {
		this.setState({ [name]: value });
		this.onTrueValid({ name });
		this.handleUpdateState();
	}

	handleFocus(e, { name }) {
		if (this.state.formErrors[name].length) {
			this.setState((oldState, props) => {
				return { formErrors: Object.assign({}, oldState.formErrors, { [name]: [] }) }
			})
			this.handleUpdateState();
		}
	}

	/*=========================================================
	=            Estado de validaciòn de formulario            =
	=========================================================*/

	/**
	 * Determina si los datos del testimonio son correctos o no
	 * y lanza el evento "onFormStateChange" en el padre, si se definió
	 */
	setFormIsValid() {
		setTimeout(() => {
			const lastFormIsValid = this.state.formIsValid;
			let isValid = true;

			_.map(this.state.formValidations, (value, key) => {
				if (!value) isValid = false;
			});

			this.setState({
				formIsValid: isValid
			})


			if ("onFormStateChange" in this.props && lastFormIsValid != isValid) {
				this.props.onFormStateChange(isValid);
			}
		}, 10)
	}

	onTrueValid({ name }) {
		this.setState((oldState, props) => {
			return {
				formValidations: Object.assign({}, oldState.formValidations, { [name]: true })
			}
		});

		this.setFormIsValid();
	}

	onFalseValid({ name }) {
		this.setState((oldState, props) => {
			return {
				formValidations: Object.assign({}, oldState.formValidations, { [name]: false })
			}
		});

		this.setFormIsValid();
	}

	/*=====  Fin de Estado de validaciòn de formulario  ======*/

	handleSearchServerSelect(e, { input, result }) {
		this.setState({ [input.name]: result.key })
		if (input.name == "municipioTestimonio") {
			this.setState({ nombreMunicipio: result.title + " (" + result.description + ")" });
		}
		this.onTrueValid(input);
		this.handleUpdateState();
	}

	handleSearchChange(e, { input, result }) {
		this.setState({ [input.name]: null })
		this.onFalseValid(input);
		this.handleUpdateState();
	}

	render() {
		const {
			titulo,
			descripcionCorta,
			fechaEvento,
			municipioTestimonio,
			tipoTestimonio,
			categoriaTestimonio,
			formIsValid,
			formErrors
		} = this.state;

		let limiteFechaEvento = new Date();
		limiteFechaEvento.setMonth(limiteFechaEvento.getMonth() - 1);

		const yyyy = limiteFechaEvento.getFullYear();
		const mm = (limiteFechaEvento.getMonth() + 1) < 10 ? "0" + (limiteFechaEvento.getMonth() + 1) : (limiteFechaEvento.getMonth() + 1);
		const dd = limiteFechaEvento.getDate() < 10 ? "0" + limiteFechaEvento.getDate() : limiteFechaEvento.getDate();

		limiteFechaEvento = yyyy + "-" + mm + "-" + dd;
		let categoria;
		let question;
		if (tipoTestimonio === 'Conflicto Armado') {
			categoria = optionsCategoryTestimonyConflicto;
			question = 3
		} else if (tipoTestimonio === 'Pandemia') {
			categoria = optionsCategoryTestimonyPandemia;
			question = 2
		} else if (tipoTestimonio === 'Cultura') {
			categoria = optionsCategoryTestimonyCultura;
			question = 1
		}
		let downloadButton;
		if (tipoTestimonio) {
			downloadButton = <a href={`/documemt/${question}`} class="botonDown" download>
				Descargar Preguntas <Icon name='cloud download' size='big' />
			</a>
		}
		let preguntas;
		if(this.props.rol  == 'Usuario'){
			preguntas =<Message positive
							icon='question circle outline'
							header='Preguntas'
							style={{ marginTop: '20px' }}
							content={<Segment basic className="no-padding" >
								<p>Una vez haya seleccionado el tipo de testimonio podrá descargar el archivo en formato PDF para que pueda responder las preguntas respecto
									al testimonio que desea compartir en la plataforma Memoria Oral.</p>
								{downloadButton}
							</Segment>
							}
						/>		
					}
		return (
			<>
				<Grid style={{ backgroundColor: '#00324D' }}>
					<Grid.Column mobile={16} tablet={16} computer={8} className="padding-top-2 margin-top-2">
						<Form.Select
							required
							name="tipoTestimonio"
							fluid
							label="Tipo de testimonio"
							options={optionsTypeTestimony}
							placeholder="Seleccione"
							value={tipoTestimonio}
							onChange={(e, data) => {
								this.handleSelectChange(e, data);
							}
							}
							errors={formErrors.tipoTestimonio}
						/>
					</Grid.Column>

					<Grid.Column mobile={16} tablet={16} computer={8} className="padding-top-2 margin-top-2">
						<Form.Select
							required
							name="categoriaTestimonio"
							fluid
							label="Categoria de testimonio"
							options={categoria}
							placeholder="Seleccione"
							value={categoriaTestimonio}
							onChange={(e, data) => {
								this.handleSelectChange(e, data);
							}
							}
							errors={formErrors.categoriaTestimonio}
						/>
					</Grid.Column>

					<Grid.Column mobile={16} tablet={16} computer={8}>
						<Valid.Input
							type="text"
							name="titulo"
							id="titulo"
							value={titulo}
							label='Titulo'
							onTrueValid={this.onTrueValid}
							onFalseValid={this.onFalseValid}
							onChange={(e) => this.handleInputChange(e, { name: 'titulo' }, true)}
							onFocus={this.handleFocus}
							required
							min_length={6}
							max_length={250}
							errors={formErrors.titulo}
							help="Este titulo debe describir, en pocas palabras, el hecho ocurrido y narrado en el testimonio. Un ejemplo es: 'Una estrategia de supervivencia diferente.'"
						/>
					</Grid.Column>

					<Grid.Column mobile={16} tablet={16} computer={8}>
						<Valid.Input
							type="text"
							name="descripcionCorta"
							id="descripcionCorta"
							value={descripcionCorta}
							label='Descripción corta'
							onTrueValid={this.onTrueValid}
							onFalseValid={this.onFalseValid}
							onChange={this.handleInputChange}
							onFocus={this.handleFocus}
							required
							min_length={50}
							max_length={150}
							errors={formErrors.titulo}
							help="Escriba un resumen muy corto del testimonio que desea registrar o actualizar en el sistema, se necesitan 50 caracteres como mínimo y 150 como máximo."
						/>
					</Grid.Column>

					<Grid.Column mobile={16} tablet={16} computer={8}>
						<Valid.Input
							type="date"
							name="fechaEvento"
							id="fechaEvento"
							value={fechaEvento}
							label='Fecha del evento'
							onTrueValid={this.onTrueValid}
							onFalseValid={this.onFalseValid}
							onChange={this.handleInputChange}
							onFocus={this.handleFocus}
							required
							errors={formErrors.fechaEvento}
							max={limiteFechaEvento}
							help="Seleccione una fecha que se aproxime a la fecha en que iniciaron los hechos que se narran en el testimonio."
						/>
					</Grid.Column>

					<Grid.Column mobile={16} tablet={16} computer={8}>
						<Segment basic style={{ padding: '0px', marginTop: '-10px', marginBottom: '30px' }}>
							<SearchServer required name="municipioTestimonio" label="Municipio"  url={params.URL_API + "query/municipios"} handleResultSelect={this.handleSearchServerSelect} handleSearchChange={this.handleSearchChange} />
						</Segment>
					</Grid.Column>
				</Grid>
				{preguntas}
			</>
		);
	}
}

export default Data;