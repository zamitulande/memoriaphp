import React, { Component } from 'react';

import { Button, Icon } from 'semantic-ui-react';

const Save = (props) => {                        
    return (
        <Button {...props} color='green'><Icon name="save"/> Guardar</Button>
    );
}

const Close = (props) => {
    return (
        <Button {...props}><Icon name="remove"/> Cerrar</Button>
    );
}

const Update = (props) => {
    return (
        <Button {...props}  color='green'><Icon name="pencil alternate"/> Actualizar</Button>
    );
}

const UpdateOnlyIcon = (props) => {
    return (
        <Button {...props}  color='green' icon="pencil alternate"/>
    );
}

const Delete = (props) => {
    return (
        <Button {...props} negative><Icon name="trash alternate"/> Eliminar</Button>
    );
}

const Add = (props) => {
    return (
        <Button {...props} positive><Icon name="plus"/> Agregar</Button>
    );
}

const Accept = (props) => {
    return (
        <Button {...props} positive><Icon name="check"/> Aceptar</Button>
    );
}

const Cancel = (props) => {
    return (
        <Button {...props}><Icon name="remove"/> Cancelar</Button>
    );
}

const Yes = (props) => {
    return (
        <Button {...props} positive><Icon name="check"/> Si</Button>
    );
}

const No = (props) => {
    return (
        <Button {...props}><Icon name="remove"/> No</Button>
    );
}

const Lock = (props) => {
    return (
        <Button {...props} color="orange"><Icon name="lock"/> Bloquear</Button>
    );
}

const Unlock = (props) => {
    return (
        <Button {...props} color="orange"><Icon name="lock open"/> Desbloquear</Button>
    );
}

const LockOnlyIcon = (props) => {
    return (
        <Button {...props} color="orange" icon="lock"/>
    );
}

const UnlockOnlyIcon = (props) => {
    return (
        <Button {...props} color="orange" icon="lock open"/>
    );
}

const BitacoraIcon = (props) => {
    return (
        <Button {...props} positive icon="list"/>
    );
}

const FilesIcon = (props) => {
    return (
        <Button {...props} positive icon="file outline"/>
    );
}

const Send = (props) => {
    return (
        <Button {...props} primary><Icon name="send"/> Enviar</Button>
    );
}

const Next = (props) => {
    return (
        <Button {...props} positive>Siguiente <Icon name="arrow right"/></Button>
    );
}

const Previous = (props) => {
    return (
        <Button {...props}><Icon name="arrow left"/> Anterior</Button>
    );
}

const More = (props) => {
    return (
        <Button {...props} color='green'><Icon size='large' name="play circle"/> Más información</Button>
    );
}

const Return = (props) => {
    return (
        <Button {...props}><Icon name="arrow left"/> Regresar</Button>
    );
}

class Btn extends Component {
    static Save = Save;
    static Close = Close;
    static Update = Update;
    static Delete = Delete;
    static Add = Add;
    static Accept = Accept;
    static Cancel = Cancel;
    static Yes = Yes;
    static No = No;
    static UpdateOnlyIcon = UpdateOnlyIcon;
    static Lock = Lock;
    static Unlock = Unlock;
    static LockOnlyIcon = LockOnlyIcon;
    static UnlockOnlyIcon = UnlockOnlyIcon;
    static Send = Send;
    static Next = Next;
    static Previous = Previous;
    static More = More;
    static Return = Return;
    static BitacoraIcon = BitacoraIcon;
    static FilesIcon = FilesIcon;

    render() {
        return (
          	<Button {...this.props}>
            	{
            		this.props.value?
            			this.props.value:
            			(
            				this.props.children?
            					this.props.children:
            					"Botón"
        				)	
        		}
            </Button>  
        );
    }
}

export default Btn;
