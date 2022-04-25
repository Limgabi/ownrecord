import React, { useEffect, useState } from "react";
import AppRouter from 'components/AppRouter';
import { authService } from "fbase";
import { onAuthStateChanged } from "firebase/auth"

function App() {
  const [init, setInit] = useState(false);;
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setUserObj(user);
      } else {
        setUserObj(null);
      }
      setInit(true);
    })
  }, [])

  return (
    <>
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj}/> : "Initializing..."}
      <footer>&copy; {new Date().getFullYear()} Own Record </footer>
    </>
  );
}

export default App;
