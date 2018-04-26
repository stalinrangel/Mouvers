<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MsgClienteAdmin extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'msgs_cliente_admin';

    // Eloquent asume que cada tabla tiene una clave primaria con una columna llamada id.
    // Si éste no fuera el caso entonces hay que indicar cuál es nuestra clave primaria en la tabla:
    //protected $primaryKey = 'id';

    //public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['msg', 'emisor_id', 'receptor_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    // Relación de msgs_cliente_admin con usuarios (emisor):
	public function emisor()
	{
		// 1 msg pertenece a un usuario (emisor) de un msg
		return $this->belongsTo('App\User', 'emisor_id');
	}

	// Relación de msgs_cliente_admin con usuarios (receptor):
	public function receptor()
	{
		// 1 msg pertenece a un usuario (receptor) de un msg
		return $this->belongsTo('App\User', 'receptor_id');
	}


}
