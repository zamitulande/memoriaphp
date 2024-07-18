import types from './const';

import axios from 'axios';
import store from '../store';
import params from '../../config/params';

const delay_callbacks = 300;

/*===============================
=            actions            =
===============================*/

const actInitTableJL1805 = (id_table, config) => {
    return initTable(id_table, config);
}

const actUpdateTableJL1805 = (id_table) => {
    return initTable(id_table, store.getState().tableJl1805.config_tables[id_table]);
}

const actSortTableJL1805 = (id_table, clicked_column) => {
    //showLoadTable(id_table);
    return sortTable(id_table, clicked_column, () => hideLoadTable(id_table));
}

const actSearchTableJL1805 = (id_table, search_value) => {
    //showLoadSearch(id_table);
    return searchTable(id_table, search_value, () => hideLoadSearch(id_table));
}

const actChangeRowsTableJL1805 = (id_table, rows_current) => {
    //showLoadTable(id_table);
    return changeCurrentRows(id_table, rows_current, () => hideLoadTable(id_table));
}

const actChangePageTableJL1805 = (id_table, page) => {
    //showLoadTable(id_table);
    return changePage(id_table, page, () => hideLoadTable(id_table));
}

const actUpdateOtherParamsTableJL1805 = (id_table, newOtherParams) => {
    //showLoadTable(id_table);
    return updateOtherParams(id_table, newOtherParams, () => hideLoadTable(id_table));
}

export { actInitTableJL1805, actUpdateTableJL1805, actSortTableJL1805, actSearchTableJL1805, actChangeRowsTableJL1805, actChangePageTableJL1805, actUpdateOtherParamsTableJL1805 };

/*=====  End of actions  ======*/



