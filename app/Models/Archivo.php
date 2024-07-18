<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Archivo extends Model
{
    protected $table = "archivos";

    protected $fillable = [
        'nombre', 'nombre_archivo', 'fecha', 'descripcion', 'ubicacion', 'metadatos',
    ];

    protected $hidden = [
        'ubicacion'
    ];
}