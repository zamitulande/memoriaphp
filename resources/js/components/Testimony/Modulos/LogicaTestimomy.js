import React, { PropTypes, createRef } from 'react';

import { connect } from 'react-redux';
import { actLoadTestimonies, actSaveBackup, actRestoreBackup } from '../../../redux/testimony/actions';
import { actAddNotification } from '../../../redux/notifications/actions';

import { Segment, Visibility, Sticky, Header, Container, Divider, Grid, Form, Card, Image } from 'semantic-ui-react';
import Detail from '../ContentList/Detail';
import Compact from '../ContentList/Compact';
import UpdateTestimony from '../UpdateTestimony';

import { SearchServer, GeneralMessage, Btn } from '../../Helpers/Helpers';
import params from '../../../config/params';


import { animateScroll } from 'react-scroll';

class LogicaTestimomy extends React.Component {
    contextRef = createRef();
    isMounted = false;
    constructor(props) {
        super(props);

        this.state = {
            texto: "",
            categoria: "Todos",
            estado: "Todos",
            municipio: "",
            fechaInicio: "",
            fechaFin: "",
            tipoVista: "Compacta",
            mostrar: "Todos",
            find: null,//para buscar testimonios individuales (vista detalle)
            findNext: null,//para consultar el testimonio que siguiente al actual
            findPrevious: null,//para consulta el testimonio que antecede al actual
            loading: false,
            responseEmpty: false,//cuando se ha consultado sin tener resultados
            updateWasOpen: false,
            activeSticky: (window.innerWidth < 768) ? false : true
        }

        this.handleChangeFilter = this.handleChangeFilter.bind(this);
        this.loadTestimonies = this.loadTestimonies.bind(this);
        this.handleMore = this.handleMore.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleReturn = this.handleReturn.bind(this);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleUpdateVisibility = this.handleUpdateVisibility.bind(this);

        window.addEventListener("resize", function () {
            if (this.isMounted) {
                if (window.innerWidth < 768 && this.state.activeSticky) {
                    this.setState({
                        activeSticky: false
                    })
                } else if (window.innerWidth >= 768 && !this.state.activeSticky) {
                    this.setState({
                        activeSticky: true
                    })
                }
            }
        })
    }

    componentWillMount() {
        this.isMounted = true;
        //se cargan los testimonios al iniciar el componente
        this.loadTestimonies(false);
    }

    componentWillUnmount() {
        this.isMounted = false;
    }

    /**
     * Funcion encargada de cargar testimonios
     * 
     * @param  {Boolean} reload          Determina si se debe eliminar el contenido actual y agregar solo
     *                                   el resultado obtenido, o si se debe cargar lo actual y lo nuevo
     * @param  {Boolean} noReloadOnEmpty Determina si se debe ejecutar o no el efecto 'reload' cuando no hay resultados
     *                                   se utiliza principalmente para en la vista a detalle se pueda mostrar un mensaje toast cuando
     *                                   no hay resultados, sin quitar el testimonio que està en pantalla
     */
    loadTestimonies(reload = true, noReloadOnEmpty = false, callback = false) {
        this.setState({ loading: true });

        setTimeout(() => {
            this.props.load(this.state, reload, noReloadOnEmpty)
                .then((response) => {
                    //si no se encontraron resultados
                    if (!response.data.length && (noReloadOnEmpty || !reload)) {
                        this.setState({ responseEmpty: true });

                        //pasados unos segundos se establece el responseEmpty en false
                        //para que se pueda seguir cargando con el scroll
                        setTimeout(() => {
                            this.setState({ responseEmpty: false });
                        }, 10000);

                        this.props.addNotification({
                            header: "Sin resultados",
                            message: "No se han encontrado más resultados para mostrar.",
                            showButtonClose: true,
                            closeIn: 4
                        })
                    }
                    this.setState({
                        loading: false
                    });

                    if (typeof callback == "function") {
                        callback();
                    }
                });
        }, 10);

    }

    /**
     * Evento para manejar los cambios registrados en lso filtros
     */
    handleChangeFilter(e, { name, value }) {
        //filtros que hacen que el scroll vaya hasta arriba cuando presentan cambios
        const namesForScrollTop = { tipo: true, categoria: true, municipio: true, tipoVista: true, mostrar: true };

        this.setState((oldState) => {
            return {
                [name]: value,
                find: null,
                findNext: null,
                findPrevious: null,
                responseEmpty: false
            }
        })

        //si se debe hacer scroll hasta arriba
        if (name in namesForScrollTop) {
            animateScroll.scrollToTop();
        }

        this.loadTestimonies();
    }

