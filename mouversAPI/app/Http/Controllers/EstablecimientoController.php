<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class EstablecimientoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todas los establecimientos
        $establecimientos = \App\Establecimiento::all();

        if(count($establecimientos) == 0){
            return response()->json(['error'=>'No existen establecimientos.'], 404);          
        }else{
            return response()->json(['establecimientos'=>$establecimientos], 200);
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
        if ( !$request->input('nombre') ||
             !$request->input('estado') ||
             !$request->input('direccion'))
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para errores de validación.
            return response()->json(['error'=>'Faltan datos necesarios para el proceso de alta.'],422);
        } 
        
        $aux = \App\Establecimiento::where('nombre', $request->input('nombre'))->get();
        if(count($aux)!=0){
           // Devolvemos un código 409 Conflict. 
            return response()->json(['error'=>'Ya existe un establecimiento con ese nombre.'], 409);
        }

        /*Primero creo una instancia en la tabla establecimientos*/
        $nuevoEstablecimiento = new \App\Establecimiento;
        $nuevoEstablecimiento->nombre = $request->input('nombre');
        $nuevoEstablecimiento->direccion = $request->input('direccion');
        $nuevoEstablecimiento->lat = $request->input('lat');
        $nuevoEstablecimiento->lng = $request->input('lng');
        $nuevoEstablecimiento->estado = $request->input('estado');
        $nuevoEstablecimiento->num_pedidos = 0;

        if($nuevoEstablecimiento->save()){
           return response()->json(['message'=>'Establecimiento creado con éxito.',
             'establecimiento'=>$nuevoEstablecimiento], 200);
        }else{
            return response()->json(['error'=>'Error al crear el establecimiento.'], 500);
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
        //cargar un establecimiento
        $establecimiento = \App\Establecimiento::find($id);

        if(count($establecimiento)==0){
            return response()->json(['error'=>'No existe el establecimiento con id '.$id], 404);          
        }else{
            return response()->json(['establecimiento'=>$establecimiento], 200);
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
        // Comprobamos si el establecimiento que nos están pasando existe o no.
        $establecimiento=\App\Establecimiento::find($id);

        if (count($establecimiento)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el establecimiento con id '.$id], 404);
        }      

        // Listado de campos recibidos teóricamente.
        $nombre=$request->input('nombre');
        $direccion=$request->input('direccion');
        $lat=$request->input('lat');
        $lng=$request->input('lng');
        $num_pedidos=$request->input('num_pedidos');
        $estado=$request->input('estado');
        $productos=$request->input('productos');

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.
        if ($nombre != null && $nombre!='')
        {
            $aux = \App\Establecimiento::where('nombre', $request->input('nombre'))
            ->where('id', '<>', $establecimiento->id)->get();

            if(count($aux)!=0){
               // Devolvemos un código 409 Conflict. 
                return response()->json(['error'=>'Ya existe otro establecimiento con ese nombre.'], 409);
            }

            $establecimiento->nombre = $nombre;
            $bandera=true;
        }

        if ($direccion != null && $direccion!='')
        {
            $establecimiento->direccion = $direccion;
            $bandera=true;
        }

        if ($lat != null && $lat!='')
        {
            $establecimiento->lat = $lat;
            $bandera=true;
        }

        if ($lng != null && $lng!='')
        {
            $establecimiento->lng = $lng;
            $bandera=true;
        }

        if ($num_pedidos != null && $num_pedidos!='')
        {
            $establecimiento->num_pedidos = $num_pedidos;
            $bandera=true;
        }

        if ($estado != null && $estado!='')
        {
            if ($estado == 'OFF') {
                $productos = $establecimiento->productos;

                if (sizeof($productos) > 0)
                {
                    for ($i=0; $i < count($productos) ; $i++) { 
                        $productos[$i]->estado = $estado;
                        $productos[$i]->save();
                    }
                }
            }

            $establecimiento->estado = $estado;
            $bandera=true;
        }

        if (sizeof($productos) > 0 )
        {
            $bandera=true;

            $productos = json_decode($productos);
            for ($i=0; $i < count($productos) ; $i++) {

                if ($productos[$i]->estado == 'ON') {

                    $prod = \App\Producto::find($productos[$i]->id);

                    if(count($prod) == 0){
                       // Devolvemos un código 409 Conflict. 
                        return response()->json(['error'=>'No existe el producto con id '.$productos[$i]->id], 409);
                    }else{
                        $prod->estado = $productos[$i]->estado;
                        $prod->save();
                    }
                }  
            }
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($establecimiento->save()) {
                return response()->json(['message'=>'Establecimiento editado con éxito.',
                    'establecimiento'=>$establecimiento], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar el establecimiento.'], 500);
            }
            
        }
        else
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato al establecimiento.'],409);
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
        // Comprobamos si el establecimiento existe o no.
        $establecimiento=\App\Establecimiento::find($id);

        if (count($establecimiento)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el establecimiento con id '.$id], 404);
        }

        $productos = $establecimiento->productos;

        if (sizeof($productos) > 0)
        {
            //Verificar si los productos del establecimineto estan en pedidos
            for ($i=0; $i < count($productos); $i++) { 
                $productos[$i]->delete();

                $pedidos = $productos[$i]->pedidos;

                if (sizeof($pedidos) > 0)
                {
                    // Devolvemos un código 409 Conflict. 
                    return response()->json(['error'=>'Este establecimiento no puede ser eliminado porque su productos están asociados a pedidos.'], 409);
                }
            }
        }

        if (sizeof($productos) > 0)
        {
            //Eliminar los productos asociados al establecimiento
            for ($i=0; $i < count($productos); $i++) { 
                $productos[$i]->delete();
            }
        }

        // Eliminamos la establecimiento.
        $establecimiento->delete();

        return response()->json(['message'=>'Se ha eliminado correctamente el establecimiento.'], 200);
    }

    public function establecimientosProdsSubcat()
    {
        //cargar todos los establecimientos con sus productos y su categoria
        $establecimientos = \App\Establecimiento::with('productos.subcategoria')->get();

        if(count($establecimientos) == 0){
            return response()->json(['error'=>'No existen establecimientos.'], 404);          
        }else{
            return response()->json(['establecimientos'=>$establecimientos], 200);
        } 
    }

    //Usada en el panel
    public function stblcmtsHabilitados()
    {
        //cargar todos los establecimientos en estado ON
        $establecimientos = \App\Establecimiento::where('estado', 'ON')->get();

        if(count($establecimientos) == 0){
            return response()->json(['error'=>'No existen establecimientos habilitados.'], 404);          
        }else{
            return response()->json(['establecimientos'=>$establecimientos], 200);
        }   
    }

    /*Retorna productos del establecimiento.
    donde la subcat a la que pertenece el producto este ON*/
    public function establecimientoProductos($id)
    {
        $establecimiento = \App\Establecimiento::with('productos.subcategoria')->find($id);

        if(count($establecimiento)==0){
            return response()->json(['error'=>'No existe el establecimiento con id '.$id], 404);          
        }else{

            $aux = [];

            for ($i=0; $i < count($establecimiento->productos) ; $i++) { 
                if ($establecimiento->productos[$i]->subcategoria->estado == 'ON') {
                    array_push($aux, $establecimiento->productos[$i]);
                }
            }

            return response()->json(['productos'=>$aux], 200);
        } 
    }
}
