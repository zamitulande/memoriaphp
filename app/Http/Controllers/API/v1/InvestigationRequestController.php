<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\RequestRegisterInvestigationRequest;
use App\Models\SolicitudesInvestigacion;
use App\Models\Archivo;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class InvestigationRequestController extends Controller
{  
	public function register(RequestRegisterInvestigationRequest $request)
	{

		$user = new User();
		$user->fill([
			"nombres"=>$request->nombres,
			"apellidos"=>$request->apellidos,
			"email"=>$request->email,
			"telefono"=>$request->telefono,
			"direccion"=>$request->direccion,
			"rol"=>"Solicitante"

		]);
		$user->save();

		$solicitudesInvestigacion = new SolicitudesInvestigacion();

		$solicitudesInvestigacion->fill([
            "observaciones" => $request->observaciones,
            "tipo_solicitante" => $request->tipo_solicitante,
            "usuario_id" => $user->id,
		]);

		$solicitudesInvestigacion->save();						

		$archivo = new Archivo();

		$contador= 1;
		$file = [];

		$file = $request->File('formato');

		$archivo->fill([
            "nombre" => $file->getClientOriginalName(),
            "nombre_archivo" => $file->getClientOriginalName(),
            "ubicacion" => "empty",
            "metadatos" => null,		
		]);

        $archivo->save();

		$ubicacion = "app/private/investigation_request/".$solicitudesInvestigacion->id."/formato/".$archivo->id;

		$archivo->ubicacion = $ubicacion;
		$archivo->save();
		
        $file->move(storage_path($ubicacion), $file->getClientOriginalName());        

        $solicitudesInvestigacion->archivo_id=$archivo->id;

        $solicitudesInvestigacion->save();
 
		$i=1;

		$endFiles= false;

		while (!$endFiles) {
			if(!$request->hasFile('file_'.$i)){
				$endFiles = true;
			}else{
				$files = $request->file('file_'.$i);		

				$archivo = new Archivo();

				$archivo->fill([
		            "nombre" => $files->getClientOriginalName(),
		            "nombre_archivo" => $files->getClientOriginalName(),
		            "ubicacion" => "empty",
		            "metadatos" => null,		
				]);

		        $archivo->save();

				$ubicacion = "storage/public/investigation_request/".$solicitudesInvestigacion->id."/anexos/".$archivo->id;

				$archivo->ubicacion = $ubicacion;
				$archivo->save();
				
		        $files->move(storage_path($ubicacion), $files->getClientOriginalName());

				$solicitudesInvestigacion->fill([
		            "archivo_id" => $archivo->id,
		            "solicitud_investigacion_id" => $solicitudesInvestigacion->id,			
				]);

				$solicitudesInvestigacion->save();
			}
			$i++;
		}    

        return response(["success"=>true], 200);				
	}
}