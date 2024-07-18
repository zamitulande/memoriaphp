import React, { Component, PropTypes } from 'react';

import { Container, Button, Segment, Confirm, Dimmer, Header, Icon, Loader, Modal, Form, Grid, TextArea } from 'semantic-ui-react';
import { actUpdateTableJL1805, actInitTableJL1805 } from '../../redux/tableJL1805/actions';
import { actAddNotification } from '../../redux/notifications/actions';
import {actUpdateAllies} from '../../redux/Allies/actions';
import { TableJL1805 } from '../Helpers/Helpers';
import { animateScroll} from 'react-scroll';
import params from '../../config/params';
import { Btn } from '../Helpers/Helpers';
import { connect } from 'react-redux';
import axios from 'axios';


const options = [
  { key: 'registrado', text: 'Registrado', value: 'Registrado' },
  { key: 'aprobado', text: 'Aprobado', value: 'Aprobado' },
  { key: 'rechazado', text: 'Rechazado', value: 'Rechazado' },
]

class Allies extends Component {
    isMounted = false;

    constructor(props) {
        super(props);        

        let headers = [
            {name:'nombre_organizacion',label:'Nombre de organización'/*,textAlign:'center',textAlignContent:'center'*/},    
            {name:'sitio_web',label:'Sitio Web'},
            {name:'facebook',label:'Facebook'},            
            {name:'correo',label:'Correo electrónico'},
            {name:'telefonos',label:'Teléfonos'},
            {name:'objeto_social',label:'Objeto social'},
            {name:'opciones',label:'Opciones',no_sortable:true, no_server:true, textAlignContent:'center', textAlign:'center'}
        ];     

        this.state = {
            showModalTogglelock:false,
            userToggleLock:null,
            showDimmer:false,
            observaciones:"",
            estado:"",
            messageModalToggleLock:"",
            open:false,
            openBitacora:false,

            formValidations:{
                observaciones:("AlliesId" in this.props)?true:false,
                estado:("AlliesId" in this.props)?true:false
            },
            formErrors:{
                observaciones:[],
                estado:[]
                
            },
            loading:false,
            formIsValid:false,            

            configTable:{
                rows_current:10,
                rows:[10,20,50,100],
                headers:headers,
                data_source:'server',
                data_source_url:params.URL_API+'allies/list',
                data:[],
                assignValueCell:(header, row, value) => {
                    if(header.name == 'opciones'){
                        const btnUpdate = <Btn.UpdateOnlyIcon size="mini" onClick={() => {
                            this.setState({
                                open:true, 
                                itemSelected:row,
                                estado:row.estado
                            })
                        }}/>
                        const btnToggleLock = <Btn.BitacoraIcon size="mini" onClick={() => {
                            this.openModalBitacora(row)
                        }}/>                                                                                

                        return <Segment basic className="no-padding">
                            {btnUpdate}
                            {btnToggleLock}
                        </Segment>  
                    }

                    if (header.name == 'objeto_social') {
                        return <p style={{wordBreak:"Break-all"}}>{value}</p>
                    }
                    if (header.name == 'facebook') {
                        return <a href={value} target="_blank">{value}</a>
                    }
                    if (header.name == 'sitio_web') {
                        return <a href={value} target="_blank">{value}</a>
                    }                    
                    return value;
                },
                //assignRow:assignRow,
                //assignCell:assignCell,
                props:{
                    sortable:true,
                    selectable:true,
                    celled:true,
                    fixed:true,
                }
            },

            itemSelected:{}
        }

        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.setFormIsValid = this.setFormIsValid.bind(this);
        this.onTrueValid = this.onTrueValid.bind(this);       
        this.onFalseValid = this.onFalseValid.bind(this);
        this.handleSubmitFormUpdateAllies = this.handleSubmitFormUpdateAllies.bind(this);       
        this.getConfigTableBitacora = this.getConfigTableBitacora.bind(this);       
        this.initTableBitacora = this.initTableBitacora.bind(this);       
        this.openModalBitacora = this.openModalBitacora.bind(this);       
    }    

    openModalBitacora(item){
        this.setState(() => {
            return {
                openBitacora:true, 
                itemSelected:item
            }
        }, this.initTableBitacora)
    }

    initTableBitacora(){
        this.props.initTableBitacora(this.getConfigTableBitacora());
    }

    getConfigTableBitacora(){
        let headersBitacoras = [
            {name:'observacion',label:'Observaciones'/*,textAlign:'center',textAlignContent:'center'*/},    
            {name:'estado_anterior',label:'Estado anterior'},
            {name:'estado_nuevo',label:'Estado nuevo'},
            
        ];
        return {
                rows_current:0,
                rows:false,//[10,20,50,100],
                search:false,
                pagination:false,
                headers:headersBitacoras,
                data_source:'server',
                data_source_url:params.URL_API+'allies/listBitacoras/'+this.state.itemSelected.id,
                data:[],

                props:{
                    sortable:true,
                    selectable:true,
                    celled:true,
                    fixed:true,
                }
            }
    }

    handleInputChange(e, {name}){
        let value = (e.target.type == 'checkbox')?e.target.checked:e.target.value;
        if(e.target.type == "file"){
            value = e.target.files[0];
        }
        
        this.setState({ [name]:  value});
    }   