/*=============================================
=        Lógica de TableJL1805            =
=============================================*/
    /**
     * Inicializa la configuración de una tabla de acuerdo a lo enviado en la acción
     * @param  {Object} state  estado general de TableJL1805
     * @param  {Object} action Accion con la configuración y el id de la nueva tabla
     * @return {Object}         Nuevo estado
     */
    const initTable = (id_table, config) => {
        const state = store.getState().tableJl1805;

        let new_config = Object.assign({}, state.config_default, config);

        if(new_config.data_source == 'local'){
            new_config.data_aux = new_config.data;
            new_config.data_readonly = new_config.data;
            new_config.full_data_length = new_config.data.length;

            return {
                type:types.SET_CONFIG,
                id_table,
                config:setDataForPage(new_config),
            }
        }else{
            return loadDataServer(id_table, new_config);
        }
    }

    /**
     * Ordena los datos de una tabla de acuerdo a la columna seleccionada y el estado de ordenación actual
     * @param  {String}   id_table       Id de la tabla relacionada
     * @param  {String}   clicked_column Nombre de la columna en la que se hizo click
     * @param  {Function} callback       Función que se llama despues de ordenar la tabla
     * @return {Object}                  Acción a despachar
     */
    const sortTable = (id_table, clicked_column, callback) => {
        const state = store.getState().tableJl1805;
        const config = state.config_tables[id_table];

        if(typeof config != 'undefined'){
            if(config.data_source == 'local'){
                const { column, data_aux, data_readonly, direction } = config
                let new_config = {}
                //si se ordena por una columna diferente a la actual se ordena ascendentemente
                if (column !== clicked_column) {
                    new_config = Object.assign({}, config, {
                        column: clicked_column,
                        data_aux: _.sortBy(data_aux, [clicked_column]),//se ordenan los datos almacenados en data_aux
                        data_readonly: _.sortBy(data_readonly, [clicked_column]),//se ordenan los datos almacenados en data_readonly
                        direction: 'ascending',                                 //con el fin de mantener toda la información en el mismo sentido
                    });
                }else{
                    //si se ordena por la columna actual, sólo se invierte el orden
                    new_config = Object.assign({}, config, {
                        data_aux: data_aux.reverse(),//se ordenan los datos almacenados en data_aux
                        data_readonly: data_readonly.reverse(),//se ordenan los datos almacenados en data_readonly con el fin de mantener toda la información en el mismo sentido
                        direction: direction === 'ascending' ? 'descending' : 'ascending',
                    });
                }

                if(typeof callback == 'function'){
                    setTimeout(() => {
                      callback();
                    }, delay_callbacks)
                }

                return {
                    type:types.SET_CONFIG,
                    id_table,
                    config:setDataForPage(new_config)
                }
            }else{
                let new_config = {}

                const { column, direction } = config

                //si se ordena por una columna diferente a la actual se ordena ascendentemente
                if (column !== clicked_column) {
                    new_config = Object.assign({}, config, {
                        column: clicked_column,
                        direction: 'ascending',                                 
                    });
                }else{
                    //si se ordena por la columna actual, sólo se invierte el orden
                    new_config = Object.assign({}, config, {
                        direction: direction === 'ascending' ? 'descending' : 'ascending',
                    });
                }

                return loadDataServer(id_table, new_config, callback);
            }
        }
    }

    /**
     * Función para filtrar los items de una tabla de acuerdo al valor del campo de busqueda
     * @param  {String}   id_table     Id de la tabla relacionada
     * @param  {String}   search_value Valor del campo search 
     * @param  {Function} callback     Función que se llama despues filtrar las filas
     * @return {Object}                Acción a despachar
     */
    const searchTable = (id_table, search_value, callback) => {
        const state = store.getState().tableJl1805;
        const config = state.config_tables[id_table];
        
        if(config.data_source == 'local'){
            let new_config = {};

            //si la entrada está vacia
            if (search_value.length < 1){
                new_config = Object.assign({}, config, {
                    search_value: search_value,
                    data_aux: config.data_readonly,//se reestablece data_aux con los valores de data_readonly
                    full_data_length:config.data_readonly.length,//se recalcula la cantidad de datos
                    current_page: 1
                });
            }else{
                //expresion regular para evaluar según el valor de la entrada
                const re = new RegExp(_.escapeRegExp(search_value), 'i')

                //función que evalua si una fila coincide con los criterios de busqueda
                const isMatch = result => {
                        let match_row = false;

                        //recorre todos los valores de encabezados
                        config.headers.some((el) => {
                            //si se ha inhabilitado la busqueda por la columna actual
                            if(el.no_search)return false;

                            //hay coincidencia
                            if(re.test(result[el.name])){
                                match_row = true;
                                return true;
                            }
                        })

                        return match_row;
                    }

                //se filtran todos los items de la tabla con la funcion isMatch
                const result = _.filter(config.data_readonly, isMatch);
                new_config = Object.assign({}, config, {
                    search_value: search_value,
                    data_aux: result,//se asignan los valores encontrados
                    full_data_length:result.length,//cantidad de valores actuales
                    current_page: 1
                });
            }

            if(typeof callback == 'function'){
                setTimeout(() => {
                  callback();
                }, delay_callbacks)
            }

            return {
                type:types.SET_CONFIG,
                id_table,
                config:setDataForPage(new_config)//se asiga la configuración de la tabla
                                                 //agregando al item 'data' sólo lo que es visible en pantalla
            }
        }else{
            const new_config = Object.assign({}, config, {
                    search_value: search_value,
                    current_page: 1
                });

            return loadDataServer(id_table, new_config, callback);
        }
    }

    const updateOtherParams = (id_table, otherParams, callback) => {
        const state = store.getState().tableJl1805;
        const config = state.config_tables[id_table];

        const new_config = Object.assign({}, config, {
                otherParams: otherParams,
                current_page: 1
            });

        return loadDataServer(id_table, new_config, callback);
    }

    /**
     * Asigna el número de filas a mostrar y restablece la tabla a la primera página
     * 
     * @param  {String}   id_table     Id de la tabla relacionada
     * @param  {Int}   rows_current    Cantidad de filas a mostrar por página
     * @param  {Function} callback     Función que se llama despues de cambiar el valor de la cantidad de  filas a mostrar
     * @return {Object}                Acción a despachar
     */
    const changeCurrentRows = (id_table, rows_current, callback) => {
        const state = store.getState().tableJl1805;
        const config = state.config_tables[id_table];

        if(typeof config != 'undefined'){
            const new_config = Object.assign({}, config, {rows_current:rows_current, current_page:1});

            if(config.data_source == 'local'){
                if(typeof callback == 'function'){
                    setTimeout(() => {
                      callback();
                    }, delay_callbacks)
                }

                return {
                    type:types.SET_CONFIG,
                    id_table,
                    config:setDataForPage(new_config)//se asiga la configuración de la tabla
                                                    //agregando al item 'data' sólo lo que es visible en pantalla
                }
            }else{
                return loadDataServer(id_table, new_config, callback);
            }
        }
    }

    /**
     * Cambia la pagina actual de la tabla
     * 
     * @param  {String}   id_table Id de la tabla relacionada
     * @param  {Int/String} page   Número de página o acción (next, previous) a realizar
     * @param  {Function} callback Función que se llama después de cambiar la página
     * @return {Objext}            Acción a despachar
     */
    const changePage = (id_table, page, callback) => {
        const state = store.getState().tableJl1805;
        const config = state.config_tables[id_table];

        if(typeof config != 'undefined'){
            let new_config = {};
            if(typeof page == 'number'){
                new_config = Object.assign({}, config, {current_page:page});
            }else{
                //se calcula la cantidad de páginas que tiene la tabla
                const pages = Math.ceil(config.full_data_length/config.rows_current); 

                if(page == 'next'){
                    if(config.current_page < pages)new_config = Object.assign({}, config, {current_page:(config.current_page + 1)});
                    else new_config = config;
                }else if(page == 'previous'){
                    if(config.current_page > 1)new_config = Object.assign({}, config, {current_page:(config.current_page - 1)});
                    else new_config = config;
                }
            }

            if(config.data_source == 'local'){
                if(typeof callback == 'function'){
                    setTimeout(() => {
                      callback();
                    }, delay_callbacks)
                }

                return {
                    type:types.SET_CONFIG,
                    id_table,
                    config:setDataForPage(new_config)
                }
            }else{
                return loadDataServer(id_table, new_config, callback);
            }
        }
    }


    /**
     * se asigna a data sólo lo que será visible en pantalla
     * 
     * @param  {Object} config Configuración de la tabla
     * @return {Object}        Nueva configuración de la tabla
     */
    const setDataForPage = (config) => {
        //divide todos los datos de 'data_aux' en grupos de cantidad igual al número de filas
        //y se selecciona el item de posición igual a la pagina actual menos uno porque el indice inicia en 0
        config.data = _.chunk(config.data_aux, config.rows_current)[config.current_page-1];
        return config;
    }

    /*----------  Lógica para cargar datos desde el servidor  ----------*/

        /**
         * Carga los datos desde el servidor de acuerdo a la configuración
         * 
         * @param  {string}   id_table  Id de la tabla que se va a cargar
         * @param  {Object}   config    Configuración de la tabla
         * @param  {Function} Callback  Función que se ejecuta después de cargar los datos
         * @return {Object}             Acción a despachar
         */
        const loadDataServer = (id_table, config, callback = null) => {
            return dispatch => {
                const state = store.getState().tableJl1805;

                const { data_source_url } = config;
                const config_server = getParamsServer(config);

                return axios.post(data_source_url,{config:config_server, page:config.current_page, ...config.otherParams})
                .then((response) => {
                    const result = response.data;

                    const new_config = Object.assign({}, config, {
                        full_data_length:result.total,//cantidad total de datos que existen
                        data_aux:result.data,
                        data_readonly:result.data,
                        data:result.data,
                    });

                    dispatch({
                        type:types.SET_CONFIG,
                        id_table,
                        config:new_config,
                    });

                    if(typeof callback == 'function'){
                        setTimeout(() => {
                          callback();
                        }, delay_callbacks)
                    }
                    
                })
                .catch((error) => {
                    //console.log(error.response);
                });
            }
        }

        /**
         * Define los parámetros que se envían al servidor
         * 
         * @param  {Object} config Configuración de la tabla
         * @return {Object}        Objeto con los parametros que se envian al servidor
         */
        const getParamsServer = (config) => {
            //almacena los encabezados (permitidos) de la tabla
            //para enviarlos al servidor con el fin de poder filtrar la información
            let headers_server = [];
            let name_columns = {};

            config.headers.map(function(el, i) {
                if(!el.no_server){
                    headers_server.push(el.name);
                    if(el.name_column){
                        name_columns[el.name] = el.name_column;
                    }
                }
            })

            return {
                rows_current:config.rows_current,   
                search_value:config.search_value,
                column:config.column,//columna por la cual se está ordenando
                direction:config.direction == 'ascending'?'asc':(config.direction == 'descending'?'desc':null),//direccion de ordenamiento//desc, asc
                headers:headers_server,
                name_columns
            }           
        }
    
        /*----------  Funciones para mostrar y ocultar loaders  ----------*/
        
        /**
         * Función para activar el estado de cargando en el buscador
         * 
         * @param  {String} id_table Id de la tabla relacionada
         * @return {Function}        Función que despacha la acción para cambiar el estado
         */
        const showLoadSearch = (id_table) => {
            return store.dispatch({
                    type:types.LOAD_SEARCH,
                    id_table
                });
        }

        /**
         * Función para desactivar el estado de cargando en el buscador
         * 
         * @param  {String} id_table Id de la tabla relacionada
         * @return {Function}        Función que despacha la acción para cambiar el estado
         */        
        const hideLoadSearch = (id_table) => {
            return store.dispatch({
                    type:types.NO_LOAD_SEARCH,
                    id_table
                });
        }
        
        /**
         * Función para activar el estado de cargando en la tabla
         * 
         * @param  {String} id_table Id de la tabla relacionada
         * @return {Function}        Función que despacha la acción para cambiar el estado
         */
        const showLoadTable = (id_table) => {
            return store.dispatch({
                    type:types.LOAD_TABLE,
                    id_table
                });
        }
        
        /**
         * Función para desactivar el estado de cargando en la tabla
         * 
         * @param  {String} id_table Id de la tabla relacionada
         * @return {Function}        Función que despacha la acción para cambiar el estado
         */
        const hideLoadTable = (id_table) => {
            return store.dispatch({
                    type:types.NO_LOAD_TABLE,
                    id_table
                });
        }


/*=====  EndLógica de TableJL1805  ======*/