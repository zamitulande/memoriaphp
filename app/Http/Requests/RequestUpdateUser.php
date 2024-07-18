<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RequestUpdateUser extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "numero_identificacion"=>"required|min:6|max:10|digits_between:6,10|unique:users,numero_identificacion,".$this->id.",id",
            "nombres"=>"required|min:3|max:60",
            "apellidos"=>"required|min:3|max:60",
            "email"=>"required|min:7|max:100|email|unique:users,email,".$this->id.",id",
            "genero"=>"required", 
            "rango_edad"=>"required",
            "poblacion"=>"required",
            "estado_civil"=>"required",
            "situacion_laboral"=>"required",
            "discapacidad"=>"required",
            "regimen_salud"=>"required",
            "ingreso_economico"=>"required",
            "estrato_socioeconomico"=>"required",
            "convive"=>"required",           
            "nivel_estudio"=>"required",
            "fecha_nacimiento"=>"required|Date",
            "direccion"=>"required|min:3|max:60",
            "municipio_id"=>"required",
        ];
    }

    public function messages(){
        return [
            "numero_identificacion.unique"=>"Ya existe un usuario con este número de identificación",
            "email.unique"=>"Ya existe un usuario con este correo electrónico",
        ];
    }
}