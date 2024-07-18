<?php

namespace App;

use App\Mail\RegisterUser;
use App\Models\Archivo;
use App\Models\GestionUsuario;
use App\Models\Municipio;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'numero_identificacion',
        'nombres',
        'apellidos', 
        'email',
        'genero', 
        'rango_edad',
        'poblacion',
        'estado_civil',
        'situacion_laboral',
        'discapacidad',
        'regimen_salud',
        'ingreso_economico',
        'estrato_socioeconomico',
        'convive',         
        'password',
        'telefono',
        'nivel_estudio',
        'fecha_nacimiento',
        'direccion',
        'municipio_id', 
        'token_', 
        'victima_minas'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function municipio(){
        return $this->belongsTo(Municipio::class);
    }

    public function consentimientoInformado(){
        return $this->belongsTo(Archivo::class, "consentimiento_informado_id");
    }    

    public static function rules(Request $request, $password = true){
        $rules = [
            "numero_identificacion"=>"required|min:6|max:10|digits_between:6,10|unique:users,numero_identificacion",
            "nombres"=>"required|min:3|max:60",
            "apellidos"=>"required|min:3|max:60",
            "email"=>"required|min:7|max:100|email|unique:users,email",
            "genero"=>"required|in:Masculino,Femenino,Otro",
            "rango_edad"=>"required|in:18 a 24 años,25 a 34 años,35 a 44 años,45 a 54 años,55 a 64 años,Más de 65 años",
            "poblacion"=>"required|in:Campesino,Indigena,Raizal del archipiélago,Afrocolombiano-Afrodescendiente,Gitano (ROM),Palenquero de San Basilio,Ninguno",
            "estado_civil"=>"required|in:Casado,Union libre,Separado,Viudo,Soltero,No responde",
            "situacion_laboral"=>"required|in:Empleado de Empresa Privada,Empleado del Gobierno,Estudiante,Empleado(a) domestico(a),Trabajador Independiente,Jornalero o peón,Pensionado,No sabe no responde",
            "discapacidad"=>"required|in:Física,Auditiva,Visual,Sordo-ceguera,Intelectual,Psicosocial,Múltiple,Otra,Ninguna",
            "regimen_salud"=>"required|in:Contributivo Cotizante,Contributivo Beneficiario,Subsidiado,No afiliado,Especial",
            "ingreso_economico"=>"required|in:Menos de 1 Salario Minimo,Entre 1 y 3.5 Salarios Minimos,Entre 3.6 y 6 Salarios Minimos,más de 6 Salarios Minimos,No sabe no responde",
            "estrato_socioeconomico"=>"required|in:1,2,3,4,5,6",
            "convive"=>"required|in:1 persona,2 personas,más de 3 personas,Solo",         
            "nivel_estudio"=>"required|in:Algunos años de primaria,Toda la primaria,Algunos años de secundaria,Toda la secundaria,Uno o más años de técnica o tecnológica,Técnica o tecnológica completa,Uno o más años de universidad,Universitaria completa,Ninguno,No sabe No responde",
            "fecha_nacimiento"=>"required|Date|before_or_equal:".date("Y-m-d",strtotime("-18 Years")),
            "direccion"=>"required|min:3|max:60",
            "municipio_id"=>"required",
        ];

        //si el usuario es registrado por un administrador
        //el consentimiento informado es obligatorio
        if(Auth::user()->rol == "Administrador"){
            $rules["consentimiento_informado"] = "required|file|max:1024|mimes:jpg,jpeg,png,pdf";
        }

        if($password){
            $rules["password"] = "required|min:8|max:60|confirmed";
            $rules["password_confirmation"] = "required|min:8|max:60";
        }

        return $rules;
    }

    public static function register(Request $request, $generatePassword = false){
        $str_random = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        $user = new User();
        $version_previa = $user->toJson();
        $user->fill($request->all());

        $user->nombres = strtoupper($request->nombres);
        $user->apellidos = strtoupper($request->apellidos);

        $user->victima_minas = $request->victima_minas == "true"?1:0;

        $pass = "";

        if(!$generatePassword)
            $user->password = Hash::make($request->password);

        for($i = 0; $i < rand(30,45);$i++){
            $user->token_ .= $str_random[rand(0, (strlen($str_random)-1))];
            if($generatePassword)
                $pass .= $str_random[rand(0, (strlen($str_random)-1))];
        }

        if($generatePassword)
            $user->password = Hash::make($pass);

        $user->save();


        //si es administrador se debe subir el consentimiento informado
        if(Auth::check() && Auth::user()->rol == "Administrador"){
            $fileConsentimientoInformado = $request->file('consentimiento_informado');     

            $archivoConsentimientoInformado = new Archivo();

            $archivoConsentimientoInformado->fill([
                "nombre" => $fileConsentimientoInformado->getClientOriginalName(),
                "nombre_archivo" => $fileConsentimientoInformado->getClientOriginalName(),
                "ubicacion" => "empty",
                "metadatos" => null,        
            ]);

            $archivoConsentimientoInformado->save();

            $ubicacion = "app/private/users/informed_consent/".$user->id."/".$archivoConsentimientoInformado->id;

            $archivoConsentimientoInformado->ubicacion = $ubicacion;
            $archivoConsentimientoInformado->save();
            $fileConsentimientoInformado->move(storage_path($ubicacion), $fileConsentimientoInformado->getClientOriginalName());

            $user->consentimiento_informado_id = $archivoConsentimientoInformado->id;
            $user->save();
        }

        $version_nueva = $user->toJson();

        $log = new GestionUsuario();

        $log->fill([
            "fecha" => date("Y-m-d"),
            "accion" => "Crear",
            "version_previa" => $version_previa,
            "version_nueva" => $version_nueva,
            "usuario_admin_id" => Auth::check()?Auth::user()->id:null,
            "usuario_id" => $user->id,
        ]);

        $log->save();

        Mail::to($user)->send(new RegisterUser($user, $generatePassword, $pass));
        return $user;
    }
}
