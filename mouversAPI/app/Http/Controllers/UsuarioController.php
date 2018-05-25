<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
//use Illuminate\Support\Facades\DB;
use Hash;
use DB;
use Mail;
use Session;
use Redirect;

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
        $usuarios = \App\User::where('tipo_usuario', 2)->get();

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
            !$request->input('tipo_usuario') || !$request->input('tipo_registro') ||
            !$request->input('ciudad') || !$request->input('estado') || !$request->input('telefono') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Faltan datos necesarios para el proceso de alta.'],422);
        } 
        
        $aux = \App\User::where('email', $request->input('email'))->get();
        if(count($aux)!=0){

            if ($request->input('tipo_registro') == 1) {
                //Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'Ya existe un usuario con esas credenciales.'], 409);
            }else{

                $auxUser = $aux[0];
                $auxUser->email = $request->input('email');
                //$auxUser->password = Hash::make($request->input('password'));
                $auxUser->nombre = $request->input('nombre');
                $auxUser->ciudad = $request->input('ciudad');
                $auxUser->estado = $request->input('estado');
                $auxUser->telefono = $request->input('telefono');
                $auxUser->imagen = $request->input('imagen');
                $auxUser->tipo_usuario = $request->input('tipo_usuario');
                $auxUser->tipo_registro = $request->input('tipo_registro');
                $auxUser->validado = 1; //autovalidar el usuario

                if ($request->input('tipo_registro') == 2) {
                    $auxUser->id_facebook = $request->input('id_facebook');
                }else if ($request->input('tipo_registro') == 3) {
                    $auxUser->id_twitter = $request->input('id_twitter');
                }else if ($request->input('tipo_registro') == 4) {
                    $auxUser->id_instagram = $request->input('id_instagram');
                }
                
                // Almacenamos en la base de datos el registro.
                if ($auxUser->save()) {
                    return response()->json(['message'=>'Usuario actualizado con éxito.', 'usuario'=>$auxUser], 200);
                }else{
                    return response()->json(['error'=>'Error al actualizar el usuario.'], 500);
                }
                
                
            }
            
        }

        if ($request->input('tipo_registro') == 1) {
            $validado = 0;
        }else{
            $validado = 1;
        }

        /*Primero creo una instancia en la tabla usuarios*/
        $usuario = new \App\User;
        $usuario->email = $request->input('email');

        if ($request->input('password') != null && $request->input('password') != '')
        {
            $usuario->password = Hash::make($request->input('password'));
        }

        $usuario->nombre = $request->input('nombre');
        $usuario->ciudad = $request->input('ciudad');
        $usuario->estado = $request->input('estado');
        $usuario->telefono = $request->input('telefono');
        $usuario->imagen = $request->input('imagen');
        $usuario->tipo_usuario = $request->input('tipo_usuario');
        $usuario->tipo_registro = $request->input('tipo_registro');
        $usuario->id_facebook = $request->input('id_facebook');
        $usuario->id_twitter = $request->input('id_twitter');
        $usuario->id_instagram = $request->input('id_instagram');
        $usuario->validado = $validado;

        if($usuario->save()){

            //Si es un registro con normal con email y password enviar correo de verificacion
            if ($usuario->tipo_registro == 1) {
                $this->emailDeValidacion($usuario->email);
            }

           return response()->json(['message'=>'Usuario creado con éxito.', 'usuario'=>$usuario], 200);
        }else{
            return response()->json(['error'=>'Error al crear el usuario.'], 500);
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
            return response()->json(['error'=>'No existe el usuario con id '.$id], 404);          
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
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el usuario con id '.$id], 404);
        }      

        // Listado de campos recibidos teóricamente.
        $email=$request->input('email'); 
        $password=$request->input('password');  
        $nombre=$request->input('nombre');
        $ciudad = $request->input('ciudad');
        $estado = $request->input('estado');
        $telefono = $request->input('telefono');
        $imagen=$request->input('imagen');
        $tipo_usuario=$request->input('tipo_usuario');
        $tipo_registro=$request->input('tipo_registro');
        //$codigo_verificacion=$request->input('codigo_verificacion');
        $validado=$request->input('validado');

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

        if ($validado != null && $validado!='')
        {
            $usuario->validado = $validado;
            $bandera=true;
        }


        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($usuario->save()) {
                return response()->json(['message'=>'Usuario actualizado con éxito.', 'usuario'=>$usuario], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar el usuario.'], 500);
            }
            
        }
        else
        {
            // Se devuelve un array error con los error encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato del usuario.'],409);
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
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el usuario con id '.$id], 404);
        }

        $pedidos = $usuario->pedidos;

        if (sizeof($pedidos) > 0)
        {
            // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'Este usuario no puede ser eliminado porque posee pedidos asociados.'], 409);
        }

        // Eliminamos el usuario.
        $usuario->delete();

        return response()->json(['message'=>'Se ha eliminado correctamente el usuario.'], 200);
    }

    public function validarCuenta($email)
    {
        //cargar un usuario
        $usuario = \App\User::where('email', $email)->get();

        if(count($usuario)==0){
            return response()->view('validar_cuenta.404', [], 404);
            //return response()->json(['error'=>'No existe el usuario con email '.$email], 404);          
        }else{

            if ($usuario[0]->validado == 1) {
                return response()->view('validar_cuenta.200', [], 200);
                //return response()->json(['message'=>'Cuenta validada con éxito.'], 200);
            }

            $usuario[0]->validado = 1;

            if ($usuario[0]->save()) {
                return response()->view('validar_cuenta.200', [], 200);
                //return response()->json(['message'=>'Cuenta validada con éxito.'], 200);
            }else{
                return response()->view('validar_cuenta.500', [], 500);
                //return response()->json(['error'=>'Error al validar la cuenta.'], 500);
            }
        }
    }

    public function emailDeValidacion($email)
    {
        //$enlace = 'http://localhost/gitHub/Mouvers/mouversAPI/public/usuarios/validar/'.$email;

        $enlace = 'http://mouvers.mx/mouversAPI/public/usuarios/validar/'.$email;

        //return response()->view('emails.validar_cuenta', ['enlace' => $enlace], 200);

        $data = array( 'enlace' => $enlace);

        //Enviamos el correo con el enlace para validar
        Mail::send('emails.validar_cuenta', $data, function($msj) use ($email){
            $msj->subject('Validar cuenta Mouvers');
            $msj->from('info@mouvers.mx', 'mouvers');
            $msj->to($email);
        });
    }

    public function misPedidosHistorial($id)
    {
        // Comprobamos si el usuario que nos están pasando existe o no.
        $usuario=\App\User::find($id);

        if (count($usuario)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el usuario con id '.$id], 404);
        }

        //cargar todos los pedidos
        $pedidos = \App\Pedido::where('usuario_id', $id)
            ->with('productos.establecimiento')
            ->orderBy('id', 'desc')
            ->get();

        if(count($pedidos) == 0){
            return response()->json(['error'=>'No tienes pedidos registrados en historial.'], 404);          
        }else{
            return response()->json(['pedidos'=>$pedidos], 200);
        } 
    }

    public function misPedidosHoy($id)
    {
        // Comprobamos si el usuario que nos están pasando existe o no.
        $usuario=\App\User::find($id);

        if (count($usuario)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el usuario con id '.$id], 404);
        }

        //cargar los pedidos de hoy
        $pedidos = \App\Pedido::where('usuario_id', $usuario->id)
            ->where(DB::raw('DAY(created_at)'),DB::raw('DAY(now())'))
            ->where(DB::raw('MONTH(created_at)'),DB::raw('MONTH(now())'))
            ->where(DB::raw('YEAR(created_at)'),DB::raw('YEAR(now())'))
            ->with('productos.establecimiento')
            ->orderBy('id', 'desc')
            ->get();

        if(count($pedidos) == 0){
            return response()->json(['error'=>'No tienes pedidos registrados hoy.'], 404);          
        }else{
            return response()->json(['pedidos'=>$pedidos], 200);
        } 
    }

    public function misPedidosEncurso($id)
    {

        // Comprobamos si el usuario que nos están pasando existe o no.
        $usuario=\App\User::find($id);

        if (count($usuario)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el usuario con id '.$id], 404);
        }

        //cargar todos los pedidos en curso (Estado 1, 2, 3)
        $pedidos = \App\Pedido::with('productos.establecimiento')
            ->with('repartidor.usuario')
            ->where('usuario_id', $id)
            ->where(function ($query) {
                $query->where('estado',1)
                    ->orWhere('estado',2)
                    ->orWhere('estado',3);
            })
            ->orderBy('id', 'desc')
            ->get();

        if(count($pedidos) == 0){
            return response()->json(['error'=>'No tienes pedidos en curso.'], 404);          
        }else{
            return response()->json(['pedidos'=>$pedidos], 200);
        } 
    }

    public function misPedidosFinalizados($id)
    {

        // Comprobamos si el usuario que nos están pasando existe o no.
        $usuario=\App\User::find($id);

        if (count($usuario)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el usuario con id '.$id], 404);
        }

        //cargar todos los pedidos en curso (Estado 1, 2, 3)
        $pedidos = \App\Pedido::with('productos.establecimiento')
            ->with('repartidor.usuario')
            ->with('calificacion')
            ->where('usuario_id', $id)
            ->where('estado',4)
            ->orderBy('id', 'desc')
            ->get();

        if(count($pedidos) == 0){
            return response()->json(['error'=>'No tienes pedidos finalizados.'], 404);          
        }else{
            return response()->json(['pedidos'=>$pedidos], 200);
        } 
    }

    public function setTokenNotificaion(Request $request, $id)
    {
        // Comprobamos si el usuario que nos están pasando existe o no.
        $usuario=\App\User::find($id);

        if (count($usuario)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el usuario con id '.$id], 404);
        }

        $token_notificacion=$request->input('token_notificacion');

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.
        if ($token_notificacion != null && $token_notificacion!='')
        {
            $usuario->token_notificacion = $token_notificacion;
            $bandera=true;
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($usuario->save()) {
                return response()->json(['message'=>'Toke de notificación actualizado con éxito.', 'usuario'=>$usuario], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar el usuario.'], 500);
            }
            
        }
        else
        {
            // Se devuelve un array error con los error encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato del usuario.'],409);
        }
    }
}
