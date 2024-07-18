import React, { Component, PropTypes } from 'react';

import {Tab, Segment, Header, Icon} from 'semantic-ui-react';
import { Gallery } from '../../Helpers/Helpers';

import { getPropertyObject } from '../../Helpers/Helpers';
import params from '../../../config/params';

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

class Template3 extends Component {

    constructor(props) {
        super(props);

        this.setPaneDescription = this.setPaneDescription.bind(this);
        this.setPaneAudio = this.setPaneAudio.bind(this);
        this.setPaneImages = this.setPaneImages.bind(this);
        this.setPaneVideo = this.setPaneVideo.bind(this);
    }

    setPaneDescription(testimony, panes){
        const description = getPropertyObject(testimony,"descripcionDetallada", "descripcion_detallada")?getPropertyObject(testimony,"descripcionDetallada", "descripcion_detallada"):(getPropertyObject(testimony,"descripcionCorta", "descripcion_corta")?getPropertyObject(testimony,"descripcionCorta", "descripcion_corta"):"");

        if(description){
            panes.push({
                menuItem: { key: 'description', icon: 'align left', content: 'Descripción' },
                render: () =><Tab.Pane> 
                            <Segment basic className="justify">
                                <Header as="h3">Descripción del testimonio</Header>
                                <p dangerouslySetInnerHTML={{__html: description}} />
                            </Segment>
                        </Tab.Pane>
            });
        }

        return panes;
    }

    setPaneImages(testimony, panes){
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
            panes.push({
                menuItem: { key: 'gallery', icon: 'images', content: 'Galeria' },
                render: () => <Tab.Pane>
                                <Header as="h3">Galeria del testimonio</Header>
                                <Gallery images={images}/>
                            </Tab.Pane>
            })
        }

        return panes;
    }

    setPaneVideo(testimony, panes){
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
            panes.push({
                menuItem: { key: 'video', icon: 'video', content: 'Video'  },
                render: () => <Tab.Pane>
                                <Header as="h3">Video del testimonio</Header>
                                <video controls width="100%"  controlsList="nodownload">
                                <source src={url} type="video/mp4"/>
                                    Su navegador no tiene soporte para elementos de <code>video</code>.
                                </video>
                            </Tab.Pane>
            })
        }

        return panes;
    }

    setPaneAudio(testimony, panes){
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
            panes.push({
                menuItem: { key: 'audio', icon: 'microphone', content: 'Audio' },
                render: () => <Tab.Pane>
                                <Header as="h3">Audio del testimonio</Header>
                                <audio src={url} controls controlsList="nodownload" style={{width:"100%"}}>
                                    Su navegador no tiene soporte para elementos de <code>audio</code>.
                                </audio>
                            </Tab.Pane>
            })
        }

        return panes;
    }

    render() {
    	const {testimony, user} = this.props;

        let panes = [];

        panes = this.setPaneDescription(testimony, panes);
        panes = this.setPaneImages(testimony, panes);
        panes = this.setPaneAudio(testimony, panes);
        panes = this.setPaneVideo(testimony, panes);

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

                <Tab menu={{ fluid: true, vertical: false, tabular: true }} panes={panes}  />
            </Segment>
        );
    }
}

export default Template3;
