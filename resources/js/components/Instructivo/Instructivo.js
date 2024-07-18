import React, { Component } from 'react';

import { connect } from 'react-redux';
import YouTube from 'react-youtube';

import { Container,Grid, Message } from 'semantic-ui-react';
import { animateScroll } from 'react-scroll';

class Instructivo extends Component {

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

                <Message info>
                    <Message.Header>Instructivo de registro</Message.Header>
                    <p>A continuación obtendra la informacion para el registro de usuario y testimonio en la plataforma Memoria Oral.</p>
                </Message>
                <h2 style={{color:'white', marginTop:20}}>Registro de usuario</h2>
                <Grid textAlign='center'>
                    <Grid.Column computer={35} tablet={12} mobile={16}>
                        <YouTube videoId="aHfIT5ySgKg" opts={videoOpts} />
                    </Grid.Column>
                </Grid>
                <h2 style={{color:'white', marginTop:20}}>Registro de testimonio</h2>
                <Grid textAlign='center'>
                    <Grid.Column computer={35} tablet={12} mobile={16}>
                        <YouTube videoId="boTd_fW-xw4" opts={videoOpts} />
                    </Grid.Column>
                </Grid>
            </Container>
        )
    }
}




export default connect()(Instructivo);
