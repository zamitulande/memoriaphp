<?php

namespace App\Models;

use App\Models\Archivo;
use Illuminate\Database\Eloquent\Model;

class HistoriaConflicto extends Model
{
    protected $table = "historias_conflicto";

    protected $fillable = [
        'titulo','texto','usuario_id','municipio_id','departamento_id'
    ];

    public function anexos(){
    	return $this->belongsToMany(Archivo::class, "anexos_historias_conflicto", "historia_conflicto_id","archivo_id");
    }
}