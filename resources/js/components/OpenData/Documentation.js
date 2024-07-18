import React, { Component, PropTypes } from 'react';

import { Segment, Header } from 'semantic-ui-react';
import params from '../../config/params';

import JSONFormatter from 'json-formatter-js';

const jsonExample = {
        id: 31,
        titulo: "Testimonio de Pepito Perez",
        descripcion_corta: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        descripcion_detallada: "<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>",
        fecha_evento: "2019-08-07",
        tipo: "Secuestros",
        municipio: "TORIBIO",
        departamento: "CAUCA",
        audio: {
            nombre: "GrabaciónAudioTestimonioPepitoPeres.mp3",
            url: params.URL_API+"testimony/annexed/1A/audio/17B"
        },
        video: {
            nombre: "GrabaciónVideoTestimonioPepitoPeres.mp4",
            url: params.URL_API+"testimony/annexed/31A/video/171B"
        },
        anexos: [
            {
                nombre: "Imagen 1",
                descripcion: "Descripción de la imagen 1",
                fecha: "2019-09-04",
                url: params.URL_API+"testimony/annexed/31A/image/162J"
            },
            {
                nombre: "Imagen 2",
                descripcion: "Descripción de la imagen 2",
                fecha: "2019-09-04",
                url: params.URL_API+"testimony/annexed/30A/image/168J"
            }
        ]
    };
const formatter = new JSONFormatter(jsonExample);

