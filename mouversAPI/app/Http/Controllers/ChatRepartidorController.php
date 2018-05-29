<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use DB;

class ChatRepartidorController extends Controller
{
    //Enviar notificacion a un dispositivo repartidor/panel mediante su token_notificacion
    public function enviarNotificacion($token_notificacion, $msg, $pedido_id = 'null', $accion = 0)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://mouvers.mx/onesignal.php?contenido=".$msg."&token_notificacion=".$token_notificacion."&pedido_id=".$pedido_id."&accion=".$accion);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
            'Authorization: Basic YmEwZDMwMDMtODY0YS00ZTYxLTk1MjYtMGI3Nzk3N2Q1YzNi'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_POST, TRUE);
        ///curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

        $response = curl_exec($ch);
        curl_close($ch);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todos los chats
        $chats = \App\ChatRepartidor::
            with(['usuario' => function ($query) {
                $query->select('id', 'nombre', 'imagen', 'tipo_usuario', 'token_notificacion');
            }])
            ->get();

        if(count($chats)!=0){
            //Cargar el ultimo mensaje
            for ($i=0; $i < count($chats) ; $i++) { 
                $chats[$i]->ultimo_msg = $chats[$i]
                    ->mensajes()
                    ->select('id', 'msg', 'created_at')
                    ->orderBy('id', 'desc')
                    ->take(1)->first(); 
            }          
        }

        return response()->json(['chats'=>$chats], 200);
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
        if ( !$request->input('admin_id') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro admin_id.'],422);
        }
        if ( !$request->input('usuario_id') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro usuario_id.'],422);
        }
        // Primero comprobaremos si estamos recibiendo todos los campos.
        if ( !$request->input('msg') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro msg.'],422);
        }
        if ( !$request->input('emisor') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro emisor.'],422);
        }
        if ( !$request->input('token_notificacion') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro token_notificacion.'],422);
        }

        //Verificar si existe un chat entre el admin y el repartidor
        $auxChat = \App\ChatRepartidor::where('admin_id', $request->input('admin_id'))
            ->where('usuario_id', $request->input('usuario_id'))->get();

        //Actualizar el chat con el mensaje
        if(count($auxChat)!=0){

           if ($request->input('emisor') == 'admin') {

               $msg = $auxChat[0]->mensajes()->create([
                    'msg' => $request->input('msg'),
                    'emisor_id' => $auxChat[0]->admin_id,
                    'receptor_id' => $auxChat[0]->usuario_id,
                ]);

               if ($request->input('token_notificacion') != '' && $request->input('token_notificacion') != null) {
            
                    $explode1 = explode(" ",$request->input('msg'));
                    $auxMsg = null;
                    for ($i=0; $i < count($explode1); $i++) { 
                        $auxMsg = $auxMsg.$explode1[$i].'%20'; 
                    }

                    $this->enviarNotificacion($request->input('token_notificacion'), 'Nuevo%20mensaje:%20'.$auxMsg, 'null', 3);

                }

           }else if ($request->input('emisor') == 'repartidor') {

               $msg = $auxChat[0]->mensajes()->create([
                    'msg' => $request->input('msg'),
                    'emisor_id' => $auxChat[0]->usuario_id,
                    'receptor_id' => $auxChat[0]->admin_id,
                ]);

               if ($request->input('token_notificacion') != '' && $request->input('token_notificacion') != null) {
            
                    $explode1 = explode(" ",$request->input('msg'));
                    $auxMsg = null;
                    for ($i=0; $i < count($explode1); $i++) { 
                        $auxMsg = $auxMsg.$explode1[$i].'%20'; 
                    }

                    $this->enviarNotificacion($request->input('token_notificacion'), 'Nuevo%20mensaje:%20'.$auxMsg, 'null', 3);

                }
           }

           return response()->json(['message'=>'Mensaje enviado con éxito.',
             'chat'=>$auxChat[0], 'msg'=>$msg], 200);
        }
        //Crear un nuevo chat
        else{

            if($chat=\App\ChatRepartidor::create($request->all())){

                if ($request->input('emisor') == 'admin') {

                   $msg = $chat->mensajes()->create([
                        'msg' => $request->input('msg'),
                        'emisor_id' => $chat->admin_id,
                        'receptor_id' => $chat->usuario_id,
                    ]);

                   if ($request->input('token_notificacion') != '' && $request->input('token_notificacion') != null) {

                        $explode1 = explode(" ",$request->input('msg'));
                        $auxMsg = null;
                        for ($i=0; $i < count($explode1); $i++) { 
                            $auxMsg = $auxMsg.$explode1[$i].'%20'; 
                        }

                        $this->enviarNotificacion($request->input('token_notificacion'), 'Nuevo%20mensaje:%20'.$auxMsg, 'null', 3);

                    }

                }else if ($request->input('emisor') == 'repartidor') {

                   $msg = $chat->mensajes()->create([
                        'msg' => $request->input('msg'),
                        'emisor_id' => $chat->usuario_id,
                        'receptor_id' => $chat->admin_id,
                    ]);

                   if ($request->input('token_notificacion') != '' && $request->input('token_notificacion') != null) {

                        $explode1 = explode(" ",$request->input('msg'));
                        $auxMsg = null;
                        for ($i=0; $i < count($explode1); $i++) { 
                            $auxMsg = $auxMsg.$explode1[$i].'%20'; 
                        }

                        $this->enviarNotificacion($request->input('token_notificacion'), 'Nuevo%20mensaje:%20'.$auxMsg, 'null', 3);

                    }
                }

               return response()->json(['message'=>'Mensaje enviado con éxito.',
                 'chat'=>$chat, 'msg'=>$msg], 200);
            }else{
                return response()->json(['error'=>'Error al crear el chat.'], 500);
            }
        }
    }

    /*crear un mesage asociado a un chat*/
    public function storeMsg(Request $request)
    {
        // Primero comprobaremos si estamos recibiendo todos los campos.
        if ( !$request->input('emisor_id') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro emisor_id.'],422);
        }
        if ( !$request->input('receptor_id') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro receptor_id.'],422);
        }
        if ( !$request->input('msg') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro msg.'],422);
        }
        if ( !$request->input('emisor') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro emisor.'],422);
        }
        if ( !$request->input('token_notificacion') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro token_notificacion.'],422);
        }

        //Verificar si existe un chat entre el admin y el repartidor
        if ($request->input('chat_id') != null && $request->input('chat_id') != '') {
            $chat = \App\ChatRepartidor::find($request->input('chat_id'));
            $bandera = false;
        }
        else{
            $chat = \App\ChatRepartidor::
                where(function ($query) use ($request) {
                    $query->where('admin_id', $request->input('emisor_id'))
                          ->where('usuario_id', $request->input('receptor_id'));
                })
                ->orWhere(function ($query) use ($request) {
                    $query->where('admin_id', $request->input('receptor_id'))
                          ->where('usuario_id', $request->input('emisor_id'));
                })
                ->get();

                $bandera = true;
        }

        
        if(count($chat)==0){

            //Crear el nuevo chat
            if ($request->input('emisor') == 'admin') {

                $chat=\App\ChatRepartidor::create([
                        'admin_id' => $request->input('emisor_id'),
                        'usuario_id' => $request->input('receptor_id'),
                    ]);

            }else if ($request->input('emisor') == 'repartidor') {

                $chat=\App\ChatRepartidor::create([
                        'admin_id' => $request->input('receptor_id'),
                        'usuario_id' => $request->input('emisor_id'),
                    ]);
            }

            //Crear el mensaje asociado al nuevo chat
            if ($request->input('emisor') == 'admin') {

               $msg = $chat->mensajes()->create([
                    'msg' => $request->input('msg'),
                    'emisor_id' => $chat->admin_id,
                    'receptor_id' => $chat->usuario_id,
                ]);

               if ($request->input('token_notificacion') != '' && $request->input('token_notificacion') != null) {

                    $explode1 = explode(" ",$request->input('msg'));
                    $auxMsg = null;
                    for ($i=0; $i < count($explode1); $i++) { 
                        $auxMsg = $auxMsg.$explode1[$i].'%20'; 
                    }

                    $this->enviarNotificacion($request->input('token_notificacion'), 'Nuevo%20mensaje:%20'.$auxMsg, 'null', 3);

                }

            }else if ($request->input('emisor') == 'repartidor') {

               $msg = $chat->mensajes()->create([
                    'msg' => $request->input('msg'),
                    'emisor_id' => $chat->usuario_id,
                    'receptor_id' => $chat->admin_id,
                ]);

               if ($request->input('token_notificacion') != '' && $request->input('token_notificacion') != null) {

                    $explode1 = explode(" ",$request->input('msg'));
                    $auxMsg = null;
                    for ($i=0; $i < count($explode1); $i++) { 
                        $auxMsg = $auxMsg.$explode1[$i].'%20'; 
                    }

                    $this->enviarNotificacion($request->input('token_notificacion'), 'Nuevo%20mensaje:%20'.$auxMsg, 'null', 3);

                }
            }

            //$msg->emisor = \App\User::select('id', 'nombre', 'imagen')->find($msg->emisor_id);

            return response()->json(['message'=>'Mensaje enviado con éxito.', 'chat'=>$chat, 'msg'=>$msg], 200);
        }
        //Crear el mensaje asociado al chat
        else{

            if ($bandera) {
                $chat = $chat[0];
            }

            if ($request->input('emisor') == 'admin') {

               $msg = $chat->mensajes()->create([
                    'msg' => $request->input('msg'),
                    'emisor_id' => $chat->admin_id,
                    'receptor_id' => $chat->usuario_id,
                ]);

               if ($request->input('token_notificacion') != '' && $request->input('token_notificacion') != null) {

                    $explode1 = explode(" ",$request->input('msg'));
                    $auxMsg = null;
                    for ($i=0; $i < count($explode1); $i++) { 
                        $auxMsg = $auxMsg.$explode1[$i].'%20'; 
                    }

                    $this->enviarNotificacion($request->input('token_notificacion'), 'Nuevo%20mensaje:%20'.$auxMsg, 'null', 3);

                }

            }else if ($request->input('emisor') == 'repartidor') {

               $msg = $chat->mensajes()->create([
                    'msg' => $request->input('msg'),
                    'emisor_id' => $chat->usuario_id,
                    'receptor_id' => $chat->admin_id,
                ]);

               if ($request->input('token_notificacion') != '' && $request->input('token_notificacion') != null) {

                    $explode1 = explode(" ",$request->input('msg'));
                    $auxMsg = null;
                    for ($i=0; $i < count($explode1); $i++) { 
                        $auxMsg = $auxMsg.$explode1[$i].'%20'; 
                    }

                    $this->enviarNotificacion($request->input('token_notificacion'), 'Nuevo%20mensaje:%20'.$auxMsg, 'null', 3);

                }
            }

            //$msg->emisor = \App\User::select('id', 'nombre', 'imagen')->find($msg->emisor_id);

           return response()->json(['message'=>'Mensaje enviado con éxito.',
             'chat'=>$chat, 'msg'=>$msg], 200);

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
        //cargar un chat
        $chat = \App\ChatRepartidor::
            with(['admin' => function ($query) {
                $query->select('id', 'nombre', 'imagen', 'tipo_usuario', 'token_notificacion');
            }])
            ->with(['usuario' => function ($query) {
                $query->select('id', 'nombre', 'imagen', 'tipo_usuario', 'token_notificacion');
            }])
            ->with(['mensajes.emisor' => function ($query) {
                $query->select('usuarios.id', 'usuarios.nombre', 'usuarios.imagen')->orderBy('id', 'asc');
            }])
            ->find($id);

        if(count($chat)==0){
            return response()->json(['error'=>'No existe el chat con id '.$id], 404);          
        }else{

            return response()->json(['chat'=>$chat], 200);
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // Comprobamos si el chat existe o no.
        $chat=\App\ChatRepartidor::find($id);

        if (count($chat)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el chat con id '.$id], 404);
        }
       
        $mensajes = $chat->mensajes;

        if (sizeof($mensajes) > 0)
        {
            for ($i=0; $i < count($mensajes) ; $i++) { 
                $mensajes[$i]->delete();
            }
        }

        // Eliminamos el chat.
        $chat->delete();

        return response()->json(['message'=>'Se ha eliminado correctamente el chat.'], 200);
    }

    /*Actualiza los mensajes de un receptor_id en un chat a leidos (estado=2)*/
    public function leerMensajes(Request $request)
    {
        DB::table('msgs_chats_repartidores')
                ->where('chat_id', $request->input('chat_id'))
                ->where('receptor_id', $request->input('receptor_id'))
                /*->where('emisor_id', $request->input('emisor_id'))*/
                ->where('estado', 1)
                ->update(['estado' => 2]);

        return response()->json(['status'=>'ok'], 200);
    }

    /*Retorna el chat de un repartidor*/
    public function miChat($usuario_id)
    {
        //Cargar el chat.
        $chat=\App\ChatRepartidor::where('usuario_id', $usuario_id)->get();

        if (count($chat)==0)
        {

            //Cargar los datos del admin
            $admin=\App\User::where('tipo_usuario', 1)
                ->select('id', 'nombre', 'imagen', 'tipo_usuario', 'token_notificacion')
                ->get();

            if (count($admin)==0) {
                // Devolvemos un código 409 Conflict.
                return response()->json(['Error'=>'No hay admis disponibles para iniciar un chat.'], 409);
            }
            else{
                // Devolvemos error codigo http 404
                return response()->json(['admin'=>$admin], 404); 
            }
            
        }

        return response()->json(['chat'=>$chat[0]], 200);
    }
}
