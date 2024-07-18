import React, { Component, PropTypes } from 'react';

import {Segment, Header, Icon, Image, Accordion} from 'semantic-ui-react';
import { Gallery } from '../../Helpers/Helpers';

import { getPropertyObject } from '../../Helpers/Helpers';
import params from '../../../config/params';

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

class Template4 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeIndex:0
        };
        this.getDescription = this.getDescription.bind(this);
        this.getAudio = this.getAudio.bind(this);
        this.getImages = this.getImages.bind(this);
        this.getVideo = this.getVideo.bind(this);
    }

    getDescription(testimony){
        const {activeIndex} = this.state;
        const description = getPropertyObject(testimony,"descripcionDetallada", "descripcion_detallada")?getPropertyObject(testimony,"descripcionDetallada", "descripcion_detallada"):(getPropertyObject(testimony,"descripcionCorta", "descripcion_corta")?getPropertyObject(testimony,"descripcionCorta", "descripcion_corta"):"");

        if(description){
            return <Segment basic className="no-padding no-margin">
                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                        <Icon name='dropdown' />
                        Descripción
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <Segment basic className="justify">
                            <p dangerouslySetInnerHTML={{__html: description}} />
                        </Segment>
                    </Accordion.Content>
                </Segment>
        }

        return "";
    }

    getImages(testimony){
        const {activeIndex} = this.state;
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
            return <Segment basic className="no-padding no-margin">
                        <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
                            <Icon name='dropdown' />
                            Galeria
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === 1}>
                                <Gallery images={images}/>
                        </Accordion.Content>
                    </Segment>
        }

        return "";
    }

    getVideo(testimony){
        const {activeIndex} = this.state;
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
            return <Segment basic className="no-padding no-margin">
                    <Accordion.Title active={activeIndex === 3} index={3} onClick={this.handleClick}>
                        <Icon name='dropdown' />
                        Video
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 3}>
                        <Segment basic textAlign="center">
                            <video controls width="60%"  controlsList="nodownload">
                                <source src={url} type="video/mp4"/>
                                    Su navegador no tiene soporte para elementos de <code>video</code>.
                            </video>
                        </Segment>
                    </Accordion.Content>
                </Segment>
        }

        return "";
    }

    getAudio(testimony){
        const {activeIndex} = this.state;
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
            return <Segment basic className="no-padding no-margin">
                    <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
                        <Icon name='dropdown' />
                        Audio
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        <audio src={url} controls controlsList="nodownload" style={{width:"100%"}}>
                          Su navegador no tiene soporte para elementos de <code>audio</code>.
                        </audio>
                    </Accordion.Content>
                </Segment>
        }

        return "";
    }

    handleClick = (e, titleProps) => {
	    const { index } = titleProps
	    const { activeIndex } = this.state
	    const newIndex = activeIndex === index ? -1 : index

	    this.setState({ activeIndex: newIndex })
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

				<Accordion styled fluid>
                    {this.getDescription(testimony)}
                    {this.getImages(testimony)}
                    {this.getAudio(testimony)}
                    {this.getVideo(testimony)}
				</Accordion>
            </Segment>
        );
    }
}

export default Template4;
