import { signIn } from 'next-auth/client';
import React from 'react';

const Login = () => {
  return (
    <div className="h-screen w-screen grid place-items-center">
      <button onClick={signIn} className="rounded-xl shadow px-4 py-2 hover:border-b-4 border-green-500 transition-all ease-in-out duration-150 bg-white animate-pulse">
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
