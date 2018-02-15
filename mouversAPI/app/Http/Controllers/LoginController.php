<?php

namespace App\Http\Controllers;

use Hash;
use App\Http\Requests;
use App\User;
use App\Usuario;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class LoginController extends Controller
{

    /*Funcion para verificar la valides de un token que se pasa en el request*/
    public function validarToken(Request $request)
    {

        try {
            $user = JWTAuth::toUser($request->input('token'));
        } catch (Exception $e) {
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
                return 0;
            }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException){
                return 0;
            }else if ($e instanceof \Tymon\JWTAuth\Exceptions\JWTException){
                return 0;
            }else{
                return 0;
            }
        }

        return 1;
    }
    

    public function loginWeb(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $token = null;
        $user = null;

        try {

            $user = User::where('email', $request->input('email'))->first();
            if (empty($user)) {
                return response()->json(['error' => 'Email inválido'], 401);
            }

            //En el panel solo se logean usuarios administradores
            if ($user->tipo_usuario != 1) {
                return response()->json(['error' => 'Credenciales inválidas.'], 401);
            }

            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Password inválido'], 401);
            }

            $user = JWTAuth::toUser($token);
            

        } catch (JWTException $ex) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        //return response()->json(compact('token', 'user'));

        return response()
            ->json([
                'token' => $token,
                'user' => $user
            ]);
    }

    public function loginApp(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $token = null;
        $user = null;
        $bandera = false;

        try {

            if ($request->input('email')) {

                $user = User::where('email', $request->input('email'))->first();
                if (empty($user)) {
                    return response()->json(['error' => 'Email inválido.'], 401);
                }

                //En la app solo se logean usuarios clientes
                if ($user->tipo_usuario != 2) {
                    return response()->json(['error' => 'Credenciales inválidas.'], 401);
                }

                //Para login con registro normal (email y password)
                if ($user->tipo_registro == 1 || $request->has("password")) {
                    if ($request->input('password') == null || $request->input('password') == '') {
                        return response()->json(['error' => 'Password inválido!'], 401);
                    }
                    if (!$token = JWTAuth::attempt($credentials)) {
                        return response()->json(['error' => 'Password inválido'], 401);
                    }
                    $bandera=true;
                }
                //Para login con registro con redes sociales
                else{

                    if ($user->id_facebook == null && $request->input('id_facebook') != null && $request->input('id_facebook') != '') {

                        $user->id_facebook = $request->input('id_facebook');
                        $user->save();
                        $bandera=true;
                    }
                    if ($user->id_twitter == null && $request->input('id_twitter') != null && $request->input('id_twitter') != '') {

                        $user->id_twitter = $request->input('id_twitter');
                        $user->save();
                        $bandera=true;
                    }
                    if ($user->id_instagram == null && $request->input('id_instagram') != null && $request->input('id_instagram') != '') {

                        $user->id_instagram = $request->input('id_instagram');
                        $user->save();
                        $bandera=true;
                    }

                    $token = JWTAuth::fromUser($user);
                }
            }else if(!$bandera && $request->input('id_facebook')){

                $user = User::where('id_facebook', $request->input('id_facebook'))->first();
                if (empty($user)) {
                    return response()->json(['error' => 'Usuario no encontrado.'], 401);
                }

                //En la app solo se logean usuarios clientes
                if ($user->tipo_usuario != 2) {
                    return response()->json(['error' => 'Credenciales inválidas.'], 401);
                }

                $token = JWTAuth::fromUser($user);

            }else if(!$bandera && $request->input('id_twitter')){

                $user = User::where('id_twitter', $request->input('id_twitter'))->first();
                if (empty($user)) {
                    return response()->json(['error' => 'Usuario no encontrado.'], 401);
                }

                //En la app solo se logean usuarios clientes
                if ($user->tipo_usuario != 2) {
                    return response()->json(['error' => 'Credenciales inválidas.'], 401);
                }

                $token = JWTAuth::fromUser($user);

            }else if(!$bandera && $request->input('id_instagram')){

                $user = User::where('id_instagram', $request->input('id_instagram'))->first();
                if (empty($user)) {
                    return response()->json(['error' => 'Usuario no encontrado.'], 401);
                }

                //En la app solo se logean usuarios clientes
                if ($user->tipo_usuario != 2) {
                    return response()->json(['error' => 'Credenciales inválidas.'], 401);
                }

                $token = JWTAuth::fromUser($user);
            }
            
            
            $user = JWTAuth::toUser($token);
            

        } catch (JWTException $ex) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        //return response()->json(compact('token', 'user'));

        return response()
            ->json([
                'token' => $token,
                'user' => $user
            ]);
    }

}
