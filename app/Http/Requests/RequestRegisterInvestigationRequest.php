<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RequestRegisterInvestigationRequest extends FormRequest
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
            "nombres"=>"required|min:3|max:60",
            "apellidos"=>"required|min:3|max:60",
            "email"=>"required|min:7|max:100",
            "telefono"=>"min:10|max:15",
            "direccion"=>"required|min:8|max:100",
            "observaciones"=>"max:1000",
            "tipo_solicitante"=>"required"
            
        ];
    }
}