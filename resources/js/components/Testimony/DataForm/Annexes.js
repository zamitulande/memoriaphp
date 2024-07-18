import React, { Component, PropTypes } from 'react';

import { Tab, Segment,Message, Input, Grid, Button, Icon, Image } from 'semantic-ui-react';

import { RecordAudio, Btn, Valid } from '../../Helpers/Helpers';
import params from '../../../config/params';

class Annexes extends Component {

    constructor(props) {
        super(props);

        let annexes = [];
        let annexesData = {};
        let index = 0;        

        if("initialData" in props && props.initialData){
            const { initialData } = props;
            if("anexos" in initialData && initialData.anexos.length){
                _.map(initialData.anexos, (el, i) => {
                    annexes.push({key:index, name:index, id:el.id});
                    annexesData["data_"+index] = {
                        name:el.nombre,
                        date:el.fecha,
                        description:el.descripcion,
                    }
                    index++;
                });
            }

            this.state = {
                descripcionDetallada:initialData.descripcion_detallada,
                annexes:annexes,
                annexesData:annexesData,
                annexesValues:{},
                video:initialData.video?initialData.video:"",
                audio:initialData.audio?initialData.audio:"",
                audioRecord:"",

                itemsWithErros:[],
                
                formValidations:{
                    descripcionDetallada:initialData.descripcion_detallada?true:false,
                    video:initialData.video?true:false,
                    audio:initialData.audio?true:false,
                    audioRecord:false,
                    annexes:annexes.length?true:false
                },
                formErrors:{    
                    descripcionDetallada:[],
                    video:[],
                    audio:[],
                    audioRecord:[],
                    annexes:[]
                },
                resetForm:false,
                resetAudio:false,
                resetAudioRecord:false,
                errors:[],

                deleteVideo:false,
                deleteAudio:false,
            }
        }else{

            this.state = {
            	descripcionDetallada:"",
            	video:"",
            	audio:"",
            	audioRecord:"",
            	annexes:[],//almacena la información de los anexos existentes
    			annexesValues:{},//almacena los valores de los anexos existentes
    			annexesData:{},//almacena la información de las imagenes (nombre, fecha y descripción)

    			itemsWithErros:[],//registra el nombre de los items que tienen errores en la seleccion de anexos

    			formValidations:{
    	        	descripcionDetallada:false,
    	        	video:false,
    	        	audio:false,
    	        	audioRecord:false,
    	        	annexes:false
    			},

    			formErrors:{	
    	        	descripcionDetallada:[],
    	        	video:[],
    	        	audio:[],
    	        	audioRecord:[],
    	        	annexes:[]
    			},
                resetForm:false,
                resetAudio:false,
                resetAudioRecord:false,
                errors:[],

                deleteVideo:false,
                deleteAudio:false
            }
        }

        this.handleInputChange = this.handleInputChange.bind(this);        

        this.setFormIsValid = this.setFormIsValid.bind(this);        
        this.onTrueValid = this.onTrueValid.bind(this);
        this.onFalseValid = this.onFalseValid.bind(this);
        this.addAnnexed = this.addAnnexed.bind(this);        

        this.removeAnnexed = this.removeAnnexed.bind(this);        
        this.handleChangeInputFile = this.handleChangeInputFile.bind(this);
        this.evaluateStateAnnexes = this.evaluateStateAnnexes.bind(this);
        this.handleChangeInputDataAnnexed = this.handleChangeInputDataAnnexed.bind(this);

        this.handleUpdateState = this.handleUpdateState.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if("resetForm" in nextProps && nextProps.resetForm){
            this.setState({
                descripcionDetallada:"",
                video:"",
                audio:"",
                audioRecord:"",
                annexes:[],//almacena la información de los anexos existentes
                annexesValues:{},//almacena los valores de los anexos existentes
                annexesData:{},//almacena la información de las imagenes (nombre, fecha y descripción)

                itemsWithErros:[],//registra el nombre de los items que tienen errores en la seleccion de anexos

                formValidations:{
                    descripcionDetallada:false,
                    video:false,
                    audio:false,
                    audioRecord:false,
                    annexes:false
                },

                formErrors:{    
                    descripcionDetallada:[],
                    video:[],
                    audio:[],
                    audioRecord:[],
                    annexes:[]
                },
                resetForm:true,
                errors:[]
            })
        }else{
            this.setState({
                resetForm:false
            })
        }

        if("errors" in nextProps && nextProps.errors){
            this.setState({
                errors:nextProps.errors
            })
        }
    }

