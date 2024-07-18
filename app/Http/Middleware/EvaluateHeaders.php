<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\App;

class EvaluateHeaders
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
        //dd('En middleware');
        //Si la solicitud trae cookies de autenticación
        $cookie = $request->cookie(env('COOKIE_AUTH_NAME'));
        if($cookie)
        {
            $data = json_decode(decrypt($cookie));
            if(is_object($data) && property_exists($data, 'token_type') && property_exists($data, 'access_token'))
            {
                $request->headers->set('Authorization', $data->token_type.' '.$data->access_token);
            }
        }
        return $next($request);
    }
}
