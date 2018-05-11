<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use DB;
use Exception;

class NotificacionController extends Controller
{

    //Enviar notificacion a un dispositivo mediante su token_notificacion
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

    //Enviar notificacion a un dispositivo cliente mediante su token_notificacion
    public function enviarNotificacionCliente($token_notificacion, $msg, $pedido_id = 'null')
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://mouvers.mx/onesignalclientes.php?contenido=".$msg."&token_notificacion=".$token_notificacion."&pedido_id=".$pedido_id);
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

    /*Localiza los repartidores disponibles para notificarles
    que hay un nuevo pedido*/
    public function localizarRepartidores(Request $request, $id, $intento=1)
    {
        //cargar un pedido y el el punto en la ruta del establecimineto mas lejano
        $pedido = \App\Pedido::with(['ruta' => function ($query){
                    $query->where('posicion', 1);
                }])->find($id);

        if(count($pedido)==0){

            return response()->json(['error'=>'No existe el pedido con id '.$id], 404);   

        }else{

            if ($pedido->estado_pago == null || $pedido->estado_pago == 'declinado') {
                return response()->json(['error'=>'Para poder asignar un repartidor el pedido debe tener un pago registrado.'],409);
            }

            $usuario = \App\User::select('token_notificacion')->find($pedido->usuario_id);

            set_time_limit(500);

            //cargar todos los repartidores en ON, Trabajando y Disponibles
            $repartidores = \App\Repartidor::with('usuario')
                    ->where('estado', 'ON')
                    ->where('activo', 1)
                    ->where('ocupado', 2)
                    ->get();

            if(count($repartidores) == 0){
                //Enviar notificacion al cliente (pedido no asignado)
                if ($usuario->token_notificacion) {
                    $this->enviarNotificacionCliente($usuario->token_notificacion, 'No%20hay%20repartidores%20disponibles.');
                }

                return response()->json(['error'=>'No hay repartidores disponibles.'], 404);          
            }

            //Calcular distancia(km) aproximada de los repartidores al establecimiento
            for ($i=0; $i < count($repartidores) ; $i++) { 
                $repartidores[$i]->distancia_calculada = $this->haversine($repartidores[$i]->lat, $repartidores[$i]->lng, $pedido->ruta[0]->lat, $pedido->ruta[0]->lng);
            }

            if (count($repartidores) > 1) {
                //Ordenar los repartidores de menor a mayor por distancia aproximada
                for ($i=0; $i < count($repartidores)-1 ; $i++) { 
                    for ($j=$i+1; $j < count($repartidores); $j++) { 
                        if ($repartidores[$i]->distancia_calculada > $repartidores[$j]->distancia_calculada) {
                            $aux = $repartidores[$i];
                            $repartidores[$i] = $repartidores[$j];
                            $repartidores[$j] = $aux; 
                        }
                    }
                }

                //Calcular distancia(m) real de los repartidores al establecimiento
                //destino
                $coordsEstablecimiento = $pedido->ruta[0]->lat.','.$pedido->ruta[0]->lng;

                $repSeleccionados = [];

                for ($i=0; $i < count($repartidores) ; $i++) { 
                    
                    //origen
                    $coordsRepartidor = $repartidores[$i]->lat.','.$repartidores[$i]->lng;

                    $distancia = $this->googleMaps($coordsRepartidor, $coordsEstablecimiento);
                    if ($distancia) {
                        $repartidores[$i]->distancia_real = $distancia;

                        array_push($repSeleccionados, $repartidores[$i]);
                    }else{
                        /*Si google maps no pudo calcular la distancia real,
                        se asume como distancia real la distancia calculada en metros*/
                        $repartidores[$i]->distancia_real = $repartidores[$i]->distancia_calculada * 1000;

                        array_push($repSeleccionados, $repartidores[$i]);
                    }

                    //Seleccionar solo 5 repartidores
                    if ($i == 4) {
                        break;
                    }   
                }

                //Ordenar los repartidores seleccionados de menor a mayor por distancia real
                for ($i=0; $i < count($repSeleccionados)-1 ; $i++) { 
                    for ($j=$i+1; $j < count($repSeleccionados); $j++) { 
                        if ($repSeleccionados[$i]->distancia_real > $repSeleccionados[$j]->distancia_real) {
                            $aux = $repSeleccionados[$i];
                            $repSeleccionados[$i] = $repSeleccionados[$j];
                            $repSeleccionados[$j] = $aux; 
                        }
                    }
                }

                $bandera = false; 

                //Enviar notificacion a los repartidores seleccionados
                for ($i=0; $i < count($repSeleccionados); $i++) { 
                    //Enviar notificacion a repartidor de pedido pendiente
                    if ($repSeleccionados[$i]->usuario->token_notificacion) {
                        $this->enviarNotificacion($repSeleccionados[$i]->usuario->token_notificacion, 'Tienes%20un%20nuevo%20pedido.', $pedido->id, 1);
                    }

                    //esperar
                    sleep(30);

                    //verificar
                    $pedidoAux = \App\Pedido::select('estado', 'repartidor_id')->find($id);
                    if ($pedidoAux->repartidor_id) {
                        //Enviar notificacion al cliente (pedido asignado)
                        if ($usuario->token_notificacion) {
                            $this->enviarNotificacionCliente($usuario->token_notificacion, 'Tu%20pedido%20va%20en%20camino.', $pedido->id);
                        }

                        $bandera = true;

                        //break;

                        return response()->json(['message'=>'Tu pedido va en camino.'], 200);

                    }
                }

                if (!$bandera) {
                    //Enviar notificacion al cliente (pedido no asignado)
                    if ($usuario->token_notificacion) {
                        $this->enviarNotificacionCliente($usuario->token_notificacion, 'No%20hay%20repartidores%20disponibles.', $pedido->id);
                    }

                    return response()->json(['error'=>'No hay repartidores disponibles.'], 404);
                }

            }else{
                $bandera = false; 

                //Enviar notificacion a unico repartidor disponible
                if ($repartidores[0]->usuario->token_notificacion) {
                    $this->enviarNotificacion($repartidores[0]->usuario->token_notificacion, 'Tienes%20un%20nuevo%20pedido.', $pedido->id, 1);
                }

                //esperar
                sleep(30);

                //verificar
                $pedidoAux = \App\Pedido::select('estado', 'repartidor_id')->find($id);
                if ($pedidoAux->repartidor_id) {
                    //Enviar notificacion al cliente (pedido asignado)
                    if ($usuario->token_notificacion) {
                        $this->enviarNotificacionCliente($usuario->token_notificacion, 'Tu%20pedido%20va%20en%20camino.', $pedido->id);
                    }

                    $bandera = true;

                    return response()->json(['message'=>'Tu pedido va en camino.'], 200);
                }

                /*$intento = $intento + 1;
                if ($intento <= 2) {
                    $this->localizarRepartidores($request, $id, $intento);
                }*/

                if (!$bandera) {
                    //Enviar notificacion al cliente (pedido no asignado)
                    if ($usuario->token_notificacion) {
                        $this->enviarNotificacionCliente($usuario->token_notificacion, 'No%20hay%20repartidores%20disponibles.', $pedido->id);
                    }

                    return response()->json(['error'=>'No hay repartidores disponibles.'], 404);
                }
            }
            

            //return response()->json(['repSeleccionados'=>$repSeleccionados, 'repartidores'=>$repartidores], 200);
            return response()->json(['error'=>'Pedido no asignado!'], 500);
        }

    }

