import React, { Component } from "react";
import { Divider, Form, Grid, Header, Icon, Segment, Tab } from "semantic-ui-react";

const tiposTestimonio = [
    { key: '3', text: 'Todos los tipos', value: '' },
    { key: '0', text: 'Conflicto Armado', value: 'Conflicto Armado' },
    { key: '1', text: 'Pandemia', value: 'Pandemia' },
    { key: '2', text: 'Cultura', value: 'Cultura' },
];
const categoriaTestimonio = [
    { key: '16', text: 'Todas las categorias', value: '' },
    { key: '0', text: 'Secuestro', value: 'Secuestro' },
    { key: '1', text: 'Atentado', value: 'Atentado' },
    { key: '2', text: 'Desplazamiento', value: 'Desplazamiento' },
    { key: '3', text: 'Muerte por Conflicto Armado', value: 'Muerte por Conflicto Armado' },
    { key: '4', text: 'Desaparición Forzada', value: 'Desaparición Forzada' },
    { key: '5', text: 'Supervivencia', value: 'Supervivencia' },
    { key: '6', text: 'Social', value: 'Social' },
    { key: '7', text: 'Económico', value: 'Económico' },
    { key: '8', text: 'Convivencia', value: 'Convivencia' },
    { key: '9', text: 'Muerte por pandemia', value: 'Muerte por pandemia' },
    { key: '10', text: 'Secuelas Físicas', value: 'Secuelas Físicas' },
    { key: '11', text: 'Mitos', value: 'Mitos' },
    { key: '12', text: 'Leyendas', value: 'Leyendas' },
    { key: '13', text: 'Saberes Ancestrales', value: 'Saberes Ancestrales' },
    { key: '14', text: 'Historias', value: 'Historias' },
    { key: '15', text: 'Otros', value: 'Otros' },
]


class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otherParams: {
                tipo: "",
                categoria: "",
                municipio: "",
                departamento: "",
                fechaInicio: "",
                fechaFin: "",
                //excepciones:"",
                cantidad: ""
            },
            tipo: "",
            categoria: "",
            municipio: "",
            departamento: "",
            fechaInicio: "",
            fechaFin: "",
        }

        this.handleChangeFilter = this.handleChangeFilter.bind(this);
    }


    handleChangeFilter(e, { name, value }) {
        this.setState((oldState) => {
            return {
                [name]: value
            }
        }, () => {
            let otherParams = {
                tipo: this.state.tipo,
                categoria: this.state.categoria,
                municipio: this.state.municipio,
                departamento: this.state.departamento,
                fechaInicio: this.state.fechaInicio,
                fechaFin: this.state.fechaFin
            };

            this.props.props.updateOtherParams(otherParams);
        })
    }
    panesTestimony({tipo, categoria}){
        const panesTestimony = [
            { menuItem: { content: 'Tipo', icon: 'angle down' }, render: () => <Tab.Pane><Form.Select name="tipo" value={tipo} fluid options={tiposTestimonio} placeholder="Tipo de testimonios" onChange={this.handleChangeFilter} /></Tab.Pane> },
            { menuItem: { content: 'Categoria', icon: 'angle down' }, render: () => <Tab.Pane> <Form.Select name="categoria" value={categoria} fluid options={categoriaTestimonio} placeholder="Categoria de testimonios" onChange={this.handleChangeFilter} /></Tab.Pane> }
        ]
        return panesTestimony
    }
    panesUbicacion({departamento, municipio}){
        const panesTestimony = [
            { menuItem: { content: 'Municipio', icon: 'angle down' }, render: () => <Tab.Pane><Form.Input type='search' value={municipio} name="municipio" fluid placeholder="Escriba el municipio" onChange={this.handleChangeFilter} /></Tab.Pane> },
            { menuItem: { content: 'Departamento', icon: 'angle down' }, render: () => <Tab.Pane> <Form.Input type='search' value={departamento} name="departamento" fluid  placeholder="Escriba el departamento" onChange={this.handleChangeFilter} /></Tab.Pane> }
        ]
        return panesTestimony
    }
    panesFecha({fechaInicio, fechaFin}){
        const panesTestimony = [
            { menuItem: { content: 'Inicio', icon: 'angle down' }, render: () => <Tab.Pane><Form.Input type='date' value={fechaInicio} name="fechaInicio" fluid  onChange={this.handleChangeFilter} /></Tab.Pane> },
            { menuItem: { content: 'Fin', icon: 'angle down' }, render: () => <Tab.Pane> <Form.Input type='date' value={fechaFin} name="fechaFin" fluid  onChange={this.handleChangeFilter} /></Tab.Pane> }
        ]
        return panesTestimony
    }

    render() {       
        const { tipo, categoria, municipio, departamento, fechaInicio, fechaFin } = this.state;
        return (
            <Segment basic className="no-padding" style={{ marginLeft: '20px' }} >
                <Grid computer={4} tablet={7} mobile={16} style={{ marginTop: '60px' }} >
                    <Segment inverted basic className="gradient-green-blue">
                        <Header as="h3">Filtrar por:</Header>
                        <Form inverted>
                            <Divider horizontal inverted >
                                <Header as='h5' inverted>
                                    <Icon name='sitemap' size='mini' />
                                    Testimonios
                                </Header>
                            </Divider>
                            <Tab menu={{ attached: false }} panes={this.panesTestimony(tipo, categoria)} />
                            <Divider horizontal inverted className="padding-top-20">
                                <Header as='h4' inverted>
                                    <Icon name='map marker alternate' />
                                    Ubicación
                                </Header>
                            </Divider>
                            <Tab menu={{ attached: false }} panes={this.panesUbicacion(departamento, municipio)} />
                            <Divider horizontal inverted className="padding-top-20">
                                <Header as='h4' inverted>
                                    <Icon name='calendar alternate outline' />
                                    Fecha
                                </Header>
                            </Divider>
                            <Tab menu={{ attached: false }} panes={this.panesFecha(fechaInicio, fechaFin)} />
                        </Form>
                    </Segment>
                </Grid>
            </Segment>
        )
    }
}
export default Filter;