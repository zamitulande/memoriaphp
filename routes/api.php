<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login','ApiController@login');
Route::post('/logout','ApiController@logout');
Route::post('/forgot-password','ApiController@forgotPassword');
Route::post('/reset-password','ApiController@resetPassword');

Route::middleware('auth:api')->group(function(){
	Route::post('/change-password','ApiController@changePassword');
});

Route::prefix('v1')->group(function(){

    Route::prefix('user')->group(function(){
        Route::middleware('auth:api')->group(function(){
            Route::post('list', 'API\v1\UserController@list')->middleware('role_is:Administrador');
            Route::post('update/{user}', 'API\v1\UserController@update');
            Route::post('show/{user}', 'API\v1\UserController@show');
            Route::post('toggle-lock', 'API\v1\UserController@toggleLock')->middleware('role_is:Administrador');
            Route::get('annexed/{user}/{idAnnexed}', 'API\v1\UserController@annexed');
        });
     
        Route::post('register', 'API\v1\UserController@register');
        Route::post('account-activation', 'API\v1\UserController@accountActivation');
    });

	Route::prefix('query')->group(function(){
		Route::post('municipios','API\v1\QueryController@municipios');
        Route::post('departamentos','API\v1\QueryController@departamentos');
    });

    Route::prefix('storie_conflict')->group(function(){
        Route::middleware('auth:api')->group(function(){
            Route::post('register', 'API\v1\StorieConflictController@register');
        });
        Route::post('show/{storie_conflict}', 'API\v1\StorieConflictController@show');
        
        Route::post('list', 'API\v1\StorieConflictController@list');
        Route::post('update/{storie_conflict}', 'API\v1\StorieConflictController@update');
        Route::get('get-annexed/{historyConflictId}/{annexedId}', 'API\v1\StorieConflictController@getAnnexed');
    });

    Route::prefix('testimony')->group(function(){
        Route::middleware('auth:api')->group(function(){
            Route::post('register', 'API\v1\TestimonyController@register');
            Route::post('update/{testimony}', 'API\v1\TestimonyController@update');
        });
        Route::post('list/{isApiClient?}', 'API\v1\TestimonyController@list');
        Route::get('export', 'API\v1\TestimonyController@export');
        Route::get('annexed/{testimony}/{type}/{idAnnexed}', 'API\v1\TestimonyController@annexed');
    });

    Route::prefix('investigation_request')->group(function(){        
        Route::post('register', 'API\v1\InvestigationRequestController@register');
       
    });   

    Route::prefix('allies')->group(function(){
        Route::middleware('auth:api')->group(function(){
            Route::post('list', 'API\v1\AlliesController@list')->middleware('role_is:Administrador');
            Route::post('update/{solicitudesAliados}', 'API\v1\AlliesController@update')->middleware('role_is:Administrador'); 
            Route::post('listBitacoras/{solicitudesAliados}', 'API\v1\AlliesController@listBitacoras')->middleware('role_is:Administrador');           

        });
        Route::post('register', 'API\v1\AlliesController@register');
    });     

});
