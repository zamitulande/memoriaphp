import React, { Component, PropTypes } from 'react';

import { Image, Segment, Dimmer, Icon, Header, Grid } from 'semantic-ui-react';

class Gallery extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	indexShow:0,
        	images:props.images
        };
    }

    render() {
    	const {images, indexShow} = this.state;

    	const imagesList = _.map(images, (el, i) => {
    		return <Dimmer.Dimmable
		        as={Image}
		        dimmed={false}
		        dimmer={{ active:(i == indexShow?true:false), inverted:true, content:<Icon name="image" color="violet" style={{fontSize:"3rem"}}/>}}
		        size='small'
		        src={el.url}
		        key={i}
		        onClick={() => this.setState({indexShow:i})}
                className="cursor_pointer"
		      />
    		return <Dimmer active key={i} className="cursor_pointer">
    				<Image src={el.url} onClick={() => this.setState({indexShow:i})}/>
    			</Dimmer>
    	})

        return (
        	<div>
                <Header inverted={("inverted" in this.props)}>
                    {images[indexShow].title}
                    <Header.Subheader inverted={("inverted" in this.props).toString()}>
                        {images[indexShow].date}
                    </Header.Subheader>
                </Header>
	        	<p>{images[indexShow].description}</p>

                <Grid>
                    <Grid.Column computer={12} mobile={16}>
				        <Image src={images[indexShow].url} fluid/>            
                    </Grid.Column>

                    <Grid.Column computer={4} mobile={16}>
                        <Segment basic textAlign="center" className="no-padding no-margin" style={{maxHeight:'300px', overflowX:'hidden', overflowY:'auto'}}>
                            <Image.Group size="small" className="">
                                {imagesList}
                            </Image.Group>
                        </Segment>
                    </Grid.Column>
                </Grid>
			</div>
        );
    }
}

export default Gallery;
