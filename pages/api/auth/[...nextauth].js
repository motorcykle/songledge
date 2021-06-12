import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import db from '../../../firebase'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Spotify({
      scope: 'user-read-email playlist-modify-public playlist-modify-private',
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: { 
    async jwt(token, _, account) {
      if (account) {
        token.id = account.id
        token.accessToken = account.accessToken
      }
      return token
    },
    async session(session, user) {
      const docRef = db.collection("users").doc(user.id);
      docRef.get().then((doc) => {
          if (!doc.exists) {
            docRef.set({
              points: 0,
              picture: user?.picture,
              username: user?.name,
            })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
          } else {
            docRef.set({
              picture: user?.picture,
              username: user?.name,
            }, { merge: true })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
          }
      }).catch((error) => {
          console.log("Error getting document:", error);
      });
      session.user = user
      return session
    }
  },

  // A database is optional, but required to persist accounts in a database
  database: process.env.DATABASE_URL,
})