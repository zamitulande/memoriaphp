import React, { Component } from 'react';

import { connect } from 'react-redux';
import store from '../../redux/store';

import { Header, Container, Segment, Grid, Button, Card, Icon, Image, Divider, GridRow } from 'semantic-ui-react';
import { animateScroll } from 'react-scroll';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {

  }

  render() {
    animateScroll.scrollToTop();
    return (
      <>
        <div style={{ marginTop: '-40px' }} className='image-desktop'>
          <Image src="images/content/chiva-p.png" fluid />
        </div>
        <div style={{ marginTop: '-40px' }} className='image-movil'>
          <Image src="images/content/chiva-movi.jpeg" fluid />
        </div>
        <Container style={{ paddingTop: '10px' }} className="gradient-content-1-">
          <Grid verticalAlign='middle' centered>
            <Grid.Column computer={8} tablet={10} mobile={16}>
              <Grid.Row columns={2}>
                <Grid.Column >
                  <Header as="h2" className='text-white' style={{ borderBottom: 'solid #21ba45 6px' }}>
                    ¿Cómo podemos recuperar y preservar la cultura en nuestra sociedad?
                  </Header>
                  <Header.Content className='text-white' as='p'>
                    En Colombia tenemos una cultura enriquecedora y más en el departamento del Cauca,
                    la plataforma tecnológica Memoria Oral, se busca la recuperación y preservación de
                    la cultura en las memorias sobre costumbres, prácticas y saberes ancestrales
                    relacionados con la naturaleza, los cultivos de fique, caña de azúcar,
                    plantas medicinales, fabricación de velas artesanales entre otros. También
                    sobre el poblamiento y la ocupación de los territorios y las diferentes
                    actividades como el ecoturismo, avistamiento de aves, además de otros saberes
                    unidos con la cotidianidad de sus actividades diarias, como la culinaria
                    tradicional, y otros aspectos de sus vivencias de vida.
                  </Header.Content >
                </Grid.Column>

              </Grid.Row>
            </Grid.Column>
            <Grid.Column computer={8} tablet={6} mobile={16}>
              <Image src="images/mapa-cauca.png" />
            </Grid.Column>
          </Grid>
          <Grid className="" verticalAlign='middle' centered style={{ marginTop: "70px" }}>
            <Grid.Column computer={10} tablet={10} mobile={16}>
              <Header as="h2" className='text-white' style={{ borderBottom: 'solid #21ba45 6px' }}>
                Génesis fenómeno armado en Colombia
              </Header>

              <p className='text-white'>
                Según criterios de diferentes autores, se puede vislumbrar que no hay un consenso unificado para establecer el origen ni las razones fundamentales que llevaron a iniciar el conflicto armado interno ni un único determinante para que se prolongara durante varias décadas en todo el país. Algunos expertos detallan que sus comienzos se pueden rastrear en distintos en periodos, el primero entre 1929 a 1930 y un segundo periodo entre 1957 a 1958; mientras otros argumentan que, en hechos políticos como la lucha por la tierra, la confrontación bipartidista, el Frente Nacional y la época de la violencia son la génesis de este fenómeno armado.
              </p>
            </Grid.Column>
            <Grid.Column computer={6} tablet={6} mobile={16}>
              <Image src="images/content/paisaje.jpeg" />
            </Grid.Column>
          </Grid>
          <Grid className="" verticalAlign='middle' centered style={{ marginTop: "70px" }}>
            <Grid.Column computer={6} tablet={6} mobile={16}>
              <Image src="images/content/mural.jpeg" />
            </Grid.Column>
            <Grid.Column computer={10} tablet={10} mobile={16}>
              <Header as="h2" className='text-white' style={{ borderBottom: 'solid #21ba45 6px' }}>
                Escenario de violencia en el departamento del Cauca
              </Header>

              <p className='text-white'>
                El Cauca fue escenario de hechos de violencia en el marco del conflicto armado interno, el sometimiento a sangre y fuego de las comunidades que lo integran por parte de grupos guerrilleros y otros actores armados como las AUC y paramilitares, predominaron por décadas en la región. La disputa del poder y proyecto de expansión y acumulación territorial, provocó  un intenso accionar como la confrontación armada entre los distintos bandos, y éstos con la fuerza pública, las tomas a los poblados y cabeceras municipales, arremetidas contra los puestos de policía, embocadas para reducir la presencia estatal y neutralizar la influencia del enemigo, además de algunos actos delictivos como la extorsión, el secuestro, y comercialización productos ilícitos (CNMH, TYAG1965-2013, 2016, pág. 28).
              </p>
            </Grid.Column>
          </Grid>

          <Divider horizontal style={{ marginTop: "80px", marginBottom: "40px" }}>
            <Header as="h1" className="font-xx-large text-white" >Galería</Header>
          </Divider>

          <Card.Group itemsPerRow={2} doubling>
            <Card className="hoverable">
              <Image src='images/content/cards/3.jpeg' wrapped ui={false} />
              <Card.Content>
                <Card.Description>
                  Recuperar la memoria viva de las personas que fueron víctimas del conflicto armado y le fueron vulnerados sus derechos a través de un proceso metodológico de sistematización de la información.
                </Card.Description>
              </Card.Content>
            </Card>
            <Card className="hoverable">
              <Image src='images/content/cards/1.jpeg' wrapped ui={false} />
              <Card.Content>
                <Card.Description>
                  Metodología de investigación y práctica técnica Historias de Vida, se evidencia subjetividad, a través de relatos, vivencias con fuerte carga de sentimientos, juicios y valores, una biografía de sus vidas, de los hechos y sucesos que por años tuvieron que padecer bajo el flagelo de la guerra, de aquel conflicto armado que parecía no acabar en ese pequeño territorio de la cabecera municipal de Toribio, Cauca.
                </Card.Description>
              </Card.Content>
            </Card>
            <Card className="hoverable">
              <Image src='images/content/cards/4.jpeg' wrapped ui={false} />
              <Card.Content>
                <Card.Description>
                  Desde el proceso por la paz, el cese al fuego bilateral y por último la firma de los acuerdos,  ha transformado positivamente el ambiente del casco urbano de Toribio.
                </Card.Description>
              </Card.Content>
            </Card>
            <Card className="hoverable">
              <Image src='images/content/cards/5.jpeg' wrapped ui={false} />
              <Card.Content>
                <Card.Description>
                  La ubicación geográfica de Toribio, norte del Cauca, zona de masiva afluencia de población y tránsito constante a departamentos como el Valle, Tolima y Huila; este territorio se ha convertido en el corredor terrestre más importante, comunicando las regiones orientales del país con el pacífico y el sur (Murillo, 2015, pág. 22).
                </Card.Description>
              </Card.Content>
            </Card>
            <Card className="hoverable">
              <Image src='images/content/cards/2.jpeg' wrapped ui={false} />
              <Card.Content>
                <Card.Description>
                  La recuperación  la memoria oral del conflicto, no para ahondar heridas, sino para contar una realidad, una verdad de muchos silencios que quedaron resguardados por miedo o porque simplemente recordar les hacían daño, una verdad que necesitaba el país escuchar, una verdad que no podía quedar en desechada, y  ellos, cada uno de los habitantes de la cabecera municipal, tenía una carga de historia que contar, y que nosotros, los demás colombianos estábamos dispuestos a escuchar, pues su sentir es también el de nosotros.
                </Card.Description>
              </Card.Content>
            </Card>
            <Card className="hoverable">
              <Image src='images/content/cards/6.jpeg' wrapped ui={false} />
              <Card.Content>
                <Card.Description>
                  El conflicto armado en Colombia ha suscitado diferentes acontecimientos que se encuentran guardados en la memoria de las personas, los narran, los discuten en largas tertulias de plazas de mercado, parques o al calor de una chimenea; lastimosamente se han perdido en el   tiempo lo que ha ocasionado la repetición de la vulneración de los derechos humanos, ante dicho panorama se creó el proyecto para la recuperación de la memoria oral del conflicto armado en formatos digitales que podrán ser consultados a través de una plataforma tecnológica de datos abiertos, en donde se plasmó las vivencias a través de videos, audios y fotografías para que el mundo conozca una historia viva pero olvidada.  Se tomó como muestra el casco urbano de Toribio en donde habitan gentes de gran valentía que han pervivido a través del tiempo, son los verdaderos héroes en esta historia.  La plataforma permitirá que la comunidad pueda subir sus testimonios en diferentes formatos de tal manera que se contribuye a la preservación digital de la memoria del mundo.
                </Card.Description>
              </Card.Content>
            </Card>
          </Card.Group>
        </Container>
      </>
    );
  }
}


const mapStateToProps = state => {
  return {

  }
}

const mapDispatchToProps = dispatch => {
  return {

  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);