    componentWillMount() {
    	//se agrega una imagen al iniciar el componente
        this.addAnnexed();  

        this.handleUpdateState();
        this.setFormIsValid();
    }

    handleInputChange(e, {name}){
    	if(e.target.type == "file"){
    		this.setState({
    			[name]:e.target.files[0]
    		})

    		if(e.target.files[0]){
                if(name == "video"){
                    this.setState({
                        deleteVideo:true
                    })
                }else if(name == "audio"){
                    this.setState({
                        deleteAudio:true
                    })
                }

                this.onTrueValid({
                    name:name
                });
    		}else{
    			this.onFalseValid({name:name}, false);
    		}

            this.handleUpdateState();
    		return
    	}

        let value = (e.target.type == 'checkbox')?e.target.checked:e.target.value;
        
        this.setState({ [name]:  value});

        this.handleUpdateState();
    }    

    /**
     * Dispara evento de actualización en el componente padre
     * si se envia la propiedad onUpdate
     */
    handleUpdateState(){
    	setTimeout(() => {
			if('onUpdate' in this.props){
        		const {
        			descripcionDetallada,
        			video,
	        		audio,
	        		audioRecord,
	        		annexes,
					annexesValues,
					annexesData,
                    deleteVideo,
                    deleteAudio
				} = this.state;

				this.props.onUpdate({
					descripcionDetallada,
        			video,
	        		audio,
	        		audioRecord,
	        		annexes,
					annexesValues,
					annexesData,
                    deleteVideo,
                    deleteAudio
				});
			}
		}, 10);
    }

    /*=========================================================
    =            Estado de validaciòn de formulario            =
    =========================================================*/    

    setFormIsValid(){
        setTimeout(() => {
            const lastFormIsValid = this.state.formIsValid;
            let isValid = false;

            //si por lo menos un anexo está validado 
            //se concideran validados los anexos
            _.map(this.state.formValidations, (value, key) => {
                if(value)isValid = true;
            });

            //si la validación es corecta pero existen
            //items con errores, la validación es fallida
            if(isValid && this.state.itemsWithErros.length){
        		isValid = false;
            }

            this.setState({
                formIsValid:isValid
            })

            if("onFormStateChange" in this.props && lastFormIsValid != isValid){
            	this.props.onFormStateChange(isValid);
            }
        }, 10)
    }

    onTrueValid({name}){
    	//si se ha agregado a la lista de items con errores
        //entonces se elimina
        const index = this.state.itemsWithErros.indexOf(name);
        if(index >= 0){
        	this.setState((oldState) => {
        		let items = oldState.itemsWithErros;
        		items.splice(index, 1);
        		return {
        			itemsWithErros:items
        		}
        	})
        }

    	if(name == "descripcionDetallada" && !this.state.descripcionDetallada.length){
    		return this.onFalseValid({name}, false);
    	}

        this.setState((oldState, props) => {
            return {
                formValidations:Object.assign({},oldState.formValidations,{[name]:true})
            }
        });

        this.setFormIsValid();
    }

