<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\RequestRegisterStories;
use App\Models\AnexoHistoriasConflicto;
use App\Models\Archivo;
use App\Models\GestionHistoriasConflicto;
use App\Models\HistoriaConflicto;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;


class StorieConflictController extends Controller
{
   
   public function list(Request $request){

        $query = HistoriaConflicto::select('historias_conflicto.*');
        //si el tipo de historias a consultar es de municipios
        if($request->type == "municipios"){
        	$query = $query->select("historias_conflicto.*", DB::raw("CONCAT(municipios.nombre, '-', departamentos.nombre) as ubicacion"));
        	//solo se consulta las historias que están relacionadas con un municipio
            $query = $query->join('municipios','historias_conflicto.municipio_id','=','municipios.id')
            	->join('departamentos','municipios.departamento_id','=','departamentos.id');

            if($request->has('departamento') && $request->departamento){
                $query = $query->where('municipios.departamento_id', $request->departamento);
            }

            if($request->has('municipio') && $request->municipio){
                $query = $query->where('municipios.id', $request->municipio);
            }
        }else{
        //si el tipo de historias a consultar es de departamentos	
        	$query = $query->select("historias_conflicto.*", "departamentos.nombre as ubicacion");

        	$query = $query->join('departamentos','historias_conflicto.departamento_id','=','departamentos.id');
        	
        	if($request->departamento)
        		$query = $query->where('historias_conflicto.departamento_id', $request->departamento);
        }

        if($request->has("buscar")){
            $like = "%".$request->buscar."%";

            $query = $query->where(function($q) use ($like){
                $q->where("historias_conflicto.titulo","like",$like)
                ->orWhere("historias_conflicto.texto","like",$like);
                //->whereNotIn($request->storiesDisplayed);
            });
        }

		/*if (Auth::user()->rol != "Administrador") {
			$query = $query->where('estado','Activo');
			
		} */     


		$queryWithAnnexes = clone $query;

		$queryWithAnnexes = $queryWithAnnexes->select('historias_conflicto.id as id_hc','archivos.id','archivos.nombre_archivo');

		$queryWithAnnexes = $queryWithAnnexes->join('anexos_historias_conflicto','historias_conflicto.id','=','anexos_historias_conflicto.historia_conflicto_id')->join('archivos','anexos_historias_conflicto.archivo_id','=','archivos.id');

		$queryWithAnnexes = $queryWithAnnexes->get();
            
        $query = $query->take(2)->get();

        return [
        	"historiasConflicto" => $query,
        	"annexes" => $queryWithAnnexes
        ];
    }	

	public function register(RequestRegisterStories $request)
	{
		$historiaConflicto = new HistoriaConflicto();
		$historiaConflicto->fill([
            "titulo" => $request->titulo,
            "texto" => $request->texto,
            "estado" => "Activo",
            "usuario_id" => Auth::user()->id,
		]);

		if ($request->has('municipio_id')) {
			$historiaConflicto->municipio_id = $request->municipio_id;
		}else{
			$historiaConflicto->departamento_id = $request->departamento_id;
		}

		$historiaConflicto->save();

		$log = new GestionHistoriasConflicto();

        $log->fill([            
            "accion" => "Crear",
            "fecha" => date("Y-m-d"),
            "usuario_id" => Auth::user()->id,
            "historia_conflicto_id" => $historiaConflicto->id,
        ]);

        $log->save(); 

		/*$archivo = $request->file('file_');
		$file_route=time().'_'. $archivo->getClientOriginalName();
       
		Storage::disk('file_')->put($file_route, file_get_contents( $archivo->getRealPath() ) );
			
		$archivo->nombre= $file_route;
		$archivos->nombre_archivo= $file_route;
		$archivos->ubicacion= $file_route;
		$archivos->metadatos= null;
		$archivos->save();*/

		$i=1;

		$endFiles= false;

		while (!$endFiles) {
			if(!$request->hasFile('file_'.$i)){
				$endFiles = true;
			}else{
				$file = $request->file('file_'.$i);		

				$archivo = new Archivo();

				$archivo->fill([
		            "nombre" => $file->getClientOriginalName(),
		            "nombre_archivo" => $file->getClientOriginalName(),
		            "ubicacion" => "empty",
		            "metadatos" => null,		
				]);

		        $archivo->save();

				$ubicacion = "app/public/stories_conflict/".$historiaConflicto->id."/".$archivo->id;

				$archivo->ubicacion = $ubicacion;
				$archivo->save();
				
		        $file->move(storage_path($ubicacion), $file->getClientOriginalName());
				
				$anexos = new AnexoHistoriasConflicto();

				$anexos->fill([
		            "archivo_id" => $archivo->id,
		            "historia_conflicto_id" => $historiaConflicto->id,			
				]);

				$anexos->save();
			}
			$i++;
		}    

        return response(["success"=>true], 200);		
		
	}

