<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //cargar todos los blogs
        $blogs = \App\Blog::with('creador')->get();

        if(count($blogs) == 0){
            return response()->json(['error'=>'No existen blogs.'], 404);          
        }else{
            return response()->json(['blogs'=>$blogs], 200);
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
        if ( !$request->input('nombre_tema') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro nombre_tema (Nombre del blog).'],422);
        }
        if ( !$request->input('usuario_id') )
        {
            // Se devuelve un array error con los errors encontrados y cabecera HTTP 422 Unprocessable Entity – [Entidad improcesable] Utilizada para messagees de validación.
            return response()->json(['error'=>'Falta el parametro usuario_id (Creador del blog).'],422);
        }

        if($blog=\App\Blog::create($request->all())){
           return response()->json(['message'=>'Blog creado con éxito.',
             'blog'=>$blog], 200);
        }else{
            return response()->json(['error'=>'Error al crear el blog.'], 500);
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
        //cargar un blog
        $blog = \App\Blog::with('creador')->with('msgs.usuario')->find($id);

        if(count($blog)==0){
            return response()->json(['error'=>'No existe el blog con id '.$id], 404);          
        }else{

            return response()->json(['blog'=>$blog], 200);
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
        // Comprobamos si el blog que nos están pasando existe o no.
        $blog=\App\Blog::find($id);

        if (count($blog)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el blog con id '.$id], 404);
        }      

        // Listado de campos recibidos teóricamente.
        $nombre_tema=$request->input('nombre_tema');
        $usuario_id=$request->input('usuario_id');

        // Creamos una bandera para controlar si se ha modificado algún dato.
        $bandera = false;

        // Actualización parcial de campos.
        if ($nombre_tema != null && $nombre_tema!='')
        {
            $blog->nombre_tema = $nombre_tema;
            $bandera=true;
        }

        if ($usuario_id != null && $usuario_id!='')
        {
            $blog->usuario_id = $usuario_id;
            $bandera=true;
        }

        if ($bandera)
        {
            // Almacenamos en la base de datos el registro.
            if ($blog->save()) {
                return response()->json(['message'=>'Blog editado con éxito.',
                    'blog'=>$blog], 200);
            }else{
                return response()->json(['error'=>'Error al actualizar el blog.'], 500);
            }
            
        }
        else
        {
            // Se devuelve un array errors con los errores encontrados y cabecera HTTP 304 Not Modified – [No Modificada] Usado cuando el cacheo de encabezados HTTP está activo
            // Este código 304 no devuelve ningún body, así que si quisiéramos que se mostrara el mensaje usaríamos un código 200 en su lugar.
            return response()->json(['error'=>'No se ha modificado ningún dato al blog.'],409);
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
        // Comprobamos si el blog existe o no.
        $blog=\App\Blog::find($id);

        if (count($blog)==0)
        {
            // Devolvemos error codigo http 404
            return response()->json(['error'=>'No existe el blog con id '.$id], 404);
        }
       
        $msgs = $blog->msgs;

        if (sizeof($msgs) > 0)
        {
            for ($i=0; $i < count($msgs); $i++) { 
                $msgs[$i]->delete();
            }
        }

        // Eliminamos la blog si no tiene relaciones.
        $blog->delete();

        return response()->json(['message'=>'Se ha eliminado correctamente el blog.'], 200);
    }
}
