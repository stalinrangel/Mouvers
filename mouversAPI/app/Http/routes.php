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
    Route::post('/login/app','LoginController@loginApp');
    //Route::post('/validar/token','LoginController@validarToken');

    //----Pruebas PasswordController
    Route::get('/password/cliente/{correo}','PasswordController@generarCodigo');
    Route::get('/password/codigo/{codigo}','PasswordController@validarCodigo'); 

    Route::get('/productos/buscar/codigos','ProductoController@buscarCodigos');

        //----Pruebas UsuarioController
        Route::get('/usuarios','UsuarioController@index');
        Route::post('/usuarios','UsuarioController@store');
        Route::put('/usuarios/{id}','UsuarioController@update');
        Route::delete('/usuarios/{id}','UsuarioController@destroy');
        Route::get('/usuarios/{id}','UsuarioController@show');
        Route::get('/usuarios/validar/{email}','UsuarioController@validarCuenta');
        Route::get('/usuarios/email/validar/{email}','UsuarioController@emailDeValidacion');
        //Route::get('/usuarios/{id}/pedidos/historial','UsuarioController@misPedidosHistorial');
        //Route::get('/usuarios/{id}/pedidos/hoy','UsuarioController@misPedidosHoy');
        Route::get('/usuarios/{id}/pedidos/encurso','UsuarioController@misPedidosEncurso');
        Route::get('/usuarios/{id}/pedidos/finalizados','UsuarioController@misPedidosFinalizados');

        //----Pruebas CategoriaController
        Route::get('/categorias','CategoriaController@index');
        Route::get('/categorias/subcats/productos/establecimiento','CategoriaController@catsSubcatsProdsEst');
        Route::get('/categorias/habilitadas','CategoriaController@categoriasHabilitadas');
        Route::post('/categorias','CategoriaController@store');
        Route::put('/categorias/{id}','CategoriaController@update');
        Route::delete('/categorias/{id}','CategoriaController@destroy');
        Route::get('/categorias/{id}','CategoriaController@show');
        Route::get('/categorias/{id}/subcategorias','CategoriaController@categoriaSubcategorias');

        //----Pruebas EstablecimientoController
        Route::get('/establecimientos','EstablecimientoController@index');
        Route::get('/establecimientos/productos/subcategoria','EstablecimientoController@establecimientosProdsSubcat');
        Route::get('/establecimientos/habilitados','EstablecimientoController@stblcmtsHabilitados');
        Route::post('/establecimientos','EstablecimientoController@store');
        Route::put('/establecimientos/{id}','EstablecimientoController@update');
        Route::delete('/establecimientos/{id}','EstablecimientoController@destroy');
        Route::get('/establecimientos/{id}','EstablecimientoController@show');
        Route::get('/establecimientos/{id}/productos','EstablecimientoController@establecimientoProductos');

        //----Pruebas ProductoController
        Route::get('/productos','ProductoController@index');
        Route::get('/productos/subcategoria/establecimiento','ProductoController@productosSubcatEst');
        Route::post('/productos','ProductoController@store');
        Route::put('/productos/{id}','ProductoController@update');
        Route::delete('/productos/{id}','ProductoController@destroy');
        Route::get('/productos/{id}','ProductoController@show');

        //----Pruebas SubCategoriaController
        Route::get('/subcategorias','SubCategoriaController@index');
        Route::get('/subcategorias/productos/establecimiento','SubCategoriaController@subcatsProdsEst');
        Route::get('/subcategorias/habilitadas','SubCategoriaController@subcategoriasHabilitadas');
        Route::get('/subcategorias/categoria','SubCategoriaController@subcategoriasCategoria');
        Route::post('/subcategorias','SubCategoriaController@store');
        Route::put('/subcategorias/{id}','SubCategoriaController@update');
        Route::delete('/subcategorias/{id}','SubCategoriaController@destroy');
        Route::get('/subcategorias/{id}','SubCategoriaController@show');
        Route::get('/subcategorias/{id}/productos','SubCategoriaController@subcategoriaProductos');


        //----Pruebas PedidoController
        Route::get('/pedidos','PedidoController@index');
        Route::post('/pedidos','PedidoController@store');
        Route::put('/pedidos/{id}','PedidoController@update');
        Route::delete('/pedidos/{id}','PedidoController@destroy');
        Route::get('/pedidos/{id}','PedidoController@show');
        //Route::get('/pedidos/fecha/hoy','PedidoController@pedidosHoy');
        Route::get('/pedidos/estado/curso','PedidoController@pedidosEncurso');
        Route::get('/pedidos/estado/finalizados','PedidoController@pedidosFinalizados');


        //----Pruebas CalificacionController
        Route::get('/calificaciones','CalificacionController@index');
        Route::post('/calificaciones','CalificacionController@store');
        Route::put('/calificaciones/{id}','CalificacionController@update');
        Route::delete('/calificaciones/{id}','CalificacionController@destroy');
        Route::get('/calificaciones/{id}','CalificacionController@show');

        //----Pruebas UploadImagenController
        Route::post('/imagenes','UploadImagenController@store');

        //----Pruebas RepartidorController
        Route::get('/repartidores','RepartidorController@index');
        Route::post('/repartidores','RepartidorController@store');
        Route::put('/repartidores/{id}','RepartidorController@update');
        Route::delete('/repartidores/{id}','RepartidorController@destroy');
        Route::get('/repartidores/{id}','RepartidorController@show');

        //----Pruebas EntidadMunicipioController
        Route::get('/entidades/municipios','EntidadMunicipioController@index');


    Route::group(['middleware' => 'jwt-auth'], function(){



        

 

    });
});