    public function show(HistoriaConflicto $storie_conflict)
    {
    	$storie_conflict->anexos;
        return $storie_conflict;
    }

    public function update(RequestRegisterStories $request, HistoriaConflicto $storie_conflict)
    {
    	if($storie_conflict){
			$storie_conflict->fill([
	            "titulo" => $request->titulo,
	            "texto" => $request->texto,
	            "estado" => "Activo",
	            "usuario_id" => Auth::user()->id,
			]);

			if ($request->has('municipio_id')) {
				$storie_conflict->municipio_id = $request->municipio_id;
			}else{
				$storie_conflict->departamento_id = $request->departamento_id;
			}

			$storie_conflict->save();

			$log = new GestionHistoriasConflicto();

	        $log->fill([            
	            "accion" => "Editar",
	            "fecha" => date("Y-m-d"),
	            "usuario_id" => Auth::user()->id,
	            "historia_conflicto_id" => $storie_conflict->id,
	        ]);

	        $log->save(); 

			$i=1;

			$endFiles= false;

			while (!$endFiles) {
				if(!$request->hasFile('file_'.$i)){
					$endFiles = true;
				}else{
					$file = $request->file('file_'.$i);		

					$archivo = new Archivo();

					$archivo->fill([
			            "nombre" => $file->getClientOriginalName(),
			            "nombre_archivo" => $file->getClientOriginalName(),
			            "ubicacion" => "empty",
			            "metadatos" => null,		
					]);

			        $archivo->save();

					$ubicacion = "app/public/stories_conflict/".$storie_conflict->id."/".$archivo->id;

					$archivo->ubicacion = $ubicacion;
					$archivo->save();
					
			        $file->move(storage_path($ubicacion), $file->getClientOriginalName());
					
					$anexos = new AnexoHistoriasConflicto();

					$anexos->fill([
			            "archivo_id" => $archivo->id,
			            "historia_conflicto_id" => $storie_conflict->id,			
					]);

					$anexos->save();
				}
				$i++;
			}	        

	        if($request->has("annexes_remove") && $request->annexes_remove){

	        	$annexes = $storie_conflict->anexos()->whereIn('archivos.id',explode(",", $request->annexes_remove))->get();

	        	foreach ($annexes as $value) {
	        		$path = storage_path($value->ubicacion."/".$value->nombre_archivo);
	        		@unlink($path);
	        		$value->delete();
	        	}
	        }
	        
        }

        return response(["success"=>true], 200); 
    }

    public function getAnnexed(Request $request, $historyConflictId, $annexedId){

		$archivo = HistoriaConflicto::select('archivos.*')
			->join('anexos_historias_conflicto','historias_conflicto.id','=','anexos_historias_conflicto.historia_conflicto_id')
			->join('archivos','anexos_historias_conflicto.archivo_id','=','archivos.id')
			->where('historias_conflicto.id', $historyConflictId)
			->where('archivos.id', $annexedId)->first();

		if($archivo)
    		return response()->file(storage_path($archivo->ubicacion."/".$archivo->nombre_archivo));

    	return response(["error" => ["Not found."]], 404);
    } 	
}