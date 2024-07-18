<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BitacorasSolicitudesAliados extends Model
{
    protected $table = "bitacoras_solicitudes_aliados";
    public $timestamps = false;

    protected $fillable = [
        'solicitud_aliado_id', 'usuario_id', 'observacion', 'estado_anterior', 'estado_nuevo', 'fecha',
    ];
}