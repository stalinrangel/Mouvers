<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class PedidosMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('estado'); //1=pendiente 2=asignado 3=en camino 4=cancelado 5=entregado 6=pagado 
            $table->string('lat');
            $table->string('lng');
            $table->string('direccion');
            $table->float('distancia')->nullable(); //Km desde el establecimiento hasta el destino
            $table->float('tiempo')->nullable(); //minutos desde el establecimiento hasta el destino 
            $table->float('costo'); //costo total

            $table->integer('usuario_id')->unsigned();
            $table->foreign('usuario_id')->references('id')->on('usuarios');

            //$table->integer('establecimiento_id')->unsigned();
            //$table->foreign('establecimiento_id')->references('id')->on('establecimientos');

            $table->integer('repartidor_id')->unsigned()->nullable();
            $table->foreign('repartidor_id')->references('id')->on('usuarios');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('pedidos');
    }
}
