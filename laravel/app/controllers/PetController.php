<?php

class PetController extends BaseController {

	// GET
	// ./api/pets
	// gets all rows from table
	public function index()
	{
		$pets = DB::table('pets')->get();
 
    	return Response::json($pets);
	}

	// GET
	// ./api/pets/[PETID]
	// gets one single row
	public function show($petID)
	{
		$pet = DB::table('pets')->where('petID', $petID)->first();
		return Response::json($pet);
	}

	// DELETE
	// ./api/pets/[PETID]
	// deletes a single row

	public function destroy($petID)
	{
		DB::table('pets')->where('petID', $petID)->delete();
	 
    	return Response::json('success');
	}

	// GET
	// ./api/pets/buy?username=USERNAME&typeID=TYPEID&name=NAME
	public function Buy() 
	{
		$username = Input::get('username');
		$typeID = Input::get('typeID');

		$user = DB::table('users')->where('username', $username)->first();
		$pet_type = DB::table('pettypes')->where('typeID', $typeID)->first();

		// make sure user can afford it
		if ($user->money < $pet_type->price) 
		{
			return Response::json('You cannot afford this pet.');
		}
		// make sure user has unlocked it
		if (log($user->exp, 2) < $pet_type->unlock_level) 
		{
			return Response::json('You have not unlocked this pet.');
		}

		// subtract money from user, save
		$new_money = $user->money - $pet_type->price;
		DB::table('users')->where('username', $username)->update(array('money'=>$new_money));

		// create new pet, save
	    $pet = new Pet;
	   	$pet->typeID = $typeID;
	    $pet->username = $username;
	    $pet->name = Input::get('name');
	    $pet->happiness = '60';
	    $pet->cleanliness = '60';
	    $pet->fullness = '60';
	    $pet->exp = 0;

	    $pet->save();
	 
    	return Response::json('success');

	}

	// GET
	// ./api/pets/gethappyimage?petID=[petID]
	public function GetHappyImage()
	{
		$petID = Input::get('petID');

		$typeID = Pet::where('petID', $petID)->first()->typeID;

		$imageID = PetType::where('typeID', $typeID)->first()->imageID;

		$happy = Image::where('imageID', $imageID)->first()->happy;

		return Response::json($happy);
	}
}