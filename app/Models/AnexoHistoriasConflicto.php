<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnexoHistoriasConflicto extends Model
{
    protected $table = "anexos_historias_conflicto";
    public $timestamps = false;

    protected $fillable = [
        'archivo_id', 'historia_conflicto_id', 
    ];
}
