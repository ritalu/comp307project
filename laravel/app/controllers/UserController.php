<?php

class UserController extends BaseController {

	// GET
	// ./api/users
	// gets all rows from table
	public function index()
	{
		$user = DB::table('users')->get();
 
    	return Response::json($user);
	}

	// GET
	// ./api/users/[USERNAME]
	// gets one single row
	public function show($username)
	{
		$user = DB::table('users')->where('username', $username)->first();
		return Response::json($user);
	}

	// POST
	// ./api/users
	// saves single row
	public function save()
	{
	    $user = new User;
	    $user->username = Request::get('username');
	    $user->email = Request::get('email');
	    $user->password = Request::get('password');

	    if (DB::table('users')->where('username', $user->username)->get() != null)
	    {
	    	return Response::json('The username is taken.');
	    }

	   	if (DB::table('users')->where('email', $user->email)->get() != null)
	    {
	    	return Response::json('The email is taken.');
	    }

	    $user->picture = 'http://cdn.flaticon.com/png/256/28314.png';
	    $user->exp = '2';
	    $user->money = '2000';
	 
	    $user->save();
	 
    	return Response::json('success');
	}

	// POST
	// ./api/users/update
	// updates single row
	public function update()
	{
	    $username = Input::get('username');
		$password = Input::get('password');
		$email = Input::get('email');
		$picture = Input::get('picture');

		if ($password != null)
		{
			DB::table('users')->where('username', $username)->update(array('password'=>$password));
		}

		if ($email != null)
		{
			DB::table('users')->where('username', $username)->update(array('email'=>$email));
		}

		if ($picture != null)
		{
			DB::table('users')->where('username', $username)->update(array('picture'=>$picture));
		}
	 
    	return Response::json('success');
	}

	// DELETE
	// ./api/users/[USERNAME]
	// deletes a single row

	public function destroy($username)
	{

		DB::table('users')->where('username', $username)->delete();
	 
    	return Response::json('success');
	}

	// GET
	// ./api/users/getallpets/[USERNAME]
	// gets all pet objects for the specified user
	public function GetAllPets($username)
	{
		$pets = DB::table('pets')->where('username', $username)->get();

		$new_array = Array();
		foreach ($pets as $pt)
		{
			$imageID = DB::table('pettypes')->where('typeID', $pt->typeID)->first()->imageID;
			$happy = DB::table('images')->where('imageID', $imageID)->first()->happy;
			$sad = DB::table('images')->where('imageID', $imageID)->first()->sad;
			if ($pt->happiness >= 50 && $pt->cleanliness >=50 && $pt->fullness >= 50)
			{
				$pt = (object) array_merge((array)$pt, array( 'happy' => $happy ));
			}
			else
			{
				$pt = (object) array_merge((array)$pt, array( 'happy' => $sad ));
			}
			array_push($new_array, $pt);
		}

		return Response::json($new_array);
	}

	// GET
	// ./api/users/getallobjects/[USERNAME]
	// gets all pet objects for the specified user
	public function GetAllObjects($username)
	{
		$objectowned = DB::table('objectsowned')->where('username', $username)->get();

		$new_array = Array();
		foreach ($objectowned as $o)
		{
			$object = DB::table('objects')->where('objectID', $o->objectID)->first();
			$new_o = (object) array_merge((array) $object, (array) $o);
			array_push($new_array, $new_o);
		}
		return Response::json($new_array);
	}


	// GET
	// ./api/users/login?username=[USERNAME]&password=[PASSWORD]
	public function Login()
	{
		$username = Input::get('username');
		$password = Input::get('password');
		
		$user = DB::table('users')->where('username', $username)->first();

		if ($user != null)
		{
			if ($password == $user->password)
			{
				//cookies last for 1 day 
				$level = log($user->exp, 2);
				Cookie::queue('username' , $username, 60*24);
				Cookie::queue('level' , $level, 60*24);

				return Response::json('success');
			}
		}
		return Response::json('Login failed.');
	}

	// GET
	// ./api/users/logout
	public function Logout()
	{
		//TODO: doesn't work :(
		return Response::json('success')->withCookie(Cookie::forget('username'));
	}

	// GET
	// ./api/users/search?term=TERM
	public function Search()
	{
		$term = Input::get('term');	
		$users = User::where('username', 'LIKE', '%'.$term.'%' )->get();
		return Response::json($users);
	}


}
