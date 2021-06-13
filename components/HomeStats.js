import { SparklesIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/client';
import React, { useEffect, useState } from 'react';
import db from '../firebase';
import Image from 'next/image';

const HomeStats = () => {
  const [session] = useSession();
  const [points, setPoints] = useState(0);
  const [topTen, setTopTen] = useState([]);

  useEffect(() => {
    const unsub = db.collection("users").doc(session?.user.id)
    .onSnapshot((doc) => {
        setPoints(doc.data()?.points);
    });

    return unsub;
  }, []);

  useEffect(() => {
    const unsub = db.collection('users').orderBy("points", "desc").limit(10)
      .onSnapshot((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push({...doc.data(), uid: doc.id});
        });
        setTopTen(users);
      });
    return unsub
  }, [points]);

  return (
    <div className="flex-1 bg-gray-100 p-5 text-gray-400">
      <h1 className="text-4xl font-light border-b-2 pb-4" >Top #10 Players</h1>
      <div>
        {topTen.length > 0 && topTen.map((user, i) => (
          <div key={user.uid} className="flex items-center space-x-2 py-4">
            <p className="level">{i+1}.</p>
            <Image src={user.picture || 'https://drgsearch.com/wp-content/uploads/2020/01/no-photo.png'} alt="" className="rounded-full" layout="fixed" objectFit="cover" width="45" height="45" />
            <h3 className="flex-1 font-medium text-gray-500">@{user.username}</h3>
            <div className="points flex items-center">
              <SparklesIcon className="h-4 mr-1 text-gray-300" />
              <p>{user.points}</p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default HomeStats;
