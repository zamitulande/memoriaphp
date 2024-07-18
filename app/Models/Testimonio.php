<?php

namespace App\Models;

use App\Models\GestionTestimonio;
use App\Models\Municipio;
use App\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Testimonio extends Model
{
    protected $table = "testimonios";

    protected $fillable = [
        'titulo',
        'descripcion_corta',
        'descripcion_detallada',
        'fecha_evento',
        //'latitud',
        //'longitud',
        'tipo',
        'categoria',
        'plantilla',
        'municipio_id',
        //'usuario_id',
        'audio_id',
        'video_id',
    ];

    public function usuario(){
    	return $this->belongsTo(User::class, "usuario_id");
    }

    public function gestion(){
        return $this->hasMany(GestionTestimonio::class, "testimonio_id")
        ->join("users", "gestion_testimonios.usuario_id","=","users.id");
    }

    public function anexos(){
        return $this->belongsToMany(Archivo::class, "anexos_testimonios", "testimonio_id","archivo_id");
    }

    public function audio(){
        return $this->belongsTo(Archivo::class, "audio_id");
    }

    public function video(){
        return $this->belongsTo(Archivo::class, "video_id");
    }

    public function municipio(){
        return $this->belongsTo(Municipio::class, "municipio_id");
    }

    public static function rules(Request $request){
        $testimonio = false;
        if($request->has("id"))
            $testimonio = Testimonio::find($request->id);

    	$maxDate = date('Y-m-d', strtotime('-1 month'));

    	$data = [
	        'titulo' => 'required|min:6|max:250',
	        'descripcion_corta' => 'required|min:50|max:150',
	        'fecha_evento' => 'required|date|before_or_equal:'.$maxDate,
	        //'latitud',
	        //'longitud',
	        'tipo' => 'required|in:Conflicto Armado,Pandemia,Cultura',
            'categoria' => 'required|in:Secuestro,Atentado,Desplazamiento,Muerte por Conflicto Armado,Desaparición Forzada,Supervivencia,Social,Económico,Convivencia,Muerte por pandemia,Secuelas Físicas,Mitos,Leyendas,Saberes Ancestrales,Historias,Otros',
	        'plantilla' => 'required|in:1,2,3,4',
	        'municipio' => 'required|exists:municipios,id',
	        //annexos
	        'descripcion_detallada' => 'required_without_all:audio,video,anexos',
	        'audio' => 'file|mimetypes:audio/mpeg,audio/webm,video/webm|max:204800|required_without_all:descripcion_detallada,video,anexos',
	        'video' => 'file|mimetypes:video/mp4,video/ogg|max:524288|required_without_all:descripcion_detallada,audio,anexos',
	        'anexos' => 'required_without_all:descripcion_detallada,audio,video',
	    ];

        //es una actualización
        if($testimonio){
            if(Auth::user()->rol == "Administrador")
                $data['observaciones'] = 'required|min:30|max:500';

            if(
                //si el testimonio tenia ya un audio o un video que no estèn siendo mandados a borrar
                //no se aplican las validaiones de requerido ya que seguirá existiendo por lo menos un anexo
                ($testimonio->audio && (!$request->has("deleteAudio") || !filter_var($request->deleteAudio, FILTER_VALIDATE_BOOLEAN)))
                || ($testimonio->video && (!$request->has("deleteVideo") || !filter_var($request->deleteVideo, FILTER_VALIDATE_BOOLEAN)))
            ){
                $data['descripcion_detallada'] = '';
                $data['audio'] = 'file|mimetypes:audio/mpeg,audio/webm,video/webm|max:204800';
                $data['video'] = 'file|mimetypes:video/mp4,video/ogg|max:524288';
                $data['anexos'] = '';
            }
        }

		if($request->has("anexos")){
		    $anexos = json_decode($request->anexos);

	    	foreach ($anexos as $anexo) {
			    if($request->hasFile('anexos_valores_'.$anexo->name)){
			    	$data['anexos_valores_'.$anexo->name] = "file|max:1024|mimes:jpg,jpeg,png";
		        }
		    }
		}

	    return $data;
    }

    public static function register(Request $request, $user = null){
        $testimony = new Testimonio();
        $version_previa = $testimony->toJson();
        $testimony->fill($request->all());
        $testimony->usuario_id = $user->id;
        $testimony->municipio_id = $request->municipio;

        if(Auth::user()->rol == "Administrador")
            $testimony->estado = "Aprobado";

        $testimony->save();

        //si se envía un audio
        if($request->hasFile("audio")){

            $fileAudio = $request->file('audio');     

            $archivoAudio = new Archivo();

            $archivoAudio->fill([
                "nombre" => $fileAudio->getClientOriginalName(),
                "nombre_archivo" => $fileAudio->getClientOriginalName(),
                "ubicacion" => "app/public/testimony/audio/".$testimony->id,
                "metadatos" => null,        
            ]);

            $archivoAudio->save();

            $fileAudio->move(storage_path($archivoAudio->ubicacion), $fileAudio->getClientOriginalName());

            $testimony->audio_id = $archivoAudio->id;
        }

        //si se envía un video
        if($request->hasFile("video")){

            $fileVideo = $request->file('video');     

            $archivoVideo = new Archivo();

            $archivoVideo->fill([
                "nombre" => $fileVideo->getClientOriginalName(),
                "nombre_archivo" => $fileVideo->getClientOriginalName(),
                "ubicacion" => "app/public/testimony/video/".$testimony->id,
                "metadatos" => null,        
            ]);

            $archivoVideo->save();

            $fileVideo->move(storage_path($archivoVideo->ubicacion), $fileVideo->getClientOriginalName());

            $testimony->video_id = $archivoVideo->id;
        }

        $testimony->save();

        //si se envían anexos (imagenes)
        if($request->has("anexos")){

        	$anexos = json_decode($request->anexos);

        	$annexesSave = [];

        	foreach ($anexos as $anexo) {
        		if($request->hasFile('anexos_valores_'.$anexo->name)){

		            $file = $request->file('anexos_valores_'.$anexo->name);     
		            $data = $request->input('anexos_datos_'.$anexo->name);
		            $data = json_decode($data);

		            $archivo = new Archivo();

		            $archivo->fill([
		                "nombre" => $data->name,
		                "nombre_archivo" => $file->getClientOriginalName(),
		                "ubicacion" => "app/public/testimony/images/".$testimony->id."/".$anexo->name,
		                "descripcion" => $data->description,
		                "metadatos" => null,        
		            ]);

                    if($data->date){
                        $archivo->fecha = $data->date;
                    }

		            $archivo->save();

		            $file->move(storage_path($archivo->ubicacion), $file->getClientOriginalName());

		            $annexesSave[] = $archivo->id;
		        }
	        }

	        $testimony->anexos()->attach($annexesSave);
        }

        $version_nueva = $testimony->toJson();

        $log = new GestionTestimonio();

        $log->fill([
            "fecha" => date("Y-m-d"),
            "accion" => "Crear",
            "version_previa" => $version_previa,
            "version_nueva" => $version_nueva,
            "usuario_id" => Auth::check()?Auth::user()->id:null,
            "testimonio_id" => $testimony->id,
        ]);

        $log->save();

        return $testimony;
    }

    public function updateTestimony(Request $request){
        if(
            Auth::user()->rol == "Administrador"
            || (
                Auth::user()->rol == "Usuario"
                && Auth::user()->id == $this->usuario_id
                && $this->estado == "Registrado"
            )
        ){
            $version_previa = $this->toJson();
            $this->fill($request->all());
            $this->municipio_id = $request->municipio;

            //si es administrador se evalua si se solicitó cambio de estado
            if(Auth::user()->rol == "Administrador"){
                if($request->saveAndApprove && filter_var($request->saveAndApprove, FILTER_VALIDATE_BOOLEAN))
                    $this->estado = "Aprobado";
                else if($request->saveAndCancel && filter_var($request->saveAndCancel, FILTER_VALIDATE_BOOLEAN))
                    $this->estado = "Cancelado";
            }

            $this->update();

            //si se envía un audio o se solicita eliminar el actual
            if($request->hasFile("audio") || filter_var($request->deleteAudio, FILTER_VALIDATE_BOOLEAN)){
                if(filter_var($request->deleteAudio, FILTER_VALIDATE_BOOLEAN)){
                    $audio = $this->audio;
                    if($audio){
                        @unlink(storage_path($audio->ubicacion."/".$audio->nombre_archivo));
                        $audio->delete();
                    }
                }

                if($request->hasFile("audio")){
                    $fileAudio = $request->file('audio');     

                    $archivoAudio = new Archivo();

                    $archivoAudio->fill([
                        "nombre" => $fileAudio->getClientOriginalName(),
                        "nombre_archivo" => $fileAudio->getClientOriginalName(),
                        "ubicacion" => "app/public/testimony/audio/".$this->id,
                        "metadatos" => null,        
                    ]);

                    $archivoAudio->save();

                    $fileAudio->move(storage_path($archivoAudio->ubicacion), $fileAudio->getClientOriginalName());

                    $this->audio_id = $archivoAudio->id;
                }
            }

            //si se envía un video o se solicita eliminar el actual
            if($request->hasFile("video") || filter_var($request->deleteVideo, FILTER_VALIDATE_BOOLEAN)){
                
                if(filter_var($request->deleteVideo, FILTER_VALIDATE_BOOLEAN)){
                    $video = $this->video;
                    if($video){
                        @unlink(storage_path($video->ubicacion."/".$video->nombre_archivo));
                        $video->delete();
                    }
                }

                if($request->hasFile("video")){
                    $fileVideo = $request->file('video');     

                    $archivoVideo = new Archivo();

                    $archivoVideo->fill([
                        "nombre" => $fileVideo->getClientOriginalName(),
                        "nombre_archivo" => $fileVideo->getClientOriginalName(),
                        "ubicacion" => "app/public/testimony/video/".$this->id,
                        "metadatos" => null,        
                    ]);

                    $archivoVideo->save();

                    $fileVideo->move(storage_path($archivoVideo->ubicacion), $fileVideo->getClientOriginalName());

                    $this->video_id = $archivoVideo->id;
                }
            }

            $this->save();

            //anexos existentes que no se deben aliminar
            $annexesNotDelete = [];
            $annexesSave = [];

            //si se envían anexos (imagenes)
            if($request->has("anexos")){

                $anexos = json_decode($request->anexos);


                foreach ($anexos as $anexo) {
                    //si es la actualización de un anexo
                      if(property_exists($anexo, "id")){
                        $anexoObj = $this->anexos()->where("archivos.id", $anexo->id)->first();
                        if($anexoObj){
                            $file = false;
                            //si se envia un archivo se elimina el actual
                            if($request->hasFile('anexos_valores_'.$anexo->name)){
                                $file = $request->file('anexos_valores_'.$anexo->name);
                                @unlink(storage_path($file->ubicacion."/".$file->nombre_archivo));
                            }

                            $data = $request->input('anexos_datos_'.$anexo->name);
                            $data = json_decode($data);

                            $anexoObj->fill([
                                "nombre" => $data->name,
                                "nombre_archivo" => $file?$file->getClientOriginalName():$anexoObj->nombre_archivo,
                                "ubicacion" => $file?"app/public/testimony/images/".$this->id."/".$anexo->name:$anexoObj->ubicacion,
                                "descripcion" => $data->description,
                                "metadatos" => null,        
                            ]);

                            if($data->date){
                                $anexoObj->fecha = $data->date;
                            }

                            $anexoObj->save();

                            if($file){
                                $file->move(storage_path($anexoObj->ubicacion), $file->getClientOriginalName());
                            }

                            $annexesNotDelete[] = $anexoObj->id;
                        }
                    }else if($request->hasFile('anexos_valores_'.$anexo->name)){

                        $file = $request->file('anexos_valores_'.$anexo->name);     
                        $data = $request->input('anexos_datos_'.$anexo->name);
                        $data = json_decode($data);

                        $archivo = new Archivo();

                        $archivo->fill([
                            "nombre" => $data->name,
                            "nombre_archivo" => $file->getClientOriginalName(),
                            "ubicacion" => "app/public/testimony/images/".$this->id."/".$anexo->name,
                            "descripcion" => $data->description,
                            "metadatos" => null,        
                        ]);

                        if($data->date){
                            $archivo->fecha = $data->date;
                        }

                        $archivo->save();

                        $file->move(storage_path($archivo->ubicacion), $file->getClientOriginalName());

                        $annexesSave[] = $archivo->id;
                    }
                }

                $this->anexos()->attach($annexesSave);
            }
             
            $anexosBorrar = $this->anexos()
                ->whereNotIn("archivos.id", $annexesNotDelete)
                ->whereNotIn("archivos.id", $annexesSave)
                ->get();

            foreach ($anexosBorrar as $anexoBorrar) {
                @unlink(storage_path($anexoBorrar->ubicacion."/".$anexoBorrar->nombre_archivo));
                $anexoBorrar->delete();
            }

            $version_nueva = $this->toJson();

            $log = new GestionTestimonio();

            $data_fill = [
                "fecha" => date("Y-m-d"),
                "accion" => $request->saveAndApprove?"Aprobar":($request->saveAndCancel?"Cancelar":"Editar"),
                "version_previa" => $version_previa,
                "version_nueva" => $version_nueva,
                "usuario_id" => Auth::check()?Auth::user()->id:null,
                "testimonio_id" => $this->id,
            ];

            if(Auth::user()->rol == "Administrador")
                $data_fill["observaciones"] = $request->observaciones;

            $log->fill($data_fill);

            $log->save();
        }
        return $this;
    }
}