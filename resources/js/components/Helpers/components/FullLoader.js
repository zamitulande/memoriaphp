import React, { Component } from 'react';

import { Dimmer, Image, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';

class FullLoader extends Component {

    constructor(props) {
        super(props);
    }

    render() {
    	const display = this.props.visible?"":"display-none";
        return (
            <div className={"fullLoader "+display} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            	<Dimmer active inverted>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<Image src="/images/icono.ico" size="tiny" style={{
                            animation: "spin 2s linear infinite" // Agrega la animación de giro
                        }}/>
					<p style={{ maxWidth: "300px", color:"black" }}>{this.props.message}</p>
					</div>				
			    </Dimmer>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
	return {
		visible:state.fullLoader.visible,
		message:state.fullLoader.message
	}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(FullLoader);
