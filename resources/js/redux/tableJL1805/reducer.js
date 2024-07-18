import React from 'react';

import _ from 'lodash';

import types from './const';
import params from '../../config/params';

const init_state = {
    'config_tables':[],
    'config_default':{
            rows:[5, 10, 50, 100],
            rows_current:10,
            current_page:1,//Página actual de la paginación
            search:true,//Muestra o no el buscador
            load_search:false,//Muestra el buscador cargando o no
            search_value:'',
            pagination:true,//Muestra o no la paginacion
            sortable:true,//si contiene columnas ordenables
            column:null,//columna por la cual se está ordenando
            direction:null,//direccion de ordenamiento
            headers:[//datos de prueba
                {name:'first_name',label:'Nombres'},
                {name:'last_name',label:'Apellidos'},
                {name:'age',label:'Edad',no_sortable:true},
                {name:'date',label:'Fecha nacimiento','no_search':true}
            ],
            full_data_length:3,//cantidad total de datos que existen
            data_source:'local',//determina donde se almacena la información
                                //puede ser local o server
            data_source_url:'http:localhost',//Si el item data_source es server
                                            //este item determina donde se encuentra el recurso
            data_aux:[],//datos utilizados para filtrar los items de data y no perder la información
                       //Sólo se utiliza cuando data_source es igual 'local'
            data_readonly:[],//una copia de los datos que se puede ordenar pero no quitar ni agregar items
            data:[//datos de prueba
                {
                    first_name:'A',
                    last_name:'A',
                    age:'25 años',
                    date:'18/05/1993'
                },
                {
                    first_name:'C',
                    last_name:'C',
                    age:'9 años',
                    date:'11/05/2009'
                },
                {
                    first_name:'B',
                    last_name:'B',
                    age:'27 años',
                    date:'23/04/1991'
                }
            ],
            load_table:false,
            //función que se ejecuta cuando se asigna el valor a una celda
            //se utiliza cuando se desea personalizar el valor en una celda
            assignValueCell:(header, row, value) => {
                return value;
            },
            //función que se ejecuta cuando se dibuja cada celda
            //se utiliza cuando se desea personalizar la una celda en especifico
            assignCell:(header, rowData, CellComponent, index) => {
                return <CellComponent key={index}/>;
            },
            //función que se ejecuta cuando se dibuja cada fila
            //se utiliza cuando se desea personalizar la fila completa
            assignRow:(rowData, RowComponent, index) => {
                return <RowComponent key={index}/>;
            },
            props:{},
            otherParams:{},
        }
}

const reducer = (state=init_state, action) => {
    let config_tables = {};
    switch (action.type) {
        //asigna la configuración a una tabla
        case types.SET_CONFIG:
            config_tables = state.config_tables;
            config_tables[action.id_table] = action.config;
            return Object.assign({}, state, {'config_tables':config_tables})
            break;
        //activa el loader del input search de una tabla
        case types.LOAD_SEARCH:
            config_tables = state.config_tables;
            config_tables[action.id_table].load_search = true;
            return Object.assign({}, state, {'config_tables':config_tables})
            break;
        //inactiva el loader del input search de una tabla
        case types.NO_LOAD_SEARCH:
            config_tables = state.config_tables;
            config_tables[action.id_table].load_search = false;
            return Object.assign({}, state, {'config_tables':config_tables})
            break;
        //activa el loader del general de una tabla
        case types.LOAD_TABLE:
            config_tables = state.config_tables;
            config_tables[action.id_table].load_table = true;
            return Object.assign({}, state, {'config_tables':config_tables})
            break;
        //inactiva el loader del general de una tabla
        case types.NO_LOAD_TABLE:
            config_tables = state.config_tables;
            config_tables[action.id_table].load_table = false;
            return Object.assign({}, state, {'config_tables':config_tables})
            break;

        default:
    }

    return state;
}

export default reducer;