    /**
     * Manejador del evento de click en el botòn de ver más
     * @param  {[type]} idTestimony identificador del testimonio
     */
    handleMore(idTestimony) {
        animateScroll.scrollToTop();
        //se cambia el modo de vista a detalle y se establece
        //el identificador del testimonio en find para que lo busque en la base de datos
        this.setState({ tipoVista: "Detalle", find: idTestimony });
        //se crea un backup de los datos existentes para poder
        //cerrar la vista a detalle y tener los datos que existian antes de abrirla
        this.props.saveBackup();
        this.loadTestimonies()
    }

    /**
     * Manejador del evento de click en el botòn de actualizar
     * @param  {[type]} idTestimony identificador del testimonio
     */
    handleUpdate(idTestimony) {
        this.setState({ tipoVista: "Actualizar" })
        //se cambia el modo de vista a Actualizar y se establece
        //el identificador del testimonio en find para que lo busque en la base de datos
        //this.setState({find:idTestimony});
        //se crea un backup de los datos existentes para poder
        //cerrar la vista a detalle y tener los datos que existian antes de abrirla
        /*this.props.saveBackup();
        this.loadTestimonies(true, false, () => {
            this.setState({tipoVista:"Actualizar"})
        });*/
    }

    /**
     * Manejador del evento generado al intentar cerrar la vista a detalle
     */
    handleReturn() {
        animateScroll.scrollToTop();
        if (!this.state.updateWasOpen) {
            //se restablecen los datos existentes antes de abrir la vista a detalle
            this.props.restoreBackup();
        }

        //se vuelve a la vista compacta y find se asigna en null para que no se consulte nuevamente
        if (this.state.updateWasOpen) {
            this.setState({ tipoVista: "Compacta", updateWasOpen: false, find: null });
            this.loadTestimonies();
        } else {
            this.setState({ tipoVista: "Compacta", find: null });
        }
    }

    /**
     * Manejador del evento para ver el testimonio anterior en la vista a detalle
     * @param  {[type]} idTestimony identificador del testimoino actual
     * @return {[type]}             [description]
     */
    handlePrevious(idTestimony) {
        //se establece el valor del identificador del testimonio actual
        //en findPrevious para que se busque el testimonio anterior
        this.setState({ findPrevious: idTestimony, findNext: null });
        this.loadTestimonies(true, true);
        animateScroll.scrollToTop();
    }

    /**
     * Manejador del evento para ver el testimonio siguiente en la vista a detalle
     * @param  {[type]} idTestimony identificador del testimoino actual
     * @return {[type]}             [description]
     */
    handleNext(idTestimony) {
        //se establece el valor del identificador del testimonio actual
        //en findNext para que se busque el testimonio posterior al actual
        this.setState({ findNext: idTestimony, findPrevious: null });
        this.loadTestimonies(true, true);
        animateScroll.scrollToTop();
    }

