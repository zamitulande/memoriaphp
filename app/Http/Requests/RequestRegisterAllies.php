<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RequestRegisterAllies extends FormRequest
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
            "nombre_organizacion"=>"required|min:3|max:60",
            "sitio_web"=>"min:3|max:60|url",
            "facebook"=>"min:3|max:100|url",
            "correo"=>"min:8|max:100",
            "telefonos"=>"required|min:10|max:100",
            "objeto_social"=>"max:1000"
            
        ];
    }
}