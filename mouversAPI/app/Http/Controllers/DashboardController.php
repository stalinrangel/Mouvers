<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use DB;

class DashboardController extends Controller
{

    /*Retorna los establecimientos con el
    contador de productos solicitados
    filtrados por fecha*/
    public function filterDiagram1(Request $request, \App\Pedido $pedido)
    {
        set_time_limit(300);

        $pedido = $pedido->newQuery();

        if ($request->has('dia')) {
            if ($request->input('dia') != 'null' && $request->input('dia') != null && $request->input('dia') != '') {

                $pedido->where(DB::raw('DAY(created_at)'),$request->input('dia'));
            }
        }

        if ($request->has('mes')) {
            if ($request->input('mes') != 'null' && $request->input('mes') != null && $request->input('mes') != '') {

                $pedido->where(DB::raw('MONTH(created_at)'),$request->input('mes'));
            }
        }

        if ($request->has('anio')) {
            if ($request->input('anio') != 'null' && $request->input('anio') != null && $request->input('anio') != '') {

                $pedido->where(DB::raw('YEAR(created_at)'),$request->input('anio'));
            }
        }

        //$pedidos = $pedido->get();

        $pedidos = $pedido->select('id', 'created_at')
            ->with(['productos' => function ($query) {
                $query->select('productos.id', 'productos.nombre', 'productos.establecimiento_id');
            }])
            ->get();

        //cargar todos los establecimientos
        $establecimientos = \App\Establecimiento::
            select('id', 'nombre', 'direccion')->get();

        if(count($establecimientos) == 0){
            return response()->json(['error'=>'No existen establecimientos.'], 404);          
        }else{

            for ($i=0; $i < count($establecimientos) ; $i++) { 
                $establecimientos[$i]->count_solicitados = 0;
                for ($j=0; $j < count($pedidos) ; $j++) { 
                    for ($k=0; $k < count($pedidos[$j]->productos) ; $k++) { 
                        if ($pedidos[$j]->productos[$k]->establecimiento_id == $establecimientos[$i]->id) {
                            $establecimientos[$i]->count_solicitados = $establecimientos[$i]->count_solicitados + 1; 
                        }
                    }
                }
            }

            //return $pedidos;
            return response()->json([/*'pedidos'=>$pedidos,*/ 'establecimientos'=>$establecimientos], 200);
            
        }
    }


    /*Retorna las subcategorias con el
    contador de  productos solicitados
    filtrados por fecha*/
    public function filterDiagram2(Request $request, \App\Pedido $pedido)
    {
        set_time_limit(300);

        $pedido = $pedido->newQuery();

        if ($request->has('dia')) {
            if ($request->input('dia') != 'null' && $request->input('dia') != null && $request->input('dia') != '') {

                $pedido->where(DB::raw('DAY(created_at)'),$request->input('dia'));
            }
        }

        if ($request->has('mes')) {
            if ($request->input('mes') != 'null' && $request->input('mes') != null && $request->input('mes') != '') {

                $pedido->where(DB::raw('MONTH(created_at)'),$request->input('mes'));
            }
        }

        if ($request->has('anio')) {
            if ($request->input('anio') != 'null' && $request->input('anio') != null && $request->input('anio') != '') {

                $pedido->where(DB::raw('YEAR(created_at)'),$request->input('anio'));
            }
        }

        //$pedidos = $pedido->get();

        $pedidos = $pedido->select('id', 'created_at')
            ->with(['productos' => function ($query) {
                $query->select('productos.id', 'productos.nombre', 'productos.subcategoria_id');
            }])
            ->get();

        //cargar todas las subcategorias
        $subcategorias = \App\Subcategoria::
            select('id', 'nombre')->get();

        if(count($subcategorias) == 0){
            return response()->json(['error'=>'No existen subcategorias.'], 404);          
        }else{

            for ($i=0; $i < count($subcategorias) ; $i++) { 
                $subcategorias[$i]->count_solicitados = 0;
                for ($j=0; $j < count($pedidos) ; $j++) { 
                    for ($k=0; $k < count($pedidos[$j]->productos) ; $k++) { 
                        if ($pedidos[$j]->productos[$k]->subcategoria_id == $subcategorias[$i]->id) {
                            $subcategorias[$i]->count_solicitados = $subcategorias[$i]->count_solicitados + 1; 
                        }
                    }
                }
            }

            //return $pedidos;
            return response()->json([/*'pedidos'=>$pedidos,*/ 'subcategorias'=>$subcategorias], 200);
            
        }
    }


    /*Retorna los productos con el
    contador de solicitados
    filtrados por fecha*/
    public function filterDiagram3(Request $request, \App\Pedido $pedido)
    {
        set_time_limit(300);

        $pedido = $pedido->newQuery();

        if ($request->has('dia')) {
            if ($request->input('dia') != 'null' && $request->input('dia') != null && $request->input('dia') != '') {

                $pedido->where(DB::raw('DAY(created_at)'),$request->input('dia'));
            }
        }

        if ($request->has('mes')) {
            if ($request->input('mes') != 'null' && $request->input('mes') != null && $request->input('mes') != '') {

                $pedido->where(DB::raw('MONTH(created_at)'),$request->input('mes'));
            }
        }

        if ($request->has('anio')) {
            if ($request->input('anio') != 'null' && $request->input('anio') != null && $request->input('anio') != '') {

                $pedido->where(DB::raw('YEAR(created_at)'),$request->input('anio'));
            }
        }

        //$pedidos = $pedido->get();

        $pedidos = $pedido->select('id', 'created_at')
            ->with(['productos' => function ($query) {
                $query->select('productos.id', 'productos.nombre', 'productos.subcategoria_id');
            }])
            ->get();

        //cargar todas las subcategorias
        $subcategorias = \App\Subcategoria::
            select('id', 'nombre')->get();

        if(count($subcategorias) == 0){
            return response()->json(['error'=>'No existen subcategorias.'], 404);          
        }else{

            for ($i=0; $i < count($subcategorias) ; $i++) { 
                $subcategorias[$i]->count_solicitados = 0;
                for ($j=0; $j < count($pedidos) ; $j++) { 
                    for ($k=0; $k < count($pedidos[$j]->productos) ; $k++) { 
                        if ($pedidos[$j]->productos[$k]->subcategoria_id == $subcategorias[$i]->id) {
                            $subcategorias[$i]->count_solicitados = $subcategorias[$i]->count_solicitados + 1; 
                        }
                    }
                }
            }

            //return $pedidos;
            return response()->json([/*'pedidos'=>$pedidos,*/ 'subcategorias'=>$subcategorias], 200);
            
        }
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
        //
    }
}
