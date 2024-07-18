<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use Illuminate\Support\Facades\Storage;

$cant_paramns = 8;
$path = '';

for ($i=0; $i < $cant_paramns; $i++) { 
	$path .= '/{path'.$i.'?}';
}
Route::get('/documemt/{fileNumber}', function ($fileNumber) {
	$filePaths = [
        '1' => 'pdf/Preguntas-Cultura.pdf',
        '2' => 'pdf/Preguntas-Pandemia.pdf',
        '3' => 'pdf/Preguntas-Conflicto.pdf',
    ];
	$filePath = $filePaths[$fileNumber];
      return Storage::download($filePath);
});
Route::view($path, 'app');
Auth::routes();