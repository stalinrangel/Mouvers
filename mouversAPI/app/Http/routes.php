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
    Route::post('/login/repartidores','LoginController@loginRepartidores');
    //Route::post('/validar/token','LoginController@validarToken');

    //----Pruebas PasswordController
    Route::get('/password/cliente/{correo}','PasswordController@generarCodigo');
    Route::get('/password/codigo/{codigo}','PasswordController@validarCodigo'); 

    Route::get('/productos/buscar/codigos','ProductoController@buscarCodigos');

    //----Pruebas CoordenadasController
    Route::get('/coordenadas','CoordenadasController@index');

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
        Route::get('/repartidores/disponibles','RepartidorController@repDisponibles');
        Route::post('/repartidores','RepartidorController@store');
        Route::put('/repartidores/{id}','RepartidorController@update');
        Route::delete('/repartidores/{id}','RepartidorController@destroy');
        Route::get('/repartidores/{id}','RepartidorController@show');
        Route::post('/repartidores/{id}/set/posicion','RepartidorController@setPosicion');
        Route::put('/repartidores/{id}/aceptar/pedido','RepartidorController@aceptarPedido');
        Route::get('/repartidores/{id}/pedido/encurso','RepartidorController@miPedidoEnCurso');
        Route::get('/repartidores/{id}/historial/pedidos','RepartidorController@historialPedidos');

        //----Pruebas EntidadMunicipioController
        Route::get('/entidades/municipios','EntidadMunicipioController@index');

        //----Pruebas BlogController
        Route::get('/blogs','BlogController@index');
        Route::post('/blogs','BlogController@store');
        Route::put('/blogs/{id}','BlogController@update');
        Route::delete('/blogs/{id}','BlogController@destroy');
        Route::get('/blogs/{id}','BlogController@show');

        //----Pruebas MsgBlogController
        //Route::get('/mensajes/blogs','MsgBlogController@index');
        Route::post('/mensajes/blogs','MsgBlogController@store');
        Route::put('/mensajes/blogs/{id}','MsgBlogController@update');
        Route::delete('/mensajes/blogs/{id}','MsgBlogController@destroy');
        //Route::get('/mensajes/blogs/{id}','MsgBlogController@show');

        //----Pruebas MsgClienteAdminController
        Route::get('/mensajes/cliente','MsgClienteAdminController@index');
        Route::post('/mensajes/cliente','MsgClienteAdminController@store');
        //Route::put('/mensajes/cliente/{id}','MsgClienteAdminController@update');
        Route::delete('/mensajes/cliente/{id}','MsgClienteAdminController@destroy');
        //Route::get('/mensajes/cliente/{id}','MsgClienteAdminController@show');
        Route::get('/mensajes/cliente/chat/{cliente_id}','MsgClienteAdminController@miChat');
        Route::put('/mensajes/cliente/leer','MsgClienteAdminController@leerMensajes');

        //----Pruebas MsgRepAdminController
        Route::get('/mensajes/repartidor','MsgRepAdminController@index');
        Route::post('/mensajes/repartidor','MsgRepAdminController@store');
        //Route::put('/mensajes/repartidor/{id}','MsgRepAdminController@update');
        Route::delete('/mensajes/repartidor/{id}','MsgRepAdminController@destroy');
        //Route::get('/mensajes/repartidor/{id}','MsgRepAdminController@show');
        Route::get('/mensajes/repartidor/chat/{cliente_id}','MsgRepAdminController@miChat');
        Route::put('/mensajes/repartidor/leer','MsgRepAdminController@leerMensajes');

        //----Pruebas NotificacionController
        Route::get('/notificaciones/localizar/repartidores/pedido_id/{id}','NotificacionController@localizarRepartidores');
        Route::put('/notificaciones/{repartidor_id}/asignar/pedido','NotificacionController@asignarPedido');
        Route::post('/notificaciones/establecimiento/visitado','NotificacionController@notificarVisita');




    Route::group(['middleware' => 'jwt-auth'], function(){



        

 

    });
});
