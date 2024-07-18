<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GestionHistoriasConflicto extends Model
{
    protected $table = "gestion_historias_conflicto";
    public $timestamps = false;

    protected $fillable = [
        'accion', 'fecha', 'usuario_id','historia_conflicto_id',
    ];
}