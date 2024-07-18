import React, { Component } from 'react';

import { connect } from 'react-redux';
import store from '../../redux/store';
import YouTube from 'react-youtube';

import { Header, Container, Segment, Grid, Button, Card, Icon, Image, Divider } from 'semantic-ui-react';
import Slider from 'react-animated-slider';
import { animateScroll } from 'react-scroll';

class Mision extends Component {

    render() {
        const videoOpts = {
            height: '480',
            width: '100%',
            playerVars: {
                autoplay: 0,
            },
        };
        animateScroll.scrollToTop();
        return (
            <Container style={{ paddingTop: '40px', color: "#fff" }}>
                <Grid textAlign='center'>
                    <Grid.Column computer={35} tablet={12} mobile={16}>
                    <YouTube videoId="pcpHOLkRY_M" opts={videoOpts} />
                    </Grid.Column>                    
                </Grid>                     
                <Grid className="" verticalAlign='middle' centered>
                    <Grid.Column computer={10} tablet={10} mobile={16}>
                        <Header as="h2" style={{ color: "#fff", borderBottom: 'solid #21ba45 6px' }}>
                            Misión
                        </Header>
                        <p>
                            La plataforma Memoria Oral, administra archivos en formato video, audio y escrito,
                            para la generación de conocimiento y preservación de la memoria del mundo;
                            se desarrolla módulos a través de las buenas prácticas dentro del contexto
                            de nuevos cambios tecnológicos, con diferenciados tipos de información:
                            conflicto social, salud, cultura y patrimonio alimentario.
                            Dirigida a las comunidades científicas, tecnológicas y académicas. Es una herramienta
                            interactiva que permite la permanente comunicación con
                            el usuario para impactar una interrelación tecnológica y de conocimiento
                        </p>
                    </Grid.Column>
                    <Grid.Column computer={6} tablet={6} mobile={16}>
                        <Image src="images/content/Collage.png" />
                    </Grid.Column>
                </Grid>
                <Grid className="" verticalAlign='middle' centered style={{ marginTop: "70px" }}>
                    <Grid.Column computer={6} tablet={6} mobile={16}>
                        <Image src="images/content/velas.png" />
                    </Grid.Column>
                    <Grid.Column computer={10} tablet={10} mobile={16}>
                        <Header as="h2" style={{ color: "#fff", borderBottom: 'solid #21ba45 6px' }}>
                            Visión
                        </Header>
                        <p>
                            Dentro de cinco años se pretende una plataforma de Memoria Oral,
                            robusta que responda al volumen de tráfico y demandas de tecnologías
                            existentes, para procesar información oral y escrita de forma estructurada y
                            detallada, el aplicativo Web propiciara interacción permanente con el
                            usuario de las comunidades científicas, tecnológicas y académicas tanto nacionales e
                            internacionales interesadas en preservar el patrimonio oral y escrito.
                        </p>
                    </Grid.Column>
                </Grid>
            </Container>
        )
    }
}




export default connect()(Mision);
