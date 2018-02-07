<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
	/**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'categorias';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['nombre'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['created_at','updated_at'];

     // Relación de categoria con productos:
    public function productos()
    {
        // 1 categoria puede tener varios productos
        return $this->hasMany('App\Producto', 'categoria_id');
    }
}
