import React, { Component, PropTypes } from 'react';

import {Segment, Header, Icon, Divider, Embed, Button, Modal} from 'semantic-ui-react';
import { getPropertyObject } from '../../Helpers/Helpers';
import params from '../../../config/params';

import { Gallery } from '../../Helpers/Helpers';

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

class Template2 extends Component {

    constructor(props) {
        super(props);

        this.getAudio = this.getAudio.bind(this);
        this.getImages = this.getImages.bind(this);
        this.getVideo = this.getVideo.bind(this);
    }

    getImages(testimony){
    	let images = [];

    	if("fromServer" in this.props){
    		if("anexos" in testimony && testimony.anexos.length){
    			_.map(testimony.anexos, (el, i) => {
    				let date = el.fecha;
    				if(date){
	    				date = months[parseInt(date.split("-")[1])-1]
	    					+" "+date.split("-")[2]
	    					+" del "+date.split("-")[0];
	    			}

    				images.push({
    					url:params.URL_API+"testimony/annexed/"+testimony.id+"/image/"+el.id,
    					title:el.nombre,
                        date:date,
    					description:el.descripcion
    				});
	    		})
    		}
    	}else{
	    	if(testimony.annexes && testimony.annexes.length){
	    		_.map(testimony.annexes, (el, i) => {
	    			if(testimony.annexesValues["value_"+el.key] || "id" in el){
	    				const existsData = ("data_"+el.key in testimony.annexesData)?true:false;
	    				const name = existsData?testimony.annexesData["data_"+el.key].name:"";
	    				let date = existsData?testimony.annexesData["data_"+el.key].date:"";
	    				const description = existsData?testimony.annexesData["data_"+el.key].description:"";
	    				if(date){
		    				date = months[parseInt(date.split("-")[1])-1]
		    					+" "+date.split("-")[2]
		    					+" del "+date.split("-")[0];
		    			}

		    			let url = "";
                        if(testimony.annexesValues["value_"+el.key]){
                            url = URL.createObjectURL(testimony.annexesValues["value_"+el.key]);
                        }else{
                            url = params.URL_API+"testimony/annexed/"+testimony.id+"/image/"+el.id
                        }

	    				images.push({
	    					url,
	    					title:name,
	                        date:date,
	    					description:description
	    				});
	    			}
	    		})	    		
	    	}
	    }

	    if(images.length){
			return <Modal basic size='small' trigger={<Button color="blue" icon='images' size="large"/>}>
				<Header icon='images' content='Galeria de imagenes del testimonio' />
				<Modal.Content>
					 <Gallery images={images} inverted/>
				</Modal.Content>
			</Modal>
		}

	    return "";
    }

    getVideo(testimony){
    	let url = null;

    	if("fromServer" in this.props){
    		if("video" in testimony && testimony.video)
    			url = params.URL_API+"testimony/annexed/"+testimony.id+"/video/"+testimony.video.id;
    	}else{
	    	if(testimony.video){
	    		if(testimony.video.constructor.name == "Object"){
                    url = params.URL_API+"testimony/annexed/"+testimony.id+"/video/"+testimony.video.id;
                }else{
                    url = URL.createObjectURL(testimony.video);
                }
	    	}
	    }

    	if(url){
    		return <Modal basic size='small' trigger={<Button color="blue" icon='video' size="large"/>}>
				<Header icon='video' content='Video del testimonio'/>
				<Modal.Content>
					<video controls width="100%"  controlsList="nodownload">
						<source src={url} type="video/mp4"/>
							Su navegador no tiene soporte para elementos de <code>video</code>.
					</video>
				</Modal.Content>
			</Modal>
    	}

    	return "";
    }

    getAudio(testimony){
    	let url = null;
    	if("fromServer" in this.props){
    		if("audio" in testimony && testimony.audio)
    			url = params.URL_API+"testimony/annexed/"+testimony.id+"/audio/"+testimony.audio.id;
    	}else{
	    	if(testimony.audio || testimony.audioRecord){
	    		if(testimony.audio.constructor.name == "Object"){
                    url = params.URL_API+"testimony/annexed/"+testimony.id+"/audio/"+testimony.audio.id;
                }else{
                    url = URL.createObjectURL(testimony.audio?testimony.audio:testimony.audioRecord);
                }
	    	}
	    }

	    if(url){
	    	return <Modal basic size='small' trigger={<Button color="blue" icon='microphone' size="large"/>}>
				<Header icon='microphone' content='Audio del testimonio' />
				<Modal.Content>
					<audio src={url} controls controlsList="nodownload" style={{width:"100%"}}>
					  Su navegador no tiene soporte para elementos de <code>audio</code>.
					</audio>			
				</Modal.Content>
			</Modal>
	    }

	    return "";
    }

    render() {
    	const {testimony, user} = this.props;
    	
        return (
            <Segment basic>
            	<Segment basic>
	            	<Header as="h2" dividing className='text-white'>
	            		{testimony.titulo}
	            		<Header.Subheader className='text-white'>
	            			<Icon name="calendar alternate outline"/> {getPropertyObject(testimony, "fechaEvento", "fecha_evento")}
	            		</Header.Subheader>
	            		<Header.Subheader className='text-white'>
	            			<Icon name="map marker alternate"/> {testimony.nombreMunicipio}
	            		</Header.Subheader>
	            		<Header.Subheader className='text-white'>
	            			<Icon name="align left"/> {getPropertyObject(testimony, "tipoTestimonio", "tipo")}
	            		</Header.Subheader>
	            	</Header>
            	</Segment>

				<Segment basic className="justify text-white">
					<p dangerouslySetInnerHTML={{__html: getPropertyObject(testimony,"descripcionDetallada", "descripcion_detallada")?getPropertyObject(testimony,"descripcionDetallada", "descripcion_detallada"):(getPropertyObject(testimony,"descripcionCorta", "descripcion_corta")?getPropertyObject(testimony,"descripcionCorta", "descripcion_corta"):"")}} />
				</Segment>

				<Divider/>

				<Segment basic textAlign="center">
					{this.getImages(testimony)}		
					{this.getAudio(testimony)}		
					{this.getVideo(testimony)}		
				</Segment>
            </Segment>
        );
    }
}

export default Template2;
