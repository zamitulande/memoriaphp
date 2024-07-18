<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class RoleIs
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $role)
    {
        if(Auth::check() && Auth::user()->rol == $role)
            return $next($request);

        if($request->ajax())
            return response('Unauthorized.',401);

        return redirect('/');
    }
}