    onFalseValid({name}, addToItemsWithErros = true){
        this.setState((oldState, props) => {
            return {
                formValidations:Object.assign({},oldState.formValidations,{[name]:false})
            }
        });

        if(addToItemsWithErros){
	        //si no se ha agregado a la lista de items con errores
	        //entonces se agrega
	        if(this.state.itemsWithErros.indexOf(name) < 0){
	        	this.setState((oldState) => {
	        		let items = oldState.itemsWithErros;
	        		items.push(name);
	        		return {
	        			itemsWithErros:items
	        		}
	        	})
	        }
	    }

        this.setFormIsValid();
    }

    /**
     * Agrega un input file a la lista de anexos
     */
    addAnnexed(e){
    	if(e)
    		e.preventDefault();

    	if(this.state.annexes.length < 10){
        	let currentAnnexes = this.state.annexes;
        	let currentAnnexesValues = this.state.annexesValues;
        	let currentAnnexesData = this.state.annexesData;

        	let key = 0;//valor inicial

        	//si existen más files, el key es el valor de key, en el ultimo file, más uno
        	if(currentAnnexes.length)
        		key = parseInt(currentAnnexes[(currentAnnexes.length - 1)].key) + 1

        	//se agrega el valor del nuevo file
        	currentAnnexesValues = Object.assign({},currentAnnexesValues,{["value_"+key]:""});

        	//se agregan los datos del nuevo file
        	currentAnnexesData = Object.assign({},currentAnnexesData,{["data_"+key]:{name:"",date:"",description:""}});

        	currentAnnexes.push({
        		key,
        		name:key
        	});

    		setTimeout(() => {
    			this.setState({
    				annexes:currentAnnexes,
    				annexesValues:currentAnnexesValues,
    				annexesData:currentAnnexesData
    			})
    		}, 10);
	    }
    }

    removeAnnexed(e, key){
    	if(e)
    		e.preventDefault();

    	if(this.state.annexes.length > 1){
	    	let currentAnnexes = this.state.annexes;
	    	//key para eliminar de la lista de valores
	    	let keyRemoveAnnexedValue = "value_"+currentAnnexes[key].key;
	    	//key para eliminar de la lista de datos
	    	let keyRemoveAnnexedData = "data_"+currentAnnexes[key].key;

	    	currentAnnexes.splice(key,1);

	    	let currentAnnexesValues = this.state.annexesValues;

	    	delete currentAnnexesValues[keyRemoveAnnexedValue];

	    	let currentAnnexesData = this.state.annexesData;

	    	delete currentAnnexesData[keyRemoveAnnexedData];

			setTimeout(() => {
				this.setState({
					annexes:currentAnnexes,
					annexesValues:currentAnnexesValues,
					annexesData:currentAnnexesData
				})
                
                this.handleUpdateState();
			}, 10);
		}

		this.evaluateStateAnnexes();
    }

    handleChangeInputFile(e, data){
    	let currentAnnexesValues = this.state.annexesValues;

    	currentAnnexesValues = Object.assign({},currentAnnexesValues,{["value_"+data.name]:e.target.files[0]});
    	
    	this.setState({
			annexesValues:currentAnnexesValues
		})

    	this.evaluateStateAnnexes();
        this.handleUpdateState();
    }

    handleChangeInputDataAnnexed(e, {name, value}){
    	const dataname = name.split("_")[0];
    	const datakey = name.split("_")[1];

    	let currentData = this.state.annexesData;

    	let dataSet = {[dataname]:value};

    	//si ya existen datos de los anexos
    	if("data_"+datakey in currentData){
    		dataSet = Object.assign({}, currentData["data_"+datakey], dataSet);
    	}

    	dataSet = {["data_"+datakey]:dataSet};

    	this.setState({
    		annexesData:Object.assign({}, currentData, dataSet)
    	});

    	this.evaluateStateAnnexes();

    	this.handleUpdateState();
    }