    //Calculo de distancia real entre dos coordenadas con google maps
    public function googleMaps($origen, $destino)
    {
        try{ 
            $response = null;
            $response = \GoogleMaps::load('directions')
                ->setParam([
                    'origin'          => [$origen], 
                    'destination'     => [$destino], 
                ])->get();

            //dd( $response );  
            $response = json_decode( $response );

            if ( property_exists($response, 'status')) {
                if ($response->status == 'OK') {

                    //Distancia en metros
                    $distance_value=$response->routes[0]->legs[0]->distance->value;

                    return $distance_value;

                } 
            }

        } catch (Exception $e) {
            return null;
        }

        return null;
    }

    //Peticion a google maps con coordenadas por defecto para pruebas
    public function googleMaps2()
    {
        try {

            $destino = "8.625395,-71.14731"; //destino
            $origen = '8.628430,-71.14147'; //origen

            $response = null;
            $response = \GoogleMaps::load('directions')
                ->setParam([
                    'origin'          => [$origen], 
                    'destination'     => [$destino], 
                ])->get();

            //dd( $response );  
            $response = json_decode( $response );

            if ( property_exists($response, 'status')) {
                if ($response->status == 'OK') {

                    //Distancia en metros
                    $distance_value=$response->routes[0]->legs[0]->distance->value;

                } 
            }

            return response()->json(['response'=>$response], 200);
            
        } catch (Exception $e) {

            return response()->json(['Error'=>'Exception capturada', 'response'=>$response], 500);
            
        }
        
    }

