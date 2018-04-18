<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Hash;

class RepartidorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todos los repartidores
        $repartidores = \App\Repartidor::with(['usuario' => function ($query){
                    $query->where('tipo_usuario', 3);
                }])->get();

        if(count($repartidores) == 0){
            return response()->json(['error'=>'No existen repartidores.'], 404);          
        }else{
            return response()->json(['repartidores'=>$repartidores], 200);
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
        if ( !$request->input('email') || !$request->input('password') ||
            !$request->input('nombre') || !$request->input('telefono') ||
            !$request->input('ciudad') || !$request->input('estado') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Faltan datos necesarios para el proceso de alta.'],422);
        } 
        
        $aux = \App\User::where('email', $request->input('email'))->get();
        if(count($aux)!=0){
            return response()->json(['error'=>'Ya existe un usuario con esas credenciales.'], 409);    
        }

        /*Primero creo una instancia en la tabla usuarios*/
        $usuario = new \App\User;
        $usuario->email = $request->input('email');
        $usuario->password = Hash::make($request->input('password'));
        $usuario->nombre = $request->input('nombre');
        $usuario->ciudad = $request->input('ciudad');
        $usuario->estado = $request->input('estado');
        $usuario->telefono = $request->input('telefono');
        //$usuario->imagen = $request->input('imagen');
        $usuario->tipo_usuario = 3;
        $usuario->tipo_registro = 1;
        //$usuario->id_facebook = $request->input('id_facebook');
        //$usuario->id_twitter = $request->input('id_twitter');
        //$usuario->id_instagram = $request->input('id_instagram');
        $usuario->validado = 1;

        if($usuario->save()){
            /*Segundo creo una instancia en la tabla repartidores*/
            $repartidor = new \App\Repartidor;
            $repartidor->estado = 'ON';
            $repartidor->activo = 2;
            $repartidor->ocupado = 2;
            $repartidor->usuario_id = $usuario->id; 
            $repartidor->save();

           return response()->json(['message'=>'Repartidor creado con éxito.', 'user_repartidor'=>$usuario], 200);
        }else{
            return response()->json(['error'=>'Error al crear el repartidor.'], 500);
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
        //cargar un repartidor
        $repartidor = \App\Repartidor::with('usuario')->find($id);

        if(count($repartidor)==0){
            return response()->json(['error'=>'No existe el repartidor con id '.$id], 404);          
        }else{

            return response()->json(['repartidor'=>$repartidor], 200);
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
        // Comprobamos si el repartidor que nos están pasando existe o no.
        $repartidor = \App\Repartidor::find($id);
        $usuario = \App\User::find($repartidor->usuario_id);

        if (count($repartidor)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el repartidor con id '.$id], 404);
        }      

        // Listado de campos recibidos teóricamente.
        $email=$request->input('email'); 
        $password=$request->input('password');  
        $nombre=$request->input('nombre');
        $ciudad = $request->input('ciudad');
        $estado = $request->input('estado');
        $telefono = $request->input('telefono');
        $imagen=$request->input('imagen');
        //$tipo_usuario=$request->input('tipo_usuario');
        //$tipo_registro=$request->input('tipo_registro');
        //$codigo_verificacion=$request->input('codigo_verificacion');
        //$validado=$request->input('validado');
        $lat=$request->input('lat');
        $lng=$request->input('lng');
        $rep_estado=$request->input('rep_estado');
        $activo=$request->input('activo');
        $ocupado=$request->input('ocupado');

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.
        if ($email != null && $email!='')
        {
            $aux = \App\User::where('email', $request->input('email'))
            ->where('id', '<>', $usuario->id)->get();

            if(count($aux)!=0){
               // Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'Ya existe otro usuario con ese email.'], 409);
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

            /*cargar los pedidos asociados al repartidor para actualizar la variable repartidor_nom*/
            $pedidos = \App\Pedido::where('repartidor_id',$repartidor->id)->get();

            for ($i=0; $i < count($pedidos) ; $i++) { 
                $pedidos[$i]->repartidor_nom = $nombre;
                $pedidos[$i]->save();
            }

            $usuario->nombre = $nombre;
            $bandera=true;
        }

        if ($ciudad != null && $ciudad!='')
        {
            $usuario->ciudad = $ciudad;
            $bandera=true;
        }

        if ($estado != null && $estado!='')
        {
            $usuario->estado = $estado;
            $bandera=true;
        }

        if ($telefono != null && $telefono!='')
        {
            $usuario->telefono = $telefono;
            $bandera=true;
        }

        if ($imagen != null && $imagen!='')
        {
            $usuario->imagen = $imagen;
            $bandera=true;
        }

        if ($lat != null && $lat!='')
        {
            $repartidor->lat = $lat;
            $bandera=true;
        }

        if ($lng != null && $lng!='')
        {
            $repartidor->lng = $lng;
            $bandera=true;
        }

        if ($rep_estado != null && $rep_estado!='')
        {
            $repartidor->estado = $rep_estado;
            $bandera=true;
        }

        if ($activo != null && $activo!='')
        {
            $repartidor->activo = $activo;
            $bandera=true;
        }

        if ($ocupado != null && $ocupado!='')
        {
            $repartidor->ocupado = $ocupado;
            $bandera=true;
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($repartidor->save() && $usuario->save()) {
                return response()->json(['message'=>'Repartidor actualizado con éxito.', 'repartidor'=>$repartidor], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar el repartidor.'], 500);
            }
        }
        else
        {
            // Se devuelve un array error con los error encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato del repartidor.'],409);
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
        // Comprobamos si el repartidor que nos están pasando existe o no.
        $repartidor=\App\Repartidor::find($id);

        if (count($repartidor)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el repartidor con id '.$id], 404);
        }

        $pedidos = $repartidor->pedidos;

        for ($i=0; $i < count($pedidos) ; $i++) {
            if ($pedidos[$i]->estado == 2 || $pedidos[$i]->estado == 3) {
                return response()->json(['error'=>'No se puede eliminar el repartidor porque posee pedidos en curso.'], 409);
             } 
        }

        for ($i=0; $i < count($pedidos) ; $i++) { 
            $pedidos[$i]->repartidor_id = null;
            $pedidos[$i]->save();
        }

        $usuario=\App\User::find($repartidor->usuario_id);

        // Eliminamos el repartidor.
        $repartidor->delete();

        // Eliminamos el usuario del repartidor.
        $usuario->delete();

        return response()->json(['message'=>'Se ha eliminado correctamente el repartidor.'], 200);
    }

    public function setPosicion(Request $request, $id)
    {
        // Comprobamos si el repartidor que nos están pasando existe o no.
        $repartidor = \App\Repartidor::find($id);

        if (count($repartidor)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el repartidor con id '.$id], 404);
        }      

        // Listado de campos recibidos teóricamente.
        $lat=$request->input('lat');
        $lng=$request->input('lng');

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.
        if ($lat != null && $lat!='')
        {
            $repartidor->lat = $lat;
            $bandera=true;
        }

        if ($lng != null && $lng!='')
        {
            $repartidor->lng = $lng;
            $bandera=true;
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($repartidor->save()) {
                return response()->json(['message'=>'ok.'], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar el repartidor.'], 500);
            }
        }
        else
        {
            // Se devuelve un array error con los error encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato del repartidor.'],409);
        }
    }

}
