<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

class UserActive
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(Auth::check() && Auth::user()->estado == 'Inactivo'){
            if($request->ajax()){
                $cookie = Cookie::forget(env('COOKIE_AUTH_NAME'));
                return response('Unauthorized.',401)
                        ->withCookie($cookie);
            }else{
                return "Usuario inactivo";
            }
        }

        return $next($request);
    }
}