    evaluateStateAnnexes(){
    	setTimeout(() => {
			let isValid = true;
			let addToItemsWithErros = false;

    		_.map(this.state.annexesValues, (el, i) => {
    			//existe un archivo seleccionado
    			if(el){
    				const index = i.split("_")[1];
    				if("data_"+index in this.state.annexesData){
    					const data = this.state.annexesData["data_"+index];
    					//si la imagen no tiene un titulo y una descripcion
    					if(!(data.name && data.name.length >= 5 && data.description && data.description.length >= 30)){
	    					isValid = false;
    						addToItemsWithErros = true;
    					}
	    			}
    			}
    		});	

    		if(isValid){
    			this.onTrueValid({name:'annexes'});
    		}else{
    			this.onFalseValid({name:'annexes'}, addToItemsWithErros);
    		}
    	}, 10);    	
    }
    closeMessage(){
        setTimeout(() => {
            this.setState({errors:[]})
          }, 8000);
    }

    render() {
    	const { descripcionDetallada, resetForm, errors, resetAudio, resetAudioRecord, deleteAudio, deleteVideo } = this.state;
        let errors_ = "";

        if(errors.length){
            errors_ = _.map(errors, (el, i) => {
                return <Message.Item key={i}>{el}</Message.Item>
            })

            errors_ = <Message negative>
                <Message.Header>Corrija los siguientes errores en los anexos</Message.Header>
                {errors_}
            </Message>
            this.closeMessage();
        }

    	const styleTabPane = {
			border: "1px solid #d4d4d5",
			borderTop:"none"
		}

		let limiteFechaImagen = new Date();
    	limiteFechaImagen.setDate(limiteFechaImagen.getDate() - 1);

    	const yyyy = limiteFechaImagen.getFullYear();
    	const mm = (limiteFechaImagen.getMonth() + 1) < 10?"0"+(limiteFechaImagen.getMonth() + 1):(limiteFechaImagen.getMonth() + 1);
    	const dd = limiteFechaImagen.getDate() < 10?"0"+limiteFechaImagen.getDate():limiteFechaImagen.getDate();

    	limiteFechaImagen = yyyy+"-"+mm+"-"+dd;

        let video = "";
        let audio = "";

        if("initialData" in this.props && this.props.initialData.video && !deleteVideo){
            let urlVideo = params.URL_API+"testimony/annexed/"+this.props.initialData.id+"/video/"+this.props.initialData.video.id;

            video = <Segment basic>
                    <video controls width="100%"  controlsList="nodownload">
                        <source src={urlVideo} type="video/mp4"/>
                            Su navegador no tiene soporte para elementos de <code>video</code>.
                    </video>
                    <p>Puede eliminar el video y seleccionar uno nuevo o eliminar y omitir el envío de video. Si selecciona un video con el selector de archivos, el video actual se eliminará.</p>
                    <Btn.Delete fluid onClick={() => {
                            this.setState({deleteVideo:true, video:null})
                            this.handleUpdateState();
                        }
                    }/>
                </Segment>
        }

        if("initialData" in this.props && this.props.initialData.audio && !deleteAudio){
            let urlAudio = params.URL_API+"testimony/annexed/"+this.props.initialData.id+"/audio/"+this.props.initialData.audio.id;

            audio = <Segment>
                        <audio src={urlAudio} controls controlsList="nodownload" style={{width:"100%"}}>
                          Su navegador no tiene soporte para elementos de <code>audio</code>.
                        </audio>
                        <p>Puede eliminar el audio y seleccionar o grabar uno nuevo, también puede sólo eliminar el audio actual y omitir el envío de audio. Si selecciona un audio con el selector de archivos o si lo graba, el audio actual se eliminará.</p>
                        <Btn.Delete fluid onClick={() => {
                                this.setState({deleteAudio:true, audio:null})
                                this.handleUpdateState();
                            }
                        }/>
                    </Segment>
        }

		const panes = [
			{
				menuItem: { key: 'description', icon: 'align left', content: 'Descripción detallada' },
				pane: <Tab.Pane style={styleTabPane} key="1">
					<Message
						info
					    icon='info circle'
					    header='Descripción detallada del testimonio'
					    content={<Segment basic className="no-padding">
					    	<p>Para registrar la descripción escrita del testimonio, haga clic en cualquier parte del texto que aparece
					    a continuación, un editor de texto se habilitará y en él podrá registrar la descripción del testimonio.</p>
					    	<p>Haga clic sobre el botón (<Icon name="paragraph"/>) para cambiar el formato del texto en la descripción que esta escribiendo.</p>
					    	</Segment>
						}
					  />
		            <Valid.Wysiwyg
		            	name="descripcionDetallada"
		            	placeholder="Escriba aquí la descripción detallada del testimonio." 
		            	value={descripcionDetallada}
		            	min_length={1000}
		            	max_length={5000}
		            	onTrueValid={this.onTrueValid}
		            	onFalseValid={this.onFalseValid}
		            	onChange={(data, dataRender) => {
			            		this.setState({descripcionDetallada:data?data:""});
			            		this.handleUpdateState();
			            	}
			            }
		              />

				</Tab.Pane>,
			},
			{
				menuItem: { key: 'images', icon: 'images outline', content: 'Imágenes' },
				pane: <Tab.Pane style={styleTabPane} key="2">
					<Message
						info
					    icon='info circle'
					    header='Imágenes del testimonio'
					    content={<Segment basic className="no-padding">
					    	<p>Utilice este panel para agregar y seleccionar las imágenes que describen gráficamente el testimonio.</p>
					    	<p>El tamaño máximo permitido para las imágenes es de 1 Mb</p>
					    	</Segment>
						}
					  />
                	<Grid stackable doubling columns={("initialData" in this.props && this.props.initialData)?2:3}>
                		{
                			_.map(this.state.annexes, (el, i) => {
                                let image = "";

                                if("initialData" in this.props && el.id && !this.state.annexesValues['value_'+el.key]){
                                    image = <Image size="medium" centered src={params.URL_API+"testimony/annexed/"+this.props.initialData.id+"/image/"+el.id} />
                                }

                				return <Grid.Column key={el.key}>
                					<Segment style={{backgroundColor:"#00324D"}}>
					            		<Input type="file" className="w-100" >
                                            <Valid.File
                                                label={"Imagenes #"+(i+1)}
                                                maxSize={10}
                                                name={el.key}
                                                onChange={this.handleChangeInputFile} 
                                                accept=".jpg,.jpeg,.png"
                                                style={{width:"100%"}}
                                             />
					            		</Input>

                                        <Segment basic>
                                            {image}
                                        </Segment>

					            		<Segment basic className="no-padding">
					            			<Valid.Input 
                                                help="Escriba un nombre de pocas palabras que describa la fotografía."
                                                value={"data_"+el.key in this.state.annexesData?this.state.annexesData["data_"+el.key].name:""} onTrueValid={this.evaluateStateAnnexes} onFalseValid={this.evaluateStateAnnexes} required min_length={5} max_length={60} name={"name_"+el.key} label="Nombre" placeholder="Ingrese el nombre de la imagen" onChange={this.handleChangeInputDataAnnexed}/>
					            			<Valid.Input 
                                                help="Seleccione la fecha apróximada en que se tomó la fotografía."
                                                value={"data_"+el.key in this.state.annexesData?(this.state.annexesData["data_"+el.key].date?this.state.annexesData["data_"+el.key].date:""):""} max={limiteFechaImagen} onTrueValid={this.evaluateStateAnnexes} onFalseValid={this.evaluateStateAnnexes} type="date" name={"date_"+el.key} label="Fecha" placeholder="Seleccione la fecha de la imagen" onChange={this.handleChangeInputDataAnnexed}/>
					            			<Valid.Input 
                                                help="Escriba una descripción breve de lo que la imagen representa o contiene."
                                                textArea value={"data_"+el.key in this.state.annexesData?this.state.annexesData["data_"+el.key].description:""} onTrueValid={this.evaluateStateAnnexes} onFalseValid={this.evaluateStateAnnexes} required min_length={30} max_length={500} name={"description_"+el.key} label="Descripción" placeholder="Descripción de la imagen" onChange={this.handleChangeInputDataAnnexed}/>
                                            <Btn.Delete fluid onClick={(e) => {this.removeAnnexed(e, i)}}/>
					            		</Segment>
				            		</Segment>
				        		</Grid.Column>
                			})
                		}
                		<Grid.Column width={16}>
            				<Btn.Add onClick={this.addAnnexed}/>
                		</Grid.Column>            		
                	</Grid>
				</Tab.Pane>,
			},
			{
				menuItem: { key: 'video', icon: 'video', content: 'Video' },
				pane: <Tab.Pane style={styleTabPane} key="3">
					<Message
						info
					    icon='info circle'
					    header='Video del testimonio'
					    content={<Segment basic className="no-padding">
						    	<p>A continuación, seleccione el archivo de video que contiene el relato del testimonio.</p>
						    	<p>El tamaño máximo permitido para el video es de 512 Megabytes</p>
					    	</Segment>
						}
					  />
                    <Valid.File
                        maxSize={1048576}
                        name="video"
                        onChange={this.handleInputChange} 
                        accept=".mp4,.ogg"
                        reset={resetForm}
                     />
                     {video}
				</Tab.Pane>,
			},
			{
				menuItem: { key: 'audio', icon: 'microphone', content: 'Audio' },
				pane: <Tab.Pane style={styleTabPane} key="4">
					<Message
						info
					    icon='info circle'
					    header='Audio del testimonio'
					    content={<Segment basic className="no-padding">
					    	<p>A continuación, seleccione el archivo de audio que contiene el relato del testimonio.</p>
					    	<p>El tamaño máximo permitido para el audio es de 200 Mb</p>
					    	</Segment>
						}
					  />
                    <Valid.File
                        maxSize={200}
                        name="audio"
                        onChange={(e, props) => {
                            this.handleInputChange(e, props);

                            this.setState({
                                resetAudioRecord:true,
                                audioRecord:"",
                            });

                            setTimeout(() => {
                                this.setState({
                                    resetAudioRecord:false
                                });
                                
                                this.onFalseValid({name:"audioRecord"}, false);
                                this.handleUpdateState();
                            },10);
                            
                        }} 
                        accept=".mp3,.webm"
                        reset={resetForm?true:(resetAudio?true:false)}
                     />
					
					<Message
						info
					    icon='microphone'
					    header='Grabar audio'
					    content={<Segment basic className="no-padding">
						    	<p>Para grabar su testimonio debe permitir el acceso del sistema a su microfono. Posteriormente haga clic en el botón grabar, puede pausar y reanudar la grabación. 
						    	Una vez la grabación de su testimonio termine haga clic en el botòn detener.</p>
					    	</Segment>
						}
					  />

					<RecordAudio 
						onStop={(source) => {
							this.setState({
                                deleteAudio:true,
								audioRecord:source,
                                resetAudio:true,
                                audio:""
							});

                            setTimeout(() => {
                                this.setState({
                                    resetAudio:false
                                });

                                this.onTrueValid({name:"audioRecord"});
                                this.onFalseValid({name:"audio"}, false);
                                this.handleUpdateState();
                            },10);
						}}

                        onDelete={() => {
                            this.setState({
                                audioRecord:""
                            })
                            this.onFalseValid({name:"audioRecord"}, false);
                            this.handleUpdateState();
                        }}
                        resetForm={resetForm?true:(resetAudioRecord?true:false)}
					/>
                    {audio}
				</Tab.Pane>,
			}
		];
        return  <Segment basic className="no-padding no-margin" style={{backgroundColor:'#ffffff'}}>
            {errors_}
            <Tab panes={panes} renderActiveOnly={false}/>
        </Segment>
    }
}

export default Annexes;
