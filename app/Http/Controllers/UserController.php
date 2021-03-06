<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use DB;
use Auth;
use Carbon\Carbon;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Hash;

class UserController extends Controller
{   
    public function resetPassword($id)
    {
        if(Auth::user()->role != 'admin')
        {
            abort(403, 'Unauthorized action.');
        }
        else{
            $user = User::where('id', $id)->first();

            $user->password = Hash::make('!welcome10');

            $user->save();
        }

    }

    public function department($id)
    {
        $id = (int)$id;

        return $id ? User::where('department_id', $id)->where('role', 'team-leader')->get() : User::where('department_id', Auth::user()->department_id)->where('role', 'team-leader')->get();
    }

    public function checkEmail(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        return response()->json($user ? true : false);
    }
    public function search(Request $request)
    {
        return DB::table('users')
            ->join('departments', 'departments.id', '=', 'users.department_id')
            ->select(
                'users.*',
                DB::raw('UPPER(LEFT(users.first_name, 1)) as first_letter'),
                DB::raw('DATE_FORMAT(users.created_at, "%h:%i %p, %b. %d, %Y") as created_at'),
                'departments.name as department_name'
                )
            ->where('users.first_name', 'like', '%'. $request->userInput .'%')
            ->orWhere('departments.name', 'like', '%'. $request->userInput .'%')
            ->orWhere('users.last_name', 'like', '%'. $request->userInput .'%')
            ->orWhere('users.email', 'like', '%'. $request->userInput .'%')
            ->orderBy('users.first_name')
            ->get();
    }
    public function changePassword(Request $request)
    {
        $user = $request->user();

        if($request->new == $request->confirm && $request->old != $request->new)
        {
            $user->password = Hash::make($request->new);
        }

        $user->save();
    }
    public function checkPassword(Request $request)
    {
        return response()->json(Hash::check($request->old, $request->user()->password));
    }
    // fetch all team leaders
    public function teamLeader()
    {
        // return DB::table('users')
        //     ->join('departments', 'departments.id', '=', 'users.department_id')
        //     ->select(
        //         'users.*',
        //         DB::raw('UPPER(LEFT(users.first_name, 1)) as first_letter'),
        //         DB::raw('DATE_FORMAT(users.created_at, "%h:%i %p, %b. %d, %Y") as created_at'),
        //         'departments.name as department_name'
        //     )
        //     ->whereIn('role', ['team-leader', 'manager'])
        //     ->get();

        return User::with('department')->whereIn('role', ['team-leader', 'manager'])->get();
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return $request->user();
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
        $check_user = User::where('email', $request->email)->first();

        if($check_user)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'department_id' => 'required|numeric',
            'role' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed|min:6',
        ]);


        $user = new User;

        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->department_id = $request->department_id;
        $user->role = $request->role;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);

        $user->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return User::where('id', $id)->first();
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
        if(Auth::user()->role != 'admin')
        {
            abort(403, 'Unauthorized action.');
        }

        User::where('id', $id)->delete();
    }
}
