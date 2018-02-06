<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
//use Illuminate\Support\Facades\DB;
use Hash;
use DB;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todos los usuarios
        $usuarios = \App\User::all();

        if(count($usuarios) == 0){
            return response()->json(['message'=>'No existen usuarios.'], 404);          
        }else{
            return response()->json(['usuarios'=>$usuarios], 200);
        } 
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Primero comprobaremos si estamos recibiendo todos los campos.
        if ( !$request->input('email') || !$request->input('nombre') ||
            !$request->input('tipo_usuario') || !$request->input('tipo_registro') )
        {
            // Se devuelve un array messages con los messagees encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['message'=>'Faltan datos necesarios para el proceso de alta.'],422);
        } 
        
        $aux = \App\User::where('email', $request->input('email'))->get();
        if(count($aux)!=0){
           // Devolvemos un código 409 Conflict. 
            return response()->json(['message'=>'Ya existe un usuario con esas credenciales.'], 409);
        }

        /*Primero creo una instancia en la tabla usuarios*/
        $usuario = new \App\User;
        $usuario->email = $request->input('email');
        $usuario->password = Hash::make($request->input('password'));
        $usuario->nombre = $request->input('nombre');
        $usuario->imagen = $request->input('imagen');
        $usuario->tipo_usuario = $request->input('tipo_usuario');
        $usuario->tipo_registro = $request->input('tipo_registro');

        if($usuario->save()){
           return response()->json(['message'=>'Usuario creado con éxito.', 'usuario'=>$usuario], 200);
        }else{
            return response()->json(['message'=>'Error al crear el usuario.'], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //cargar un usuario
        $usuario = \App\User::find($id);

        if(count($usuario)==0){
            return response()->json(['message'=>'No existe el usuario con id '.$id], 404);          
        }else{

            return response()->json(['usuario'=>$usuario], 200);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Comprobamos si el usuario que nos están pasando existe o no.
        $usuario=\App\User::find($id);

        if (count($usuario)==0)
        {
            // Devolvemos message codigo http 404
            return response()->json(['message'=>'No existe el usuario con id '.$id], 404);
        }      

        // Listado de campos recibidos teóricamente.
        $email=$request->input('email'); 
        $password=$request->input('password');  
        $nombre=$request->input('nombre');
        $imagen=$request->input('imagen');
        $tipo_usuario=$request->input('tipo_usuario');
        $tipo_registro=$request->input('tipo_registro');
        //$codigo_verificacion=$request->input('codigo_verificacion');

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.
        if ($email != null && $email!='')
        {
            $aux = \App\User::where('email', $request->input('email'))
            ->where('id', '<>', $usuario->id)->get();

            if(count($aux)!=0){
               // Devolvemos un código 409 Conflict. 
                return response()->json(['message'=>'Ya existe otro usuario con ese email.'], 409);
            }

            $usuario->email = $email;
            $bandera=true;
        }

        if ($password != null && $password!='')
        {
            $usuario->password = Hash::make($request->input('password'));
            $bandera=true;
        }

        if ($nombre != null && $nombre!='')
        {
            $usuario->nombre = $nombre;
            $bandera=true;
        }

        if ($imagen != null && $imagen!='')
        {
            $usuario->imagen = $imagen;
            $bandera=true;
        }

        if ($tipo_usuario != null && $tipo_usuario!='')
        {
            $usuario->tipo_usuario = $tipo_usuario;
            $bandera=true;
        }

        if ($tipo_registro != null && $tipo_registro!='')
        {
            $usuario->tipo_registro = $tipo_registro;
            $bandera=true;
        }


        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($usuario->save()) {
                return response()->json(['message'=>'Usuario actualizado con éxito.', 'usuario'=>$usuario], 200);
            }else{
                return response()->json(['message'=>'Error al actualizar el usuario.'], 500);
            }
            
        }
        else
        {
            // Se devuelve un array messages con los messagees encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['message'=>'No se ha modificado ningún dato del usuario.'],409);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // Comprobamos si el usuario que nos están pasando existe o no.
        $usuario=\App\User::find($id);

        if (count($usuario)==0)
        {
            // Devolvemos message codigo http 404
            return response()->json(['message'=>'No existe el usuario con id '.$id], 404);
        }

        // Eliminamos el usuario.
        $usuario->delete();

        return response()->json(['message'=>'Se ha eliminado correctamente el usuario.'], 200);
    }
}