    handleSelectChange(e, {name, value}){
        this.setState({ [name]:  value});
    }

    handleFocus(e, {name}){
        this.setState((oldState, props) => {
            return {formErrors: Object.assign({}, oldState.formErrors, {[name]:[]})}
        })
    }

    /*=========================================================
    =            Estado de validaciòn de formulario            =
    =========================================================*/     

    setFormIsValid(){
        setTimeout(() => {
            let isValid = true;
            _.map(this.state.formValidations, (value, key) => {
                if(!value)isValid = false;
            });

            this.setState({
                formIsValid:isValid
            })   

        }, 10)
    }

    onTrueValid({name}){
        this.setState((oldState, props) => {
            return {
                formValidations:Object.assign({},oldState.formValidations,{[name]:true})
            }
        });

        this.setFormIsValid();
    }

    onFalseValid({name}){
        this.setState((oldState, props) => {
            return {
                formValidations:Object.assign({},oldState.formValidations,{[name]:false})
            }
        });

        this.setFormIsValid();
    }  

    handleSubmitFormUpdateAllies(){
        this.setState({loading:true, open:false});
        const data = {
            estado:this.state.estado,
            observaciones:this.state.observaciones
        }
        this.props.sendUpdateAllies(data, this.state.itemSelected.id)
        .then((response) => {
            if(response.status == 200){                             
                this.setState({                 
                    estado:'',
                    observaciones:'',                
                    loading:false,
                    errors:[],
                    formIsValid:false
                })                    
                animateScroll.scrollToTop();
                this.props.updateTable();
                this.props.messageUserState();
            }else{
                let errors = {};
                _.map(response.data.errors, (el, i) => {
                    errors[i] = el;
                });
                this.setState((oldState, props) => {
                    return {
                        formErrors: Object.assign({}, oldState.formErrors, errors),
                        loading:false,
                        success:[]
                    };
                })  

                this.setState({
                })
                animateScroll.scrollToTop();
            }               
        });         
    }       

    componentWillMount() {
        this.props.initTable(this.state.configTable);
    }

    handleCloseModal(value){
        this.setState({
            openBitacora:false,
            open:false,
        })
    } 
   
    handleToggleLock(e,{user, action}){
        this.setState({
            showModalTogglelock:true,
            userToggleLock:Keyboard.removeAllListeners(eventName),
            messageModalToggleLock:<Segment basic><p>¿Está seguro de <strong>{action}</strong> el usuario seleccionado?</p></Segment>
        })
    }   



    render() {
        const {showModalTogglelock, showDimmer, messageModalToggleLock, observaciones, estado, formErrors, itemSelected} = this.state;
        animateScroll.scrollToTop();
        return (
            <Container>
	            <TableJL1805 
	                id='table_1'
	            />
            <Segment basic style={this.state.styles}>
                <Modal open={this.state.open}>  
                    <Header>
                        <Icon name="pencil" />
                        <Header.Content>
                            Actualización de solicitudes de aliados
                        </Header.Content>
                    </Header>

                    <Modal.Content style={{backgroundColor:'#00324D'}}>
                        <Form>
                            <Grid.Column required>
                                <Segment basic className="no-padding margin-bottom-30" style={{marginTop:'-10px'}}>
                                    <Form.Select required name="estado" fluid label="Estado" options={options} value={estado} onChange={this.handleSelectChange} errors={formErrors.estado}/>
                                </Segment>
                            </Grid.Column>                            

                            <Grid.Column>                                             
                                <Form.Field id='observaciones' name='observaciones' value={observaciones} control={TextArea} label='Observaciones' placeholder='Observaciones'
                                     max_length={1000} errors={formErrors.observaciones} onChange={this.handleInputChange} />                                                                   
                            </Grid.Column>                                                                        
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Btn.Cancel onClick={this.handleCloseModal}/> 
                        <Btn.Save onClick={this.handleSubmitFormUpdateAllies}/>
                    </Modal.Actions>
                </Modal>
            </Segment> 

            <Segment basic style={this.state.styles}>
                <Modal open={this.state.openBitacora}>  
                    <Header>
                        <Icon name="list" />
                        <Header.Content>
                            Listado de bitacoras 
                        </Header.Content>
                    </Header>

                    <Modal.Content>
                        <TableJL1805 
                            id='table_bitacora'
                        />
                    </Modal.Content>
                    <Modal.Actions>
                      <Btn.Close onClick={this.handleCloseModal}/>
                    </Modal.Actions>
                </Modal>
            </Segment>                  
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
        messageUserState:() => {
            return dispatch(actAddNotification({message:"El cambio de estado de la solicitud se realizó con éxito", closeIn:6, showButtonClose:true}));
        },
        updateTable:() => {
            return dispatch(actUpdateTableJL1805("table_1"));
        },
        initTable:(config) => {
            return dispatch(actInitTableJL1805("table_1",config));
        },
        initTableBitacora:(config) => {
            return dispatch(actInitTableJL1805("table_bitacora",config));
        },
        sendUpdateAllies:(data, AlliesId) => {
            return dispatch(actUpdateAllies(data, AlliesId));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Allies);