class Documentation extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    	setTimeout(() => {
	        document.getElementById("jsonExample").appendChild(formatter.render());
    	}, 1000);
    }

    render() {
        return (
            <Segment basic className="no-padding margin-top-20">
            	<Header as="h3" style={{marginTop:'70px'}}>Documentación de API</Header>
            	<p>
            		El api de testimonios le permitirá acceder, desde otros sistemas,
            		a los testimonios de las víctimas del conflicto armado, de pandemia y cultura que tenemos
            		almacenados.
            	</p>

            	<Header as="h4">¿Cómo utilizar el API?</Header>
            	<p>A continuación, se listan y describen las caracteristicas del API de testimonios a tener en cuenta para utilizar de forma correcta.</p>

            	<Header as="h5">Url de API</Header>
            	<p>{params.URL_API+"testimony/list"}</p>

            	<Header as="h5">Tipo de petición Http</Header>
            	<p>POST</p>
            	<Header as="h5">Parametros de API</Header>
            	<p>
            		A continuación, se listan y describen todos los parametros
            		admitidos por el API. Ningúno de los siguientes parametros es obligatorio, los parametros 
            		que no necesite puede no enviarlos o enviarlos con un valor nulo o vacio.
            	</p>
            	<ul>
            		<li>
            			<strong>busqueda:</strong> (String) Filtro de busqueda por texto. Este parametro filtra los resultados de la consulta,
            			 retornando todos los testimonios donde el texto de busqueda se encuentre en el título, descripción corta, descripción detallada del testimonio.
            		</li>

            		<li>
            			<strong>tipo testimonio:</strong> (Enum) Filtro de busqueda por tipo de testimonio. Este parametro filtra los resultados de la consulta,
            			 retornando todos los testimonios donde el tipo de testimonio sea igual al enviado.
            			 <p>Los valores posibles son:</p>
            			 <ul>
            			 	<li>Conflicto armado</li>
            			 	<li>Pandemia</li>
            			 	<li>Cultura</li>
            			 </ul>
            		</li>

            		<li>
            			<strong>municipio:</strong> (String) Filtro de busqueda por municipio. Este parametro filtra los resultados de la consulta,
            			 retornando todos los testimonios que pertenezcan a municipios cuyo nombre coincida total o parcialmente con el texto enviado.
            		</li>

            		<li>
            			<strong>departamento:</strong> (String) Filtro de busqueda por departamento. Este parametro filtra los resultados de la consulta,
            			 retornando todos los testimonios que pertenezcan a municipios cuyo nombre de departamento coincida total o parcialmente con el texto enviado.
            		</li>

            		<li>
            			<strong>fechaInicio:</strong> (Date) Filtro de busqueda por rango de fecha. Este parametro filtra los resultados de la consulta,
            			 retornando todos los testimonios cuya fecha de evento sea <strong>posterior</strong> a la fecha enviada. Este campo sólo permite fechas anteiores a 
            			 la actual y con formato YYYY/mm/dd o YYYY-mm-dd.
            		</li>

            		<li>
            			<strong>fechaFin:</strong> (Date) Filtro de busqueda por rango de fecha. Este parametro filtra los resultados de la consulta,
            			 retornando todos los testimonios cuya fecha de evento sea <strong>anterior</strong> a la fecha enviada. Este campo sólo permite fechas anteiores a 
            			 la actual y con formato YYYY/mm/dd o YYYY-mm-dd.
            		</li>

            		<li>
            			<strong>excepciones:</strong> (Array) Filtro de busqueda con excepciones. Este parametro filtra los resultados de la consulta,
            			 retornando todos los testimonios cuyo identificador (id) no se encuentre en la lista de excepciones. La lista de excepciones se debe enviar dentro de un array ej: excepciones = [31, 45, 12, 80].
            		</li>

            		<li>
            			<strong>cantidad:</strong> (Integer) Filtro de limite de resultados. Este parametro permite determinar cuantos resultados, como máximo, debe traer el API.
            		</li>
            	</ul>

            	<Header as="h4">Respuesta del API</Header>
            	<p>
            		La consulta del API de testimonios retornará un objeto de tipo JSON en el cual
            		se almacenan los datos completos de cada testimonio encontrado. A continuación, se describe 
            		cada uno de los datos que componen un testimonio. El asterísco que aparece en algunos datos después 
            		del nombre, indica que ese dato es obligatorio en nuestro sistema, por lo cual siempre aparecera con algún valor en
            		los testimonios que sean consultados a través del API.
            	</p>
            	<ul>
            		<li>
            			<strong>id*: </strong>(Integer) Identificador único del testimonio.
            		</li>
            		<li>
            			<strong>titulo*: </strong>(String) Título asignado al testimonio.
            		</li>
            		<li>
            			<strong>tipo*: </strong>(String) Tipo de testimonio. Los testimonios, en nuestro sistema, pueden ser de cualquiera de los siguientes tipos.
            			<ul>
							<li>Conflicto armado</li>
            			 	<li>Pandemia</li>
            			 	<li>Cultura</li>
            			</ul>
            		</li>
            		<li>
            			<strong>descripcion_corta*: </strong>(String) Descripción corta de los hechos del testimonio.
            		</li>
            		<li>
            			<strong>descripcion_detallada: </strong>(HTML) Relato del testimonio en formato HTML.
            		</li>
            		<li>
            			<strong>fecha_evento*: </strong>(String) Fecha apróximada en que ocurrieron los hechos del testimonio.
            		</li>
            		<li>
            			<strong>municipio*: </strong>(String) Nombre del municipio donde ocurrieron los hechos del testimonio.
            		</li>
            		<li>
            			<strong>departamento*: </strong>(String) Nombre del departamento al cual pertenece el municipio donde ocurrieron los hechos del testimonio.
            		</li>
            		<li>
            			<strong>audio: </strong>(Object) Objeto JSON que contiene el nombre y la url del audio grabado para relatar los hechos del testimonio.
            		</li>
            		<li>
            			<strong>video: </strong>(Object) Objeto JSON que contiene el nombre y la url del video grabado para relatar los hechos del testimonio.
            		</li>
            		<li>
            			<strong>anexos: </strong>(Object) Objeto JSON que contiene el nombre, la fecha, la descripción y la url de cada uno de los anexos del testimonio.
            		</li>
            	</ul>

            	<Header as="h5">Ejemplo de respuesta</Header>
            	<div id="jsonExample" style={{overflowX:"auto"}}></div>
            </Segment>
        );
    }
}

export default Documentation;
