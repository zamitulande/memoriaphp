<?php

namespace App\Models;

use App\Models\Archivo;
use Illuminate\Database\Eloquent\Model;

class SolicitudesAliados extends Model
{
    protected $table = "solicitudes_aliados";

    protected $fillable = [
        'nombre_organizacion','sitio_web','facebook','correo','telefonos','objeto_social'
    ];

    public function bitacoras(){
    	return $this->hasMany(BitacorasSolicitudesAliados::class, "solicitud_aliado_id");
    }
}