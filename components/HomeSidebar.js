import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { LogoutIcon, SparklesIcon } from '@heroicons/react/outline';
import { MusicNoteIcon } from '@heroicons/react/solid';
import db from '../firebase';

const HomeSidebar = () => {
  const router = useRouter();
  const [session] = useSession();
  const [points, setPoints] = useState(0);

  // real time db ting points, hook from fb clone

  useEffect(() => {
    const unsub = db.collection("users").doc(session?.user.id)
    .onSnapshot((doc) => {
        setPoints(doc.data()?.points);
    });

    return unsub;
  }, []);

  return (
    <div className="w-screen md:w-[300px] white p-3 h-screen sm:h-auto flex flex-col justify-between items-center">
      <h1 className="mb-9 mr-auto text-2xl text-gray-300 underline">Song<span className="font-bold">Ledge</span></h1>
      <div className="user_info flex flex-col items-center justify-items-center flex-1">
        <div className="shadow-xl rounded-full bg-gray-100 mb-6 pt-2 px-2">
        <Image src={session?.user.picture || 'https://drgsearch.com/wp-content/uploads/2020/01/no-photo.png'} lazy="true" height="200" width="200" layout="fixed" objectFit="cover" className="rounded-full" />
        </div>

        <p className="text-l text-white bg-gradient-to-tr to-pink-500 from-purple-400 py-2 px-6 rounded-3xl mb-5 flex items-center" ><SparklesIcon className="h-6 mr-1" />  {points} points</p>
        
        <h2 className="font-bold white text-xl" >@{session?.user.name}</h2>
        <p className="text-gray-400 text-xs font-medium mt-1">({session?.user.email})</p>
      </div>

      <div className="btns flex items-center space-x-3 h-12">
        <button
        className="sidebar__btn bg-gradient-to-r to-gray-700 from-gray-600 text-white border-pink-500 transition-all ease-in-out "
        onClick={() => router.push('/ingame')}
        >
          Play Game
          <MusicNoteIcon className="h-5 ml-1" />
        </button>

        <button 
        className="sidebar__btn text-gray-700" 
        onClick={signOut}
        >
          Sign Out 
          <LogoutIcon className="h-5 ml-1" /> 
        </button>
      </div>
    </div>
  );
}

export default HomeSidebar;