    //Calculo de distancia entre dos puntos geograficos
    public function haversine($point1_lat, $point1_lng, $point2_lat, $point2_lng, $decimals = 4  )
    {
        //calculo de la distancia en grados
        $degrees = rad2deg(acos((sin(deg2rad($point1_lat))*sin(deg2rad($point2_lat))) + (cos(deg2rad($point1_lat))*cos(deg2rad($point2_lat))*cos(deg2rad($point1_lng-$point2_lng)))));

        //conversion de la distancia a kilometros
        $distance = $degrees * 111.13384; // 1 grado = 111.13384, basandose en el diametro promedio de la tierra (12.735 km)

        return round($distance, $decimals);
    }


    /*Asignar un pedido a un repartidor $repartidor_id*/
    public function asignarPedido(Request $request, $repartidor_id)
    {
        // Comprobamos si el repartidor que nos están pasando existe o no.
        $repartidor = \App\Repartidor::with('usuario')->find($repartidor_id);

        if (count($repartidor)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el repartidor con id '.$repartidor_id], 404);
        }      

        // Listado de campos recibidos teóricamente.
        $pedido_id=$request->input('pedido_id');

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;
        $notificarCliente = false;
        $notificarRepAntiguo = false;


        // Actualización parcial de campos.
        if ($pedido_id != null && $pedido_id!='')
        {
            // Comprobamos si el pedido que nos están pasando existe o no.
            $pedido = \App\Pedido::with('usuario')->find($pedido_id);

            if (count($pedido)==0)
            {
                // Devolvemos error codigo http 404
                return response()->json(['error'=>'No existe el pedido con id '.$pedido_id], 404);
            }

            if ($pedido->estado_pago == null || $pedido->estado_pago == 'declinado') {
                return response()->json(['error'=>'Para poder asignar un repartidor el pedido debe tener un pago registrado.'],409);
            }

            if ($pedido->estado == 4) {
                return response()->json(['error'=>'Este pedido ya está marcado como finalizado.'],409);
            }

            if ($pedido->repartidor_id != null) {

                $rep = \App\Repartidor::with('usuario')->find($pedido->repartidor_id);

                if ($rep)
                {
                    //Se cambia a desocupado
                    $rep->ocupado = 2;
                    $rep->save();

                    $notificarRepAntiguo = true;
                }
            }else{
                $notificarCliente = true;
            }

            $pedido->repartidor_id = $repartidor->id;
            $pedido->repartidor_nom = $repartidor->usuario->nombre;
            $pedido->estado = 2;
            $bandera=true;
        }

        $repartidor->ocupado = 1;

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($pedido->save() && $repartidor->save()) {

                //Enviar notificacion al repartidor (nuevo pedido asignado)
                if ($repartidor->usuario->token_notificacion) {
                    $this->enviarNotificacion($repartidor->usuario->token_notificacion, 'Se%20te%20ha%20asignado%20un%20pedido.', $pedido->id);
                }

                if ($notificarCliente) {
                    //Enviar notificacion al cliente (pedido asignado)
                    if ($pedido->usuario->token_notificacion) {
                        $this->enviarNotificacionCliente($pedido->usuario->token_notificacion, 'Tu%20pedido%20va%20en%20camino.', $pedido->id);
                    }
                }

                if ($notificarRepAntiguo) {
                    //Enviar notificacion al repartidor que se le quita el pedido
                    if ($rep->usuario->token_notificacion) {
                        $this->enviarNotificacion($rep->usuario->token_notificacion, 'Se%20te%20ha%20eliminado%20un%20pedido.', $pedido->id);
                    }
                }

                return response()->json(['message'=>'Pedido asignado.', 'pedido'=>$pedido, 'repartidor'=>$repartidor], 200);

            }else{
                return response()->json(['error'=>'Error al asignar el pedido.'], 500);
            }
        }
        else
        {
            // Se devuelve un array error con los error encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato.'],409);
        }
    }

    /*Notificar a un cliente la visita de un establecimiento*/
    public function notificarVisita(Request $request)
    {
        DB::table('rutas')
            ->where('id', $request->input('id'))
            ->update(['estado' => 2]);

        if ($request->input('token_notificacion') != '' && $request->input('token_notificacion') != null) {
            
            $explode1 = explode(" ",$request->input('nombre_establecimiento'));
            $nomEst = null;
            for ($i=0; $i < count($explode1); $i++) { 
                $nomEst = $nomEst.$explode1[$i].'%20'; 
            }

            $this->enviarNotificacionCliente($request->input('token_notificacion'), 'El%20repartidor%20ha%20visitado%20el%20establecimiento%20'.$nomEst, 'null');

        }

        return response()->json(['message'=>'Cliente notificado.'], 200);
    }


}
