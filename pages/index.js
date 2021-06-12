import { getSession, signOut } from 'next-auth/client'
import Head from 'next/head'
import { useEffect } from 'react';
import HomeSidebar from '../components/HomeSidebar';
import HomeStats from '../components/HomeStats';
import Login from '../components/Login';

export default function Home({ session }) {

  if (!session) return <Login />

  useEffect(() => {
    console.log(session)
  }, [session]);

  return (
    <div className="white min-h-screen grid place-items-center py-1">
      <Head>
        <title>SongLedge</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex rounded-2xl overflow-hidden flex-wrap w-[97.5vw] min-h-[95vh] shadow-2xl">
        <HomeSidebar />
        <HomeStats />
      </main>
      
    </div>
  )
}

export async function getServerSideProps(context) {

  return {
    props: {
      session: await getSession(context),
    }
  }
}