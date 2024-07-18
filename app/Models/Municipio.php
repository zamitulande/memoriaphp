<?php

namespace App\Models;

use App\Models\Departamentos;
use Illuminate\Database\Eloquent\Model;

class Municipio extends Model
{
    protected $table = "municipios";
    public $timestamps = false;

    public function departamento()
    {
    	return $this->belongsTo(Departamentos::class, "departamento_id");
    }
}
