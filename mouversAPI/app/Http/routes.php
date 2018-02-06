<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    //return view('welcome');
    
});

Route::group(  ['middleware' =>'cors'], function(){


    //----Pruebas LoginController
    Route::post('/login/web','LoginController@loginWeb');
    //Route::post('/login/app','LoginController@loginApp');
    //Route::post('/validar/token','LoginController@validarToken'); 

        //----Pruebas UsuarioController
        Route::get('/usuarios','UsuarioController@index');
        Route::post('/usuarios','UsuarioController@store');
        Route::put('/usuarios/{id}','UsuarioController@update');
        Route::delete('/usuarios/{id}','UsuarioController@destroy');
        Route::get('/usuarios/{id}','UsuarioController@show');


    Route::group(['middleware' => 'jwt-auth'], function(){



        

 

    });
});
