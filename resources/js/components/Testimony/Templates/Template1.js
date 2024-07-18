import React, { Component, PropTypes } from 'react';

import { Segment, Header, Icon, Card, Image, Grid, GridColumn, Divider } from 'semantic-ui-react';

import { getPropertyObject } from '../../Helpers/Helpers';
import params from '../../../config/params';

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

class Template1 extends Component {

	constructor(props) {
		super(props);

		this.getAudio = this.getAudio.bind(this);
		this.getImages = this.getImages.bind(this);
		this.getVideo = this.getVideo.bind(this);
	}

	getImages(testimony) {
		let images = "";

		if ("fromServer" in this.props) {
			if ("anexos" in testimony && testimony.anexos.length) {
				images = _.map(testimony.anexos, (el, i) => {
					let date = el.fecha;
					if (date) {
						date = months[parseInt(date.split("-")[1]) - 1]
							+ " " + date.split("-")[2]
							+ " del " + date.split("-")[0];
					}

					return <Card key={i}>
						<Image src={params.URL_API + "testimony/annexed/" + testimony.id + "/image/" + el.id} wrapped ui={false} />
						<Card.Content>
							<Card.Header>{el.nombre}</Card.Header>
							<Card.Meta>
								<span className='date'>{date}</span>
							</Card.Meta>
							<Card.Description>
								{el.descripcion}
							</Card.Description>
						</Card.Content>
					</Card>
				})
			}
		} else {
			if (testimony.annexes && testimony.annexes.length) {
				images = _.map(testimony.annexes, (el, i) => {
					if (testimony.annexesValues["value_" + el.key] || "id" in el) {
						const existsData = ("data_" + el.key in testimony.annexesData) ? true : false;
						const name = existsData ? testimony.annexesData["data_" + el.key].name : "";
						let date = existsData ? testimony.annexesData["data_" + el.key].date : "";
						const description = existsData ? testimony.annexesData["data_" + el.key].description : "";
						if (date) {
							date = months[parseInt(date.split("-")[1]) - 1]
								+ " " + date.split("-")[2]
								+ " del " + date.split("-")[0];
						}

						let url = "";
						if (testimony.annexesValues["value_" + el.key]) {
							url = URL.createObjectURL(testimony.annexesValues["value_" + el.key]);
						} else {
							url = params.URL_API + "testimony/annexed/" + testimony.id + "/image/" + el.id
						}

						return <Card key={i}>
							<Image src={url} wrapped ui={false} />
							<Card.Content>
								<Card.Header>{name}</Card.Header>
								<Card.Meta>
									<span className='date'>{date}</span>
								</Card.Meta>
								<Card.Description>
									{description}
								</Card.Description>
							</Card.Content>
						</Card>

					}
				})
			}
		}

		return images;
	}

	getVideo(testimony) {
		let url = null;

		if ("fromServer" in this.props) {
			if ("video" in testimony && testimony.video)
				url = params.URL_API + "testimony/annexed/" + testimony.id + "/video/" + testimony.video.id;
		} else {
			if (testimony.video) {
				if (testimony.video.constructor.name == "Object") {
					url = params.URL_API + "testimony/annexed/" + testimony.id + "/video/" + testimony.video.id;
				} else {
					url = URL.createObjectURL(testimony.video);
				}
			}
		}

		if (url) {
			return <Segment basic>
				<Header as="h3" className='text-white'>Video del testimonio</Header>
				<video controls width="60%" controlsList="nodownload">
					<source src={url} type="video/mp4" className='text-white' />
					Su navegador no tiene soporte para elementos de <code className='text-white'>video</code>.
				</video>
			</Segment>
		}

		return "";
	}

	getAudio(testimony) {
		let url = null;
		if ("fromServer" in this.props) {
			if ("audio" in testimony && testimony.audio)
				url = params.URL_API + "testimony/annexed/" + testimony.id + "/audio/" + testimony.audio.id;
		} else {
			if (testimony.audio || testimony.audioRecord) {
				if (testimony.audio.constructor.name == "Object") {
					url = params.URL_API + "testimony/annexed/" + testimony.id + "/audio/" + testimony.audio.id;
				} else {
					url = URL.createObjectURL(testimony.audio ? testimony.audio : testimony.audioRecord);
				}
			}
		}

		if (url) {
			return <Segment basic>
				<Header as="h3" className='text-white'>Audio del testimonio</Header>
				<audio src={url} controls controlsList="nodownload" style={{ width: "80%" }}>
					Su navegador no tiene soporte para elementos de <code>audio</code>.
				</audio>
			</Segment>
		}

		return "";
	}

	render() {
		const { testimony, user } = this.props;

		return (
			<Segment basic>
				<Grid textAlign='center' columns={3}>
					<Grid.Column as="h2" className='text-white'>
						{testimony.titulo}
					</Grid.Column>
				</Grid>
				<Divider />
				<Grid columns={4} divided textAlign='center'>
					<Grid.Column className='text-white' >
						<Icon name="calendar alternate outline" /> {getPropertyObject(testimony, "fechaEvento", "fecha_evento")}
					</Grid.Column>
					<Grid.Column className='text-white' >
						<Icon name="map marker alternate" /> {testimony.nombreMunicipio}
					</Grid.Column>
					<Grid.Column className='text-white' >
						<Icon name="align left" /> {getPropertyObject(testimony, "tipoTestimonio", "tipo")}
					</Grid.Column>
					<Grid.Column className='text-white' >
						<Icon name="align left" /> {getPropertyObject(testimony, "categoriaTestimonio", "categoria")}
					</Grid.Column>
				</Grid>
				<Divider/>
				<Grid>
					<Grid.Column>
						<Segment basic textAlign="center" className='text-white'>
							{this.getAudio(testimony)}
							{this.getVideo(testimony)}
						</Segment>
					</Grid.Column>
				</Grid>
				<Grid mobile={16} padded>
					<Grid.Column>
					<Grid.Column>
						<Segment basic className="justify text-white" >
							<p dangerouslySetInnerHTML={{ __html: getPropertyObject(testimony, "descripcionDetallada", "descripcion_detallada") ? getPropertyObject(testimony, "descripcionDetallada", "descripcion_detallada") : (getPropertyObject(testimony, "descripcionCorta", "descripcion_corta") ? getPropertyObject(testimony, "descripcionCorta", "descripcion_corta") : "") }} />
						</Segment>

					</Grid.Column>
					<Grid.Column>
						<Card.Group centered>
							{this.getImages(testimony)}
						</Card.Group>
					</Grid.Column>
					</Grid.Column>
				</Grid>
			</Segment>
		);
	}
}

export default Template1;