    /**
     * Manejador para controlar cuando el scroll baja y debe 
     * mandarse a buscar nuevos testimonios
     * @param  {[type]} options.calculations Datos calculados para decidir que hacer
     */
    handleUpdateVisibility(e, { calculations }) {
        if (
            !this.state.loading//si no se encuentra en un proceso de carga
            && calculations.bottomVisible//si la parte de abajo de los ultimos testimonios està visible
            && calculations.direction == "down"
            && this.state.tipoVista == "Compacta"
            && !this.state.responseEmpty
        ) {
            this.loadTestimonies(false);
            animateScroll.scrollMore(-50);
        }
    }
    getTipoTestimonio() {
        let testimonyCultura = [];        
        let testimonyPandemia = [];
        let testimonyConflicto = [];
        _.map(this.props.testimonies, (el, i) => {
            switch (el.tipo) {
                case 'Cultura':
                    return testimonyCultura.push(el)
                case 'Pandemia':
                    return testimonyPandemia.push(el)
                case 'Conflicto Armado':
                    return testimonyConflicto.push(el)
            }
        })
        switch (location.pathname) {
            case "/testimony/cultura":
                return testimonyCultura
            case "/testimony/pandemia":
                return testimonyPandemia
            case "/testimony/conflicto":
                return testimonyConflicto
        }
    }
    getCategoria() {
        switch (location.pathname) {
            case "/testimony/cultura":
                return this.props.categoriaCultura
            case "/testimony/pandemia":
                return this.props.categoriaPandemia
            case "/testimony/conflicto":
                return this.props.categoriaConflicto
        }
    }
    render() {
        const {
            categoria,
            tipoVista,
            loading,
            find,
            activeSticky
        } = this.state;
        const {goBack} = this.props
        let contentCompacta = "";
        let contentDetalle = "";
        let content = "";
        let buscar = "";
        let back ="";

        if (this.props.testimonies.length) {
            if (tipoVista == "Compacta") {
                let items = [];

                _.map(this.getTipoTestimonio(), (el, i) => {
                    items.push(<Compact key={i} testimony={el} testimonios={this.getTipoTestimonio()} onClickMore={this.handleMore} onClickUpdate={this.handleUpdate} />)

                });

                contentCompacta = <Card.Group itemsPerRow={2} doubling>
                    {items}
                </Card.Group>
                back = <Btn.Return onClick={() => goBack()} />
                buscar = <Grid.Column mobile={16} tablet={6} computer={5} style={{ marginTop: '12px' }}>
                    <Sticky context={this.contextRef} active={activeSticky}>
                        <Segment>
                            <Header as="h3" className='no-margin'>Metodos de Busqueda</Header>
                            <Divider />
                            <Grid.Column>
                                <Form.Select disabled={find ? true : false} name="categoria" value={categoria} fluid label="Categoria" options={this.getCategoria()} placeholder="Categorias de testimonios" onChange={this.handleChangeFilter} />
                                <SearchServer disabled={find ? true : false} noRenderFails noRenderIcon name="municipio" label="Municipio" url={params.URL_API + "query/municipios"} placeholder="Municipio del testimonio" handleResultSelect={(e, { input, result }) => { this.handleChangeFilter(e, { name: input.name, value: result.key }) }} handleSearchChange={() => { this.setState({ municipio: null }) }} />
                            </Grid.Column>
                        </Segment>
                    </Sticky>
                </Grid.Column>
            } else if (tipoVista == "Detalle") {
                contentDetalle = <Detail
                    testimony={this.props.testimonies[0]}
                    user={this.props.user}
                    handleUpdate={(idTestimony) => {
                        animateScroll.scrollToTop();
                        this.handleUpdate(idTestimony)
                    }}
                    returnable={find ? true : false}
                    showNavigation={find ? false : true}
                    onReturn={this.handleReturn}
                    onPrevious={this.handlePrevious}
                    onNext={this.handleNext}
                />
            } else if (tipoVista == "Actualizar" && this.props.testimonies.length == 1) {
                contentDetalle = <UpdateTestimony
                    testimony={this.props.testimonies[0]}
                    onReturn={() => {
                        animateScroll.scrollToTop();
                        this.setState({ tipoVista: "Detalle" })
                    }}
                    onUpdateTestimony={(dataTestimony) => {
                        this.setState({
                            updateWasOpen: true
                        });

                        this.props.addNotification({
                            header: "Testimonio actualizado",
                            message: "Los cambios realizados han sido registrados con éxito en el sistema.",
                            showButtonClose: true,
                            closeIn: 10
                        })
                        this.handleMore(dataTestimony.id);
                    }}
                />
            }
        } else {
            content = <GeneralMessage
                warning
                icon
                messages={["No se encontraron resultados con los criterios de búsqueda seleccionados."]}
            />;
            buscar = <Grid.Column mobile={16} tablet={6} computer={5} style={{marginTop:'12px'}}>
							<Sticky context={this.contextRef} active={activeSticky}>
							<Segment>
								<Header  as="h3" className='no-margin'>Metodos de Busqueda</Header>
								<Divider/>
								<Grid.Column>
									<Form.Select disabled={find?true:false} name="categoria" value={categoria} fluid label="Categoria" options={this.getCategoria()} placeholder="Categorias de testimonios" onChange={this.handleChangeFilter}/>
									<SearchServer disabled={find?true:false} noRenderFails noRenderIcon name="municipio" label="Municipio" url={params.URL_API+"query/municipios"} placeholder="Municipio del testimonio" handleResultSelect={(e, {input, result}) => { this.handleChangeFilter(e, {name:input.name, value:result.key}) }} handleSearchChange={() => { this.setState({municipio:null}) }}/>
								</Grid.Column>
							</Segment>
							</Sticky>
						</Grid.Column>	
        }
        return (
            <Container style={{ marginTop: '30px'}} >
                {back}
                <div ref={this.contextRef}>
                    <Grid divided>
                        <Grid.Column mobile={16} tablet={10} computer={11}>
                            <Visibility
                                once={false}
                                onUpdate={this.handleUpdateVisibility}
                            >
                                <Segment basic loading={loading} >
                                    {contentCompacta}
                                </Segment>
                            </Visibility>
                        </Grid.Column>
                        {buscar}                        
                    </Grid>
                    {contentDetalle}
                </div>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userType: state.app.user ? state.app.user.rol : false,
        user: state.app.userAuth ? state.app.user : false,
        testimonies: state.testimony.testimonies
    }
}

const mapDispatchToProps = (dispatch, state) => {
    return {
        load: (data, reload, noReloadOnEmpty) => {
            return dispatch(actLoadTestimonies(data, reload, noReloadOnEmpty));
        },
        saveBackup: () => {
            return dispatch(actSaveBackup());
        },
        restoreBackup: () => {
            return dispatch(actRestoreBackup());
        },
        addNotification: (notification) => {
            dispatch(actAddNotification(notification));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogicaTestimomy);
