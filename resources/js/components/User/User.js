import React, { Component, PropTypes } from 'react';

import { Container, Button, Segment, Confirm, Dimmer, Header, Icon, Loader, Popup, Grid } from 'semantic-ui-react';
import { Btn } from '../Helpers/Helpers';
import axios from 'axios';
import { connect } from 'react-redux';
import { actAddNotification } from '../../redux/notifications/actions';
import { actUpdateTableJL1805, actInitTableJL1805 } from '../../redux/tableJL1805/actions';

import { TableJL1805 } from '../Helpers/Helpers';
import params from '../../config/params';
import {animateScroll} from 'react-scroll';

class User extends Component {
    isMounted = false;

    constructor(props) {
        super(props);

        let headers = [
            { name: 'numero_identificacion', label: 'Número de identificación'/*,textAlign:'center',textAlignContent:'center'*/ },
            { name: 'nombre', label: 'Nombre', name_column: ['nombres', 'apellidos'] },
            { name: 'email', label: 'Correo electrónico' },
            { name: 'telefono', label: 'Teléfono' },
            { name: 'opciones', label: 'Opciones', no_sortable: true, no_server: true, textAlignContent: 'center', textAlign: 'center' }
        ];

        this.state = {
            showModalTogglelock: false,
            userToggleLock: null,
            showDimmer: false,
            messageModalToggleLock: "",
            configTable: {
                rows_current: 10,
                rows: [10, 20, 50, 100],
                headers: headers,
                data_source: 'server',
                data_source_url: params.URL_API + 'user/list',
                data: [],
                assignValueCell: (header, row, value) => {
                    if (header.name == 'opciones') {

                        const btnLinkConsentimientoInformado = (row.consentimiento_informado_id) ? <Segment> <a target="_blank" href={params.URL_API + "user/annexed/" + row.id + "/consentimiento_informado"} size="mini">Autorizaciones</a></Segment> : ""

                        const message = (!btnLinkConsentimientoInformado) ? "No se encontraron anexos relacionados" : ""

                        const btnUpdate = <Btn.UpdateOnlyIcon size="mini" user={row.id} onClick={this.handleClickBtnUpdate} />
                        const btnToggleLock = (row.estado != "Inactivo") ? <Btn.LockOnlyIcon size="mini" action="bloquear" user={row.id} onClick={this.handleToggleLock} /> :
                            <Btn.UnlockOnlyIcon size="mini" action="desbloquear" user={row.id} onClick={this.handleToggleLock} />
                        const btnFiles = <Popup trigger={<Btn.FilesIcon size="mini" user={row.id} />} flowing hoverable>
                            <Grid centered >
                                <Grid.Column textAlign='center'>
                                    <Header as='h4'>Anexos</Header>
                                    {btnLinkConsentimientoInformado}
                                    {message}
                                </Grid.Column>
                            </Grid>
                        </Popup>

                        return <Segment basic className="no-padding">
                            {btnUpdate}
                            {btnToggleLock}
                            {btnFiles}
                        </Segment>
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
                }
            }
        }

        this.handleToggleLock = this.handleToggleLock.bind(this);
        this.handleConfirmToggleLock = this.handleConfirmToggleLock.bind(this);
        this.handleClickBtnUpdate = this.handleClickBtnUpdate.bind(this);
    }

    componentWillMount() {
        this.props.initTable(this.state.configTable);
    }

    handleClickBtnUpdate(e, { user, action }) {
        this.props.history.push("user/update/" + user);
    }

    handleToggleLock(e, { user, action }) {
        this.setState({
            showModalTogglelock: true,
            userToggleLock: user,
            messageModalToggleLock: <Segment basic><p>¿Está seguro de <strong>{action}</strong> el usuario seleccionado?</p></Segment>
        })
    }

    handleConfirmToggleLock() {
        this.setState({
            showModalTogglelock: false,
            showDimmer: true
        });

        axios.post(params.URL_API + "user/toggle-lock", {
            user: this.state.userToggleLock
        })
            .then(
                (response) => {
                    this.setState({
                        showDimmer: false
                    });

                    this.props.messageUserState();
                    this.props.updateTable();
                },
                (error) => {
                }
            );
    }

    render() {
        const { showModalTogglelock, showDimmer, messageModalToggleLock } = this.state;
        animateScroll.scrollToTop();

        return (
            <Container>
                <Segment basic className="no-padding">
                    <TableJL1805 id='table_1' height={400} />
                </Segment>
                <Confirm
                    open={showModalTogglelock}
                    onCancel={() => { this.setState({ showModalTogglelock: false }) }}
                    onConfirm={this.handleConfirmToggleLock}
                    cancelButton="No"
                    confirmButton="Si"
                    content={messageModalToggleLock}
                    size="tiny"
                />

                <Dimmer active={showDimmer} page>
                    <Loader size="large">
                        Cambiando estado del usuario ...
                    </Loader>
                </Dimmer>
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
        messageUserState: () => {
            return dispatch(actAddNotification({ message: "El cambio de estado del usuario se realizó con éxito", closeIn: 6, showButtonClose: true }));
        },
        updateTable: () => {
            return dispatch(actUpdateTableJL1805("table_1"));
        },
        initTable: (config) => {
            return dispatch(actInitTableJL1805("table_1", config));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
