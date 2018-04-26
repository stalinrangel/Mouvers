<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use DB;
use Exception;

class PedidoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todos los pedidos
        $pedidos = \App\Pedido::with('usuario')
            ->with('repartidor')
            ->with('productos.establecimiento')
            ->orderBy('id', 'desc')
            ->get();

        if(count($pedidos) == 0){
            return response()->json(['error'=>'No existen pedidos en el historial.'], 404);          
        }else{
            return response()->json(['pedidos'=>$pedidos], 200);
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
        // Primero comprobaremos si estamos recibiendo todos los campos obligatorios.
        if (!$request->input('lat') ||
            !$request->input('lng') ||
            !$request->input('direccion') ||
            !$request->input('costo_envio') ||
            !$request->input('subtotal') ||
            !$request->input('costo') ||
            !$request->input('usuario_id') ||
            /*!$request->input('establecimiento_id') ||*/
            !$request->input('productos') ||
            !$request->input('ruta'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Faltan datos necesarios para el proceso de alta.'],422);
        }


        //validaciones
        $aux1 = \App\User::find($request->input('usuario_id'));
        if(count($aux1) == 0){
           // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'No existe el usuario al cual se quiere asociar el pedido.'], 409);
        } 

        /*$establecimiento = \App\Establecimiento::find($request->input('establecimiento_id'));
        if(count($establecimiento) == 0){
           // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'No existe el establecimiento al cual se quiere asociar el pedido.'], 409);
        }*/

        //Verificar que todos los productos del pedido existen
        $productos = json_decode($request->input('productos'));
        for ($i=0; $i < count($productos) ; $i++) { 
            $aux2 = \App\Producto::find($productos[$i]->producto_id);
            if(count($aux2) == 0){
               // Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'No existe el producto con id '.$productos[$i]->producto_id], 409);
            }   
        }    

        if(is_array($request->input('direccion'))){
            $dir = implode($request->input('direccion'));
        }else{
            $dir = $request->input('direccion');
        }

        if($nuevoPedido=\App\Pedido::create([
            'estado'=>1,
            'lat'=>$request->input('lat'),
            'lng'=>$request->input('lng'),
            'direccion'=>$dir, 
            'distancia'=>$request->input('distancia'), 
            'tiempo'=>$request->input('tiempo'),
            'costo_envio'=>$request->input('costo_envio'), 
            'subtotal'=>$request->input('subtotal'),
            'costo'=>$request->input('costo'),
            'usuario_id'=>$request->input('usuario_id'),
            /*'establecimiento_id'=>$request->input('establecimiento_id')*/
            'estado_pago'=>'Pendiente'
            ])){

            //Crear las relaciones en la tabla pivote
            for ($i=0; $i < count($productos) ; $i++) { 

                $nuevoPedido->productos()->attach($productos[$i]->producto_id, [
                    'cantidad' => $productos[$i]->cantidad,
                    'precio_unitario' => $productos[$i]->precio_unitario,
                    'observacion' => $productos[$i]->observacion]);
                   
            }

            //Registrar la ruta
            $ruta = json_decode($request->input('ruta'));
            for ($i=0; $i < count($ruta) ; $i++) { 
                   $nuevoPunto=\App\Ruta::create([
                        'pedido_id'=>$nuevoPedido->id,
                        'posicion'=>$ruta[$i]->posicion,
                        'estado'=>1,
                        'lat'=>$ruta[$i]->lat,
                        'lng'=>$ruta[$i]->lng
                    ]);
            }

            return response()->json(['pedido'=>$nuevoPedido, 'message'=>'Pedido creado con éxito.'], 200);
        }else{
            return response()->json(['error'=>'Error al crear el pedido.'], 500);
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
        //cargar un pedido
        $pedido = \App\Pedido::with('usuario')->with('productos.establecimiento')
            /*->with('establecimiento')*/->with('calificacion')
            ->with('ruta')->find($id);

        if(count($pedido)==0){
            return response()->json(['error'=>'No existe el pedido con id '.$id], 404);          
        }else{

            //$pedido->productos = $pedido->productos;
            return response()->json(['pedido'=>$pedido], 200);
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
                // Comprobamos si el pedido que nos están pasando existe o no.
        $pedido=\App\Pedido::find($id);

        if (count($pedido)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el pedido con id '.$id], 404);
        }      

        // Listado de campos recibidos teóricamente.
        $estado=$request->input('estado');
        $lat=$request->input('lat');
        $lng=$request->input('lng');
        $direccion=$request->input('direccion'); 
        $distancia=$request->input('distancia'); 
        $tiempo=$request->input('tiempo'); 
        $costo_envio=$request->input('costo_envio');
        $subtotal=$request->input('subtotal');
        $costo=$request->input('costo');
        $repartidor_id=$request->input('repartidor_id');
        //$productos=$request->input('productos');
        $estado_pago=$request->input('estado_pago');
        $api_tipo_pago=$request->input('api_tipo_pago');

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.
        if ($estado != null && $estado!='')
        {
            $pedido->estado = $estado;
            $bandera=true;
        }

        if ($lat != null && $lat!='')
        {
            $pedido->lat = $lat;
            $bandera=true;
        }

        if ($lng != null && $lng!='')
        {
            $pedido->lng = $lng;
            $bandera=true;
        }

        if ($direccion != null && $direccion!='')
        {
            $pedido->direccion = $direccion;
            $bandera=true;
        }

        if ($distancia != null && $distancia!='')
        {
            $pedido->distancia = $distancia;
            $bandera=true;
        }

        if ($tiempo != null && $tiempo!='')
        {
            $pedido->tiempo = $tiempo;
            $bandera=true;
        }

        if ($costo_envio != null && $costo_envio!='')
        {
            $pedido->costo_envio = $costo_envio;
            $bandera=true;
        }

        if ($subtotal != null && $subtotal!='')
        {
            $pedido->subtotal = $subtotal;
            $bandera=true;
        }

        if ($costo != null && $costo!='')
        {
            $pedido->costo = $costo;
            $bandera=true;
        }

        if ($repartidor_id != null && $repartidor_id!='')
        {
            // Comprobamos si el repartidor que nos están pasando existe o no.
            $repartidor=\App\Repartidor::with('usuario')->find($repartidor_id);

            if (count($repartidor)==0)
            {
                // Devolvemos error codigo http 404
                return response()->json(['error'=>'No existe el repartidor que se quiere asociar al pedido.'], 404);
            }

            $pedido->repartidor_id = $repartidor_id;
            $pedido->repartidor_nom = $repartidor->usuario->nombre;
            $bandera=true;
        }

        if ($estado_pago != null && $estado_pago!='')
        {
            $pedido->estado_pago = $estado_pago;
            $bandera=true;
        }

        if ($api_tipo_pago != null && $api_tipo_pago!='')
        {
            $pedido->api_tipo_pago = $api_tipo_pago;
            $bandera=true;
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($pedido->save()) {
                return response()->json(['pedido'=>$pedido , 'message'=>'Pedido actualizado con éxito.'], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar el pedido.'], 500);
            }
            
        }
        else
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato al pedido.'],409);
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
        // Comprobamos si el pedido que nos están pasando existe o no.
        $pedido=\App\Pedido::find($id);

        if (count($pedido)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el pedido con id '.$id], 404);
        } 
       
        //Eliminar las relaciones(productos) en la tabla pivote
        $pedido->productos()->detach();

        // Eliminamos el pedido.
        $pedido->delete();

        return response()->json(['message'=>'Se ha eliminado correctamente el pedido.'], 200);
    }

    public function pedidosHoy()
    {
        //cargar todos los pedidos de hoy
        $pedidos = \App\Pedido::with('usuario')
            ->with('repartidor')
            ->with('productos.establecimiento')
            ->where(DB::raw('DAY(created_at)'),DB::raw('DAY(now())'))
            ->where(DB::raw('MONTH(created_at)'),DB::raw('MONTH(now())'))
            ->where(DB::raw('YEAR(created_at)'),DB::raw('YEAR(now())'))
            ->orderBy('id', 'desc')
            ->get();

        if(count($pedidos) == 0){
            return response()->json(['error'=>'No existen pedidos para hoy.'], 404);          
        }else{
            return response()->json(['pedidos'=>$pedidos], 200);
        } 
    }

    public function pedidosEncurso()
    {
        //cargar todos los pedidos en curso (Estado 1, 2, 3)
        $pedidos = \App\Pedido::with('usuario')
            ->with('repartidor')
            ->with('productos.establecimiento')
            ->where('estado',1)
            ->orWhere('estado',2)
            ->orWhere('estado',3)
            ->orderBy('id', 'desc')
            ->get();

        if(count($pedidos) == 0){
            return response()->json(['error'=>'No existen pedidos en curso.'], 404);          
        }else{
            return response()->json(['pedidos'=>$pedidos], 200);
        } 
    }

    public function pedidosFinalizados()
    {
        //cargar todos los pedidos en curso (Estado 1, 2, 3)
        $pedidos = \App\Pedido::with('usuario')
            ->with('repartidor')
            ->with('productos.establecimiento')
            ->where('estado',4)
            ->orderBy('id', 'desc')
            ->get();

        if(count($pedidos) == 0){
            return response()->json(['error'=>'No existen pedidos finalizados.'], 404);          
        }else{
            return response()->json(['pedidos'=>$pedidos], 200);
        } 
    }

    public function localizarRepartidores(Request $request, $id)
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
}
