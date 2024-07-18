<?php
namespace App\Http\Requests;

use App\Models\Testimonio;
use App\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class RequestTestimony extends FormRequest
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
        if(Auth::user()->rol == "Administrador" && !$this->has("id"))
            return array_merge(User::rules($this, false), Testimonio::rules($this));

        return Testimonio::rules($this);
    }

    public function messages(){
        return [
            "audio.mimetypes" => "El formato del audio enviado es incorrecto, sólo se permite .mp3 y .webm",
            "audio.required_without_all" => "Seleccione por lo menos un anexo",
            "video.mimetypes" => "El formato del video enviado es incorrecto, sólo se permite .mp4 y .ogg",
            "video.required_without_all" => "Seleccione por lo menos un anexo",
            "descripcion_detallada.required_without_all" => "Seleccione por lo menos un anexo",
            "anexos.required_without_all" => "Seleccione por lo menos un anexo",
        ];
    }
}