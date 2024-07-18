<?php

namespace App\Http\Controllers\API\v1;

use App\Exports\DataExport;
use App\Helpers\TableJL1805;
use App\Http\Controllers\Controller;
use App\Http\Requests\RequestTestimony;
use App\Models\Archivo;
use App\Models\Testimonio;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\HtmlString;
use Maatwebsite\Excel\Facades\Excel;

class TestimonyController extends Controller
{
	public function register(RequestTestimony $request)
	{	
		DB::beginTransaction();

		$user = Auth::user();
		//si el usuario actual es un administrador
		//el nuevo usuario que se relaciona con el testimonio 
		//se crea con los datos recibidos
		if(Auth::user()->rol == "Administrador")
			$user = User::register($request, true);

		$testimony = Testimonio::register($request, $user);
		DB::commit();
	} 

	public function update(RequestTestimony $request, Testimonio $testimony)
	{	
		DB::beginTransaction();
		$testimony->updateTestimony($request);
		DB::commit();
	}  

	public function list(Request $request, $isTestApiClient = 0){
		if($request->ajax() && $isTestApiClient == 0){
			$testimonies = Testimonio::select(
				"testimonios.*",
				DB::raw("CONCAT(municipios.nombre,' (',departamentos.nombre,')') as nombreMunicipio")
			)
			->with(['anexos'])
			->join("municipios","testimonios.municipio_id","=","municipios.id")
			->join("departamentos","municipios.departamento_id","=","departamentos.id");

			if($request->has("texto") && $request->texto){
				$search = "%".$request->texto."%";

				$testimonies = $testimonies->where(function($q) use ($search){
					$q->where("testimonios.titulo","like",$search)
						->orWhere("testimonios.descripcion_corta","like",$search)
						->orWhere("testimonios.descripcion_detallada","like",$search);
				});
			}

			if($request->has("tipo") && $request->tipo && $request->tipo != "Todos"){
				$testimonies = $testimonies->where("testimonios.tipo",$request->tipo);
			}
			if($request->has("categoria") && $request->categoria && $request->categoria != "Todos"){
				$testimonies = $testimonies->where("testimonios.categoria",$request->categoria);
			}

			if(Auth::check() && Auth::user()->rol == "Administrador" && $request->has("estado") && $request->estado && $request->estado != "Todos"){
				$testimonies = $testimonies->where("testimonios.estado",$request->estado);
			}

			if($request->has("municipio") && $request->municipio){
				$testimonies = $testimonies->where("testimonios.municipio_id",$request->municipio);
			}

			if($request->has("fechaInicio") && $request->fechaInicio){
				$testimonies = $testimonies->where("testimonios.fecha_evento",">=",$request->fechaInicio);
			}

			if($request->has("fechaFin") && $request->fechaFin){
				$testimonies = $testimonies->where("testimonios.fecha_evento","<=",$request->fechaFin);
			}

			if(Auth::check() && Auth::user()->rol == "Usuario" && $request->has("mostrar") && $request->mostrar && $request->mostrar == "Mis testimonios"){
				$testimonies = $testimonies->where("testimonios.usuario_id",Auth::user()->id);
			}

			if(!Auth::check()){
				$testimonies = $testimonies->where("testimonios.estado","Aprobado");
			}

			if(($request->has("find") && $request->find) || ($request->has("tipoVista") && $request->tipoVista == "Detalle")){

				if($request->has("find") && $request->find){
					$testimonies = $testimonies->where("testimonios.id",$request->find);
				}
				
				if($request->has("findNext") && $request->findNext){
					$testimonies = $testimonies->where("testimonios.id",">", $request->findNext);
				}

				if($request->has("findPrevious") && $request->findPrevious){
					$testimonies = $testimonies->where("testimonios.id","<", $request->findPrevious)
						->orderBy("testimonios.id", "DESC");
				}

				$testimonies = $testimonies->first();

				if($testimonies && Auth::check() && Auth::user()->rol == "Administrador"){
					$testimonies->audio;
					$testimonies->video;
					$testimonies->usuario;
					$testimonies->gestion;
				}else if($testimonies){
					$testimonies->audio;
					$testimonies->video;
				}

				$testimonies = $testimonies?[$testimonies]:[];
			}else{
				if($request->has("ids"))
					$testimonies = $testimonies->whereNotIn("testimonios.id", $request->ids);

				$testimonies = $testimonies->take(12)->get();
			}

			return $testimonies;
		}else{
			$rules = [
				"busqueda" => "nullable|string",
				"tipo" => "nullable|in:Conflicto Armado,Pandemia,Cultura",
				"categoria" => "nullable|in:Secuestro,Atentado,Desplazamiento,Muerte por Conflicto,Desaparición Forzada,Supervivencia,Social,Económico,Convivencia,Muerte por pandemia,Secuelas Físicas,Mitos,Leyendas,Saberes Ancestrales,Historias,Otros",
				"municipio" => "nullable|string",
				"departamento" => "nullable|string",
				"fechaInicio" => "nullable|date|before:".date("Y-m-d"),
				"fechaFin" => "nullable|date|before:".date("Y-m-d"),
				"excepciones" => "nullable|array",
				"cantidad" => "nullable|integer",
			];

			$messages = [
				"busqueda.string" => "El atributo busqueda sólo permite datos de tipo String.",
				"tipo.in" => "El atributo tipo sólo admite los siguientes valores: Conflicto,Pandemia,Cultura.",
				"categoria.in" => "El atributo categoria sólo admite los siguientes valores: Secuestro,Atentado,Desplazamiento,Muerte por Conflicto,Desaparición Forzada,Supervivencia,Social,Económico,Convivencia,Muerte por pandemia,Secuelas Físicas,Mitos,Leyendas,Saberes Ancestrales,Historias,Otros.",
				"municipio.string" => "El atributo municipio sólo permite datos de tipo String.",
				"departamento.string" => "El atributo departamento sólo permite datos de tipo String.",
				"fechaInicio.date" => "El atributo fecha de inicio sólo admite los siguientes tipos de fecha: yyyy-mm-dd, yyyy/mm/dd.",
				"fechaInicio.before" => "El atributo fecha de inicio sólo admite fechas anteriores a ".date("Y-m-d").".",
				"fechaFin.date" => "El atributo fecha de fin sólo admite los siguientes tipos de fecha: yyyy-mm-dd, yyyy/mm/dd.",
				"fechaFin.before" => "El atributo fecha de fin sólo admite fechas anteriores a ".date("Y-m-d").".",
				"excepciones.array" => "El atributo excepciones sólo admite un dato de tipo array.",
				"cantidad.integer" => "El atributo cantidad sólo admite valores numéricos de tipo entero."
			];

			$validator = Validator::make($request->all(), $rules, $messages);

			if ($validator->fails()){
				return response(["errors" => $validator->errors()], 422);
			}

			$testimonies = Testimonio::select("testimonios.*")
			->with(["audio", "video", "anexos", "municipio.departamento", "usuario:id,genero,rango_edad,poblacion,nivel_estudio,estado_civil,situacion_laboral,discapacidad,estrato_socioeconomico,convive"])
			->join("users","testimonios.usuario_id","=","users.id")
			->join("municipios","testimonios.municipio_id","=","municipios.id")
			->join("departamentos","municipios.departamento_id","=","departamentos.id")
			->where("testimonios.estado", "Aprobado");

			if($request->has("busqueda") && $request->busqueda){
				$search = "%".$request->busqueda."%";

				$testimonies = $testimonies->where(function($q) use ($search){
					$q->where("testimonios.titulo","like",$search)
						->orWhere("testimonios.descripcion_corta","like",$search)
						->orWhere("testimonios.descripcion_detallada","like",$search);
				});
			}

			if($request->has("tipo") && $request->tipo && $request->tipo != "Todos"){
				$testimonies = $testimonies->where("testimonios.tipo",$request->tipo);
			}
			if($request->has("categoria") && $request->categoria && $request->categoria != "Todos"){
				$testimonies = $testimonies->where("testimonios.categoria",$request->categoria);
			}

			if($request->has("municipio") && $request->municipio){
				$search = "%".$request->municipio."%";
				$testimonies = $testimonies->where("municipios.nombre","like",$search);
			}

			if($request->has("departamento") && $request->departamento){
				$search = "%".$request->departamento."%";
				$testimonies = $testimonies->where("departamentos.nombre","like",$search);
			}

			if($request->has("fechaInicio") && $request->fechaInicio){
				$testimonies = $testimonies->where("testimonios.fecha_evento",">=",$request->fechaInicio);
			}

			if($request->has("fechaFin") && $request->fechaFin){
				$testimonies = $testimonies->where("testimonios.fecha_evento","<=",$request->fechaFin);
			}

			if($request->has("excepciones") && is_array($request->excepciones) && count($request->excepciones))
				$testimonies = $testimonies->whereNotIn("testimonios.id", $request->excepciones);

			if($request->has("cantidad") && $request->cantidad)
				$testimonies = $testimonies->take($request->cantidad);

			//si es la solicitud de prueba (vista de datos abiertos y documentación)
			if($isTestApiClient == 1){
				$table = new TableJL1805($testimonies, $request->config);

    			return $table->make();
			}

			$testimonies = $testimonies->get();

			$fullData = [];

			foreach ($testimonies as $t) {
				$data = [
					"id" => $t->id,
			        "titulo" => $t->titulo,
			        "descripcion_corta" => $t->descripcion_corta,
			        "descripcion_detallada" => $t->descripcion_detallada,
			        "fecha_evento" => $t->fecha_evento,
			        "tipo" => $t->tipo,
					"categoria" => $t->categoria,
			        "municipio" => $t->municipio->nombre,
			        "departamento" => $t->municipio->departamento->nombre,
				];				

				$audio = null;

				if($t->audio){
					$audio = [
						"nombre" => $t->audio->nombre,
						"url" => url("api/v1/testimony/annexed/".$t->id."/audio/".$t->audio->id)
					];
				}

				$data["audio"] = $audio;

				$video = null;

				if($t->video){
					$video = [
						"nombre" => $t->video->nombre,
						"url" => url("api/v1/testimony/annexed/".$t->id."/video/".$t->video->id)
					];
				}

				$data["video"] = $video;

				$anexos = [];

				if($t->anexos && count($t->anexos)){
					foreach ($t->anexos as $a) {
						$anexos[] = [
							"nombre" => $a->nombre,
							"descripcion" => $a->descripcion,
							"fecha" => $a->fecha,
							"url" => url("api/v1/testimony/annexed/".$t->id."/image/".$a->id),
						];
					}
				}

				$data["anexos"] = $anexos;

				$fullData[] = $data;
			}

			//si es una exportación
			if($isTestApiClient == 2){
				return Excel::download(new DataExport(collect($fullData)), 'testimonios.xlsx');
			}

			return $fullData;
		}
	}

