import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import firebase from 'firebase';
import { useSession } from 'next-auth/client';
import db from '../firebase';
import { Router, useRouter } from 'next/router';
import { ArrowLeftIcon } from '@heroicons/react/outline';

const ingame = () => {
  const router = useRouter();
  const [session] = useSession();
  const [finalTracks, setFinalTracks] = useState([]);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [points, setPoints] = useState(1);
  const audioting = useRef(null);
  const [lost, setLost] = useState(false);

  const savePoints = () => {
    db.collection('users').doc(session?.user.id).update({
      points: firebase.firestore.FieldValue.increment(points)
    });
  }

  useEffect(() => {
    if (!session?.user.accessToken) router.replace("/")
  }, []);

  useEffect(() => {
    if (lost) router.replace("/")
  }, [lost]);

  useEffect(() => {
    fourRandomTracks();
  }, [points]);

  useEffect(() => {
    if (finalTracks.length) setPlayingTrack(_.sample(finalTracks));
  }, [finalTracks]);

  useEffect(() => {
    if (audioting.current) audioting.current.volume = '0.2';
  }, [audioting])

  const fourRandomTracks = async () => {
    const headers = {
      Authorization: `Bearer ${session?.user.accessToken}`,
    };

    const albumsRes = await fetch("https://api.spotify.com/v1/browse/new-releases", {
      headers
    });
    const albumsJson = await albumsRes.json();
    console.log(albumsJson)
    let artists = [];
    albumsJson.albums?.items.forEach(album => artists = [...artists, ...album.artists]);
    artists = _.sampleSize(artists.map(artist => artist.id), 4);

    let tracks = [];

    await Promise.all(artists.map( async (artist) => {
      const tracksRes = await fetch(`https://api.spotify.com/v1/artists/${artist}/top-tracks?market=US`, {
        headers,
      })
      const trackRes = await tracksRes.json();
      tracks = [...tracks, ...trackRes.tracks];
    }));

    tracks = _.sampleSize(tracks.filter(track => track.preview_url), 4);

    setFinalTracks(_.sampleSize(tracks, 4));
  }

  const choice = (id) => {
    if (id === playingTrack.id) {
      setPoints(prev => {
        return prev < 10 ? (prev * 2) : prev + 10;
      })
    } else {
      savePoints();
      setLost(true);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center content-center overflow-scroll relative">
      <nav className="top-0 w-full absolute p-4 flex justify-between items-center space-x-2">
        <button className="focus:outline-none hover:animate-bounce" onClick={() => router.replace('/') }>
          <ArrowLeftIcon className="h-5 text-red" />
        </button>
        {playingTrack && <audio ref={audioting} autoPlay src={playingTrack.preview_url} controls></audio>}
      </nav>
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 mt-[86px] sm:mt-0">
        {finalTracks.length && finalTracks.map(track => (
          <div
          className="bg-gray-200 p-4 rounded-xl text-gray-500 max-w-[300px] grid place-items-center text-center cursor-pointer hover:scale-150 transition-transform duration-500 ease-in-out "
          key={track.id}
          onClick={() => choice(track.id)}
          >
            <img className="mb-3 w-40 h-40 rounded-3xl" src={track.album.images[0].url} alt=""/>
            <h3 key={track.id}>{track.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ingame;
