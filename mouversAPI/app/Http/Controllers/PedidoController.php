<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

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
        $pedidos = \App\Pedido::all();

        if(count($pedidos) == 0){
            return response()->json(['error'=>'No existen pedidos.'], 404);          
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
            !$request->input('costo') ||
            !$request->input('usuario_id') ||
            /*!$request->input('establecimiento_id') ||*/
            !$request->input('productos'))
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
            'costo'=>$request->input('costo'),
            'usuario_id'=>$request->input('usuario_id')
            /*'establecimiento_id'=>$request->input('establecimiento_id')*/
            ])){

            //Crear las relaciones en la tabla pivote
            for ($i=0; $i < count($productos) ; $i++) { 

                $nuevoPedido->productos()->attach($productos[$i]->producto_id, [
                    'cantidad' => $productos[$i]->cantidad,
                    'precio_unitario' => $productos[$i]->precio_unitario,
                    'observacion' => $productos[$i]->observacion]);
                   
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
            /*->with('establecimiento')*/->with('calificacion')->find($id);

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
        $costo=$request->input('costo');
        $repartidor_id=$request->input('repartidor_id');
        //$productos=$request->input('productos');

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

        if ($costo != null && $costo!='')
        {
            $pedido->costo = $costo;
            $bandera=true;
        }

        if ($repartidor_id != null && $repartidor_id!='')
        {
            // Comprobamos si el repartidor que nos están pasando existe o no.
            $repartidor=\App\Repartidor::find($repartidor_id);

            if (count($repartidor)==0)
            {
                // Devolvemos error codigo http 404
                return response()->json(['error'=>'No existe el repartidor que se quiere asociar al pedido.'], 404);
            }

            $pedido->repartidor_id = $repartidor_id;
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
}