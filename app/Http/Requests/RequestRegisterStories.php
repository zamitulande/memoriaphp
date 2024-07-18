<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RequestRegisterStories extends FormRequest
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
            "titulo"=>"required|min:6|max:250",
            "texto"=>"required|min:6|max:2000",
            "municipio_id"=>"required_without_all:departamento_id",
            "departamento_id"=>"required_without_all:municipio_id",
        ];
    }
}