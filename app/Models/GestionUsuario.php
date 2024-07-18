<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GestionUsuario extends Model
{
    protected $table = "gestion_usuarios";
    public $timestamps = false;

    protected $fillable = [
        'fecha', 'accion', 'version_previa', 'version_nueva','usuario_id','usuario_admin_id',
    ];
}
