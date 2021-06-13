import { signIn } from 'next-auth/client';
import React from 'react';

const Login = () => {
  return (
    <div className="h-screen w-screen grid place-items-center content-center">
      <h1 className=" text-5xl mb-7 text-gray-300">Song<span className="font-bold">Ledge</span></h1>
      <button onClick={signIn} className="rounded-xl shadow px-4 py-2 hover:border-b-4 border-green-500 transition-all ease-in-out duration-150 bg-white animate-pulse">
        Sign In with Spotify
      </button>
    </div>
  );
}

export default Login;
