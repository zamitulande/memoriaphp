<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\Municipio;
use App\Models\Departamentos;
use App\Models\HistoriaConflicto;
use App\Models\AnexoHistoriasConflicto;
use Illuminate\Http\Request;

class QueryController extends Controller
{
    public function municipios(Request $request){
    	$search = $request->has('search')?$request->search:"";
    	$query = Municipio::select('municipios.id as key','municipios.nombre as title','departamentos.nombre as description')
    		->join('departamentos','municipios.departamento_id','=','departamentos.id')
            ->where(function($q) use ($search, $request){
                $q->where('municipios.nombre','like','%'.$search.'%')
                    ->orWhere('municipios.id',$search);
                if(!$request->has('departamento') && $request->departamento){
                    $q->orWhere('departamentos.nombre','like','%'.$search.'%');
                }                
            });

        if($request->has('departamento') && $request->departamento){
            $query = $query->where('municipios.departamento_id', $request->departamento);
        }


        return $query->take(10)->get();    
    }  
    
    public function departamentos(Request $request){
        $search = $request->has('search')?$request->search:"";

        $query= Departamentos::select('departamentos.id as key','departamentos.nombre as title')
            ->where('departamentos.nombre','like','%'.$search.'%')
            ->orWhere('departamentos.id',$search);           

        return $query->take(10)->get();    
    }   
}
