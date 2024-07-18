<?php

namespace App\Http\Controllers\API\v1;

use App\Helpers\TableJL1805;
use App\Http\Controllers\Controller;
use App\Http\Requests\RequestRegisterUser;
use App\Http\Requests\RequestUpdateUser;
use App\Mail\RegisterUser;
use App\Models\Archivo;
use App\Models\GestionUsuario;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    public function list(Request $request)
    {	
    	/*$module = Module::where('identifier',1)->first();
    	dd(Gate::allows('update', $module));*/

		$query = User::select('users.*',
                            DB::raw('CONCAT(users.nombres," ",users.apellidos) as nombre'),
                            DB::raw('CONCAT(municipios.nombre," - ",departamentos.nombre) as municipio')
                        )
				->join('municipios','users.municipio_id','=','municipios.id')
				->join('departamentos','municipios.departamento_id','=','departamentos.id')
				->where('rol','Usuario');

    	$table = new TableJL1805($query, $request->config);

    	return $table->make();
    }

    public function register(RequestRegisterUser $request)
    {
        User::register($request);
        //DB::commit();
    	return response(["success"=>true], 200);                
    }


    public function show(User $user)
    {
        return $user;
    }

    public function update(RequestUpdateUser $request, User $user)
    {
        if ($user) {
            $version_previa = $user->toJson();
            
            $user->fill($request->all());
            $user->victima_minas = $request->victima_minas == "true"?1:0;

            $user->save();

            $version_nueva = $user->toJson();

            $log = new GestionUsuario();

            $log->fill([
                "fecha" => date("Y-m-d"),
                "accion" => $user->estado=="Activo"?"Desbloquear":"Bloquear",
                "version_previa" => $version_previa,
                "version_nueva" => $version_nueva,
                "usuario_admin_id" => Auth::user()->id,
                "usuario_id" => $user->id,
            ]);

            $log->save();
        }
        

        return response(["success"=>true], 200); 
    }

    public function accountActivation(Request $request){
    	$user = User::where('token_',$request->token)->first();
    	if($user && $user->id == $request->id && $user->estado == "Inactivo" && Hash::check($request->password, $user->password)){
    		$creationDate = new Carbon($user->created_at,"America/Bogota");
    		$currentDate = Carbon::now();

    		$creationDate->add(2,"week");

    		//han pasado más de dos semanas
    		if($creationDate <= $currentDate){
    			return response(['error'=>'ERROR!! Esta url ha expirado, para más información comuníquese con el administrador.'], 422);
    		}

    		$user->token_ = NULL;
			$user->estado = "Activo";
			$user->save();


    		return response(["success"=>true,"email"=>$user->email], 200);
    	}

    	return response(['error'=>'ERROR!! Los datos enviados son incorrectos.'], 422);
    }

    public function toggleLock(Request $request){
    	$user = User::find($request->user);

    	if($user){
    		$version_previa = $user->toJson();

    		$user->estado = $user->estado == "Activo"?"Inactivo":"Activo";
    		$user->save();

    		$version_nueva = $user->toJson();

			$log = new GestionUsuario();

			$log->fill([
				"fecha" => date("Y-m-d"),
				"accion" => $user->estado=="Activo"?"Desbloquear":"Bloquear",
				"version_previa" => $version_previa,
				"version_nueva" => $version_nueva,
				"usuario_admin_id" => Auth::user()->id,
				"usuario_id" => $user->id,
			]);

			$log->save();

    		return ["success"=>true];
    	}

    	return response(["error"=>"La información enviada es incorrecta."],422);
    } 

    public function annexed(Request $request, User $user, $type){

        $annexed = false;
        if($type == "consentimiento_informado"){
            $annexed = $user->consentimientoInformado;
        }

        if($annexed)
            return response()->file(storage_path($annexed->ubicacion."/".$annexed->nombre_archivo));       
        return response(["error" => ["Not found."]], 404);
    }       
}
