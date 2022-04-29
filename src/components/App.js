import React, { useEffect, useState } from "react";
import AppRouter from 'components/AppRouter';
import { authService } from "fbase";
import { onAuthStateChanged, updateProfile } from "firebase/auth"

function App() {
  const [init, setInit] = useState(false);;
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => updateProfile(user, { displayName: user.displayName }),
        });
        if(user.displayName === null) {
          const name = user.email.split("@")[0];
          user.displayName = name;
        }   
      } else {
        setUserObj(null);
      }
      setInit(true);
    })
  }, [])

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => updateProfile(user, {displayName: user.displayName}),
    });
  }
  return (
    // <div style={{
    //   display: "flex",
    //   flexDirection: "column",
    //   textAlign: "center",
    //   alignItems: "center",
    //   justifyContent: "center",
    //   margin: "6rem auto",
    // }}>
    <div style={{
      textAlign: "center",
    }}>
      {init ?
        <AppRouter 
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)} 
          userObj={userObj} 
        />
        : "Initializing..."}
      <footer>&copy; {new Date().getFullYear()} Own Record </footer>
    </div>
  );
}

export default App;
