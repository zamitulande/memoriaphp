<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\BitacorasSolicitudesAliados;
use Illuminate\Support\Facades\Storage;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\SolicitudesAliados;
use App\Helpers\TableJL1805;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\User;

class AlliesController extends Controller
{  


    public function list(Request $request)
    {	
    	/*$module = Module::where('identifier',1)->first();
    	dd(Gate::allows('update', $module));*/

		$query = SolicitudesAliados::select('solicitudes_aliados.*'
				);

    	$table = new TableJL1805($query, $request->config);

    	return $table->make();
    }

    public function listBitacoras(Request $request, SolicitudesAliados $solicitudesAliados)
    {	
    	$table = new TableJL1805($solicitudesAliados->bitacoras()->select("bitacoras_solicitudes_aliados.*"), $request->config);

    	return $table->make();
    }    



	public function register(Request $request)
	{

		$solicitudesAliados = new SolicitudesAliados();
		$solicitudesAliados->fill([
			"nombre_organizacion"=>$request->nombre_organizacion,
			"sitio_web"=>$request->sitio_web,
			"facebook"=>$request->facebook,
			"correo"=>$request->correo,
			"telefonos"=>$request->telefonos,
			"objeto_social"=>$request->objeto_social

		]);
		$solicitudesAliados->save();	

		return response(["success"=>true], 200);					     
	}  

    public function update(Request $request, SolicitudesAliados $solicitudesAliados)
    {       
    	if($solicitudesAliados){

    		$estado_anterior = $solicitudesAliados->estado;
    		$estado_nuevo = $request->estado;
			$solicitudesAliados->estado = $request->estado;

			$solicitudesAliados->save();

			$log = new BitacorasSolicitudesAliados();

	        $log->fill([            
	            "solicitud_aliado_id" => $solicitudesAliados->id,
	            "usuario_id" => Auth::user()->id,
	            "observacion" => $request->observaciones,
	            "estado_anterior" => $estado_anterior,
	            "estado_nuevo" => $estado_nuevo,
	            "fecha" => date("Y-m-d"),	            
	        ]);

	        $log->save(); 				        	      
	        return response(["success"=>true], 200);   
	    }	  		
	}
}
