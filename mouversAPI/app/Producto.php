<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
	/**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'productos';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['nombre', 'precio', 'imagen', 'categoria_id', 'establecimiento_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['created_at','updated_at'];

    // Relación de producto con categoria:
    public function categoria()
    {
        // 1 producto pertenece a una categoria
        return $this->belongsTo('App\Categoria', 'categoria_id');
    }

    // Relación de producto con establecimiento:
    public function establecimiento()
    {
        // 1 producto pertenece a un establecimiento
        return $this->belongsTo('App\Establecimiento', 'establecimiento_id');
    }
}
