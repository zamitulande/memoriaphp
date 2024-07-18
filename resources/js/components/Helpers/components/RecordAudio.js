import React, { Component, PropTypes } from 'react';
import { Segment, Button, Icon, Dimmer, Header } from 'semantic-ui-react';
import { GeneralMessage } from '../../Helpers/Helpers';

class RecordAudio extends Component {

    constructor(props) {
        super(props);

        this.state = {
            state:"stop",
            showIconRecording:true,
            activeDimmer:false,
            messageDimmer:"",
            showAudio:false,
            microphoneAccess:false
        }

        //contador que maneja los segundos antes de iniciar una grabación
        this.counter = 0;

        //id del intervalo encargado del parpadeo del circulo en el botón de grabar
        this.idIntervalRecording = null;
        this.mediaRecorder = null;
        this.stream = null;
        this.chunks = [];

        this.handleSuccess = this.handleSuccess.bind(this);
        this.hasGetUserMedia = this.hasGetUserMedia.bind(this);
        this.delete = this.delete.bind(this);

        let microphoneAccess = true;

        if(this.hasGetUserMedia()){
            navigator.mediaDevices.getUserMedia({ audio: true })
            .then(
                this.handleSuccess
            )
            .catch((err) => {
                this.setState({
                    microphoneAccess:false
                })
            });
        }
    }

    hasGetUserMedia() {
      // Note: Opera builds are unprefixed.
      return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }

    componentWillReceiveProps(nextProps) {
        if("resetForm" in nextProps && nextProps.resetForm){
            this.setState({
                state:"stop",
                showIconRecording:true,
                activeDimmer:false,
                messageDimmer:"",
                showAudio:false
            });
        }
    }

    componentDidMount() {
    	//controla el parpadeo del circulo en el bcotón de grabar
     	this.idIntervalRecording = setInterval(() => {
     		if(this.state.state == "recording"){
	     		this.setState({
	     			showIconRecording:!this.state.showIconRecording
	     		});
	     	}
     	}, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.idIntervalRecording);
    }

    setStateRecord(state){
    	switch (state) {
    		case "recording":
    			this.record();
    			break;
    		case "pause":
    			this.pause();
    			break;
    		case "stop":
    			this.stop();
    			break;
    		default:
    			// statements_def
    			break;
    	}
    }

    record(){
    	this.setState({
    		showAudio:false
    	})
    	//si se encuentra detenido se muestra cuenta regresiva
    	if(this.state.state == 'stop'){
    		this.counter = 10;

	    	let idInterval = null;

    		//para desplegar dimer con cuenta regresiva
	    	this.setState({
	    		activeDimmer:true,
	    		messageDimmer:<Header as="h3" inverted>
	    			<Icon name="microphone"/> La grabación iniciará en {this.counter} segundos
    			</Header>
	    	})

	    	idInterval = setInterval(() => {
	    		this.counter--;

	    		this.setState({
		    		messageDimmer:<Header as="h3" inverted>
		    			<Icon name="microphone"/> La grabación iniciará en {this.counter} segundos
	    			</Header>
		    	})

	    		//al llegar a 0 en el contador, se inicia la grabación
		    	if(this.counter == 0){
		    		clearInterval(idInterval);

		    		this.setState({
		    			state:'recording',
			    		activeDimmer:false,
			    		messageDimmer:''
			    	})

		    		this.mediaRecorder = new MediaRecorder(this.stream, {
			    		mimeType:'audio/webm'
			    	});
			    	this.mediaRecorder.start();
			    	this.mediaRecorder.ondataavailable = (e) => {
			    		this.chunks.push(e.data);
			    	}

			    	this.mediaRecorder.onstop = () => {
			    		let blob = new Blob(this.chunks, {type:'audio/webm'});
			    		this.chunks = [];

			    		var player = document.getElementById('player');
    					player.src = URL.createObjectURL(blob);

    					if("onStop" in this.props){
    						this.props.onStop(blob); 						
    					}
			    	}
		    	}
	    	}, 1000)
	    }else{
	    	//continua con la grabación
	    	this.setState({
    			state:'recording'
	    	})

	    	this.mediaRecorder.resume();
	    }
    }

    pause(){
    	this.setState({
			state:'pause'
    	})

    	this.mediaRecorder.pause();
    }

    stop(){
    	this.setState({
			state:'stop',
			showAudio:true
    	})
    	this.mediaRecorder.stop();
    }

    delete(){
        this.setState({
            state:'stop',
            showAudio:false
        })
        if("onDelete" in this.props){
            this.props.onDelete();                        
        }
    }

    handleSuccess = (stream) => {
    	this.stream = stream;

        this.setState({
            microphoneAccess:true
        })
	}

    render() {
    	const { state, showIconRecording, activeDimmer, messageDimmer, showAudio, microphoneAccess } = this.state;
        if(!this.hasGetUserMedia()){
            return <GeneralMessage warning messages={["Su navegador no admite la grabación de audio mediante micrófono. Esto suele pasar cuando la versión del navegador no está actualizada, por favor, actualice el navegador he intente nuevamente."]}/>
        }else if(!microphoneAccess){
            return <GeneralMessage warning messages={["El acceso al micrófono ha sido inhabilitado, para grabar audio debe habilitar el acceso al micrófono desde las opciones del navegador."]}/>
        }

    	let icon = icon = <Icon name="circle" className="white-text"/>
    	let textGrabar = "Grabar";

    	if(state == "recording"){
    		if(showIconRecording)
    			icon = <Icon name="circle" className="red-text"/>

    		textGrabar = "Grabando";
    	}else if(state == "pause"){
    		textGrabar = "Continuar";
    	}

        return (
        	<Segment>        		
	        	<Segment textAlign="center" basic className={showAudio?"":"d-none"}>
	        		<Header as="h3">Escuche aquí el audio grabado</Header>
	        		<audio id="player" controls controlsList="nodownload"></audio>
                    <Segment basic>
                        <Button type="button" negative onClick={this.delete}>
                            <Icon name="trash alternate outline"/>
                            Eliminar audio grabado
                        </Button>
                    </Segment>
	        	</Segment>

	        	<Segment textAlign="center" basic>
	        		<Dimmer active={activeDimmer}>
	        			{messageDimmer}
	        		</Dimmer>
	        		<Button type="button" positive disabled={state == "stop" || state == "pause"?false:true} onClick={() => this.setStateRecord('recording')}>
	        			{icon} {textGrabar}
	        		</Button>

	        		<Button type="button" positive disabled={(state != "recording")} onClick={() => this.setStateRecord('pause')}>
	        			<Icon name="pause" /> Pausar
	        		</Button>

	        		<Button type="button" positive disabled={(state != "recording" && state != "pause")} onClick={() => this.setStateRecord('stop')}>
	        			<Icon name="stop" /> Detener
	        		</Button>
	            </Segment>
            </Segment>
        );
    }
}

export default RecordAudio;
