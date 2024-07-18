<?php

namespace App\Models;

use App\Models\Archivo;
use Illuminate\Database\Eloquent\Model;

class SolicitudesInvestigacion extends Model
{
    protected $table = "solicitudes_investigacion";

    protected $fillable = [
        'observaciones','usuario_id','tipo_solicitante','archivo_id'
    ];

    public function anexos(){
    	return $this->belongsToMany(Archivo::class, "anexos_solicitudes_investigacion", "solicitud_investigacion_id","archivo_id");
    }
}