	public function export(Request $request)
	{
		$rules = [
				"busqueda" => "nullable|string",
				"tipo" => "nullable|in:Conflicto Armado,Pandemia,Cultura",
				"categoria" => "nullable|in:Secuestro,Atentado,Desplazamiento,Muerte por Conflicto,Desaparición Forzada,Supervivencia,Social,Económico,Convivencia,Muerte por pandemia,Secuelas Físicas,Mitos,Leyendas,Saberes Ancestrales,Historias,Otros",
				"municipio" => "nullable|string",
				"departamento" => "nullable|string",
				"fechaInicio" => "nullable|date|before:".date("Y-m-d"),
				"fechaFin" => "nullable|date|before:".date("Y-m-d"),
				"excepciones" => "nullable|array",
				"cantidad" => "nullable|integer",
			];

			$messages = [
				"busqueda.string" => "El atributo busqueda sólo permite datos de tipo String.",
				"tipo.in" => "El atributo tipo sólo admite los siguientes valores: Conflicto,Pandemia,Cultura.",
				"categoria.in" => "El atributo categoria sólo admite los siguientes valores: Secuestro,Atentado,Desplazamiento,Muerte por Conflicto,Desaparición Forzada,Supervivencia,Social,Económico,Convivencia,Muerte por pandemia,Secuelas Físicas,Mitos,Leyendas,Saberes Ancestrales,Historias,Otros.",
				"municipio.string" => "El atributo municipio sólo permite datos de tipo String.",
				"departamento.string" => "El atributo departamento sólo permite datos de tipo String.",
				"fechaInicio.date" => "El atributo fecha de inicio sólo admite los siguientes tipos de fecha: yyyy-mm-dd, yyyy/mm/dd.",
				"fechaInicio.before" => "El atributo fecha de inicio sólo admite fechas anteriores a ".date("Y-m-d").".",
				"fechaFin.date" => "El atributo fecha de fin sólo admite los siguientes tipos de fecha: yyyy-mm-dd, yyyy/mm/dd.",
				"fechaFin.before" => "El atributo fecha de fin sólo admite fechas anteriores a ".date("Y-m-d").".",
				"excepciones.array" => "El atributo excepciones sólo admite un dato de tipo array.",
				"cantidad.integer" => "El atributo cantidad sólo admite valores numéricos de tipo entero."
			];

			$validator = Validator::make($request->all(), $rules, $messages);

			if ($validator->fails()){
				return response(["errors" => $validator->errors()], 422);
			}

			$testimonies = Testimonio::select("testimonios.*")
			->with(["audio", "video", "anexos", "municipio.departamento"])
			->join("municipios","testimonios.municipio_id","=","municipios.id")
			->join("departamentos","municipios.departamento_id","=","departamentos.id")
			->where("testimonios.estado", "Aprobado");

			if($request->has("busqueda") && $request->busqueda){
				$search = "%".$request->busqueda."%";

				$testimonies = $testimonies->where(function($q) use ($search){
					$q->where("testimonios.titulo","like",$search)
						->orWhere("testimonios.descripcion_corta","like",$search)
						->orWhere("testimonios.descripcion_detallada","like",$search);
				});
			}

			if($request->has("tipo") && $request->tipo && $request->tipo != "Todos"){
				$testimonies = $testimonies->where("testimonios.tipo",$request->tipo);
			}
			if($request->has("categoria") && $request->categoria && $request->categoria != "Todos"){
				$testimonies = $testimonies->where("testimonios.categoria",$request->categoria);
			}

			if($request->has("municipio") && $request->municipio){
				$search = "%".$request->municipio."%";
				$testimonies = $testimonies->where("municipios.nombre","like",$search);
			}

			if($request->has("departamento") && $request->departamento){
				$search = "%".$request->departamento."%";
				$testimonies = $testimonies->where("departamentos.nombre","like",$search);
			}

			if($request->has("fechaInicio") && $request->fechaInicio){
				$testimonies = $testimonies->where("testimonios.fecha_evento",">=",$request->fechaInicio);
			}

			if($request->has("fechaFin") && $request->fechaFin){
				$testimonies = $testimonies->where("testimonios.fecha_evento","<=",$request->fechaFin);
			}

			if($request->has("excepciones") && is_array($request->excepciones) && count($request->excepciones))
				$testimonies = $testimonies->whereNotIn("testimonios.id", $request->excepciones);

			if($request->has("cantidad") && $request->cantidad)
				$testimonies = $testimonies->take($request->cantidad);

			$testimonies = $testimonies->get();

			$fullData = [];

			foreach ($testimonies as $t) {
				$data = [
					"id" => $t->id,
			        "titulo" => $t->titulo,
			        "descripcion_corta" => $t->descripcion_corta,
			        "descripcion_detallada" => strip_tags($t->descripcion_detallada),
			        "fecha_evento" => $t->fecha_evento,
			        "tipo" => $t->tipo,					
					"categoria" => $t->categoria,
			        "municipio" => $t->municipio->nombre,
			        "departamento" => $t->municipio->departamento->nombre,
				];			

				$video = null;

				if($t->video){
					$video = url("api/v1/testimony/annexed/".$t->id."/video/".$t->video->id);
				}else{
					$video = "Este testimonio no contiene video";
				}
				
				$data["video"] = $video;

				$anexos = "";
				if($t->anexos && count($t->anexos)){
					foreach ($t->anexos as $a) {
						$anexos .= url("api/v1/testimony/annexed/".$t->id."/image/".$a->id);
					}
				}else{
					$anexos = "Este testimonio no contiene imagen";
				}

				$data["anexos"] = $anexos;
				
				$audio = null;

				if($t->audio){
					$audio = url("api/v1/testimony/annexed/".$t->id."/audio/".$t->audio->id);
				}else{
					$audio = "Este testimonio no contiene audio";
				}

				$data["audio"] = $audio;

				$fullData[] = $data;
			}

			return Excel::download(new DataExport(collect($fullData)), 'testimonios.xlsx');
	}

	public function annexed(Request $request, Testimonio $testimony, $type, $idAnnexed){

		if($type == "image"){
			$annexed = $testimony->anexos()->find($idAnnexed);
		}else if($type == "audio"){
			$annexed = $testimony->audio()->find($idAnnexed);
		}else{
			$annexed = $testimony->video()->find($idAnnexed);
		}

		if($annexed){
			$path = storage_path().'/'. $annexed->ubicacion.'/'.$annexed->nombre_archivo;

		    if(!File::exists($path)) abort(404);

		    $file = File::get($path);
		    $type = File::mimeType($path);


		    $response = Response::make($file, 200);
		    $response->header("Content-Type", $type);

		    return $response;
		}
	}
}