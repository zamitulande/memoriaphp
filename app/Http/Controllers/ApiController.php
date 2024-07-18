<?php

namespace App\Http\Controllers;

use App\Http\Requests\RequestChangePassword;
use App\User;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Route;

class ApiController extends Controller
{
	/**
	 * Acción de login de los usuarios
	 * 
	 * @param  Request $request [description]
	 * @return [type]           [description]
	 */
	public function login(Request $request)
	{

		//si existen datos de acceso para la app enviada
		if (env('CLIENT_ID') && env('CLIENT_SECRET')) {
			$username = $request->username;
			$password = $request->password;

			//se establece el formato de params para enviar a /oauth/token
			$request->request->add([
				'username' => $username,
				'password' => $password,
				'grant_type' => 'password',
				'client_id' => env('CLIENT_ID'),
				'client_secret' => env('CLIENT_SECRET'),
				'scope' => ''
			]);

			$tokenRequest = Request::create(
				url('/oauth/token'),
				'post'
			);

			$response = Route::dispatch($tokenRequest);
			if ($response->getStatusCode() == 200) {
				$data = $response->getContent();

				$expire = null;
				if ($request->has('rememberMe') && $request->rememberMe) {
					$expire = env('COOKIE_AUTH_EXPIRE');
				}

				$user = User::where('email', $username)->first();

				if ($user->estado == 'Inactivo')
					return response(['message' => 'El usuario ingresado no se encuentra activo'], 401);

				//se retorna una respuesta correcta y se agrega la cookie
				return response(['login' => 'success', 'user' => $user])
					->cookie(env('COOKIE_AUTH_NAME'), encrypt($data), $expire, null, '', url('/'), true);
			} else {
				return $response;
			}
		}
		return response('Unauthorized.', 401);
	}

	/**
	 * Elimina la cookie que contiene los datos de token de usuario
	 * extends
	 * @param  Request $request [description]
	 * @param  [type]  $app     [description]
	 * @return [type]           [description]
	 */
	public function logout(Request $request)
	{
		$cookie = Cookie::forget(env('COOKIE_AUTH_NAME'));
		return response(['logout' => 'success'])
			->withCookie($cookie);
	}

	public function forgotPassword(Request $request)
	{
		$user = User::where('numero_identificacion', $request->identificationNumber)->first();

		if (!$user)
			return response(['error' => ['No se ha encontrado ningún usuario con el número de identificación']], 422);

		$request->request->add([
			'email' => $user->email
		]);

		$tokenRequest = Request::create(
			url('/password/email'),
			'post'
		);
		return Route::dispatch($tokenRequest);
	}

	public function resetPassword(Request $request)
	{
		$request->validate([
			'token' => 'required',
			'email' => 'required|email',
			'password' => 'required|min:8|confirmed',
		]);

		$response = $this->broker()->reset(
			$request->only('email', 'password', 'password_confirmation', 'token'),
			function ($user, $password) {
				$user->forceFill([
					'password' => Hash::make($password)
				]);

				$user->save();
			}
		);
		return $response == Password::PASSWORD_RESET
			? response(['message' => 'Contraseña restablecida correctamente'])
			: response(['error' => ['Error al restablecer la contraseña']], 422);
	}
	protected function broker()
	{
		return Password::broker();
	}

	public function changePassword(RequestChangePassword $request)
	{
		$user = Auth::user();

		if (Hash::check($request->password, $user->password)) {
			$user->update(["password" => Hash::make($request->new_password)]);
			return response(["success" => true], 200);
		}
		return response(["errors" => ["password" => ["La contraseña ingresada es incorrecta"]]], 422);
	}
}
