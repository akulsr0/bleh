import { useRouter } from "next/router";
import { useContext, useRef, useState } from "react";
import Header from "../components/_head";
import styles from "../styles/Home.module.css";

import { AppContext } from "../contexts/AppContext";
import { createRoom } from "../services";
import { getRandomRoomID } from "../utils";

const Create = () => {
  const roomId = getRandomRoomID();
  const router = useRouter();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [errorText, setErrorText] = useState();
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);

  function onClickCreateRoom() {
    setErrorText(null);
    if (usernameRef.current && passwordRef.current) {
      const { value: username } = usernameRef.current;
      const { value: password } = passwordRef.current;
      createRoom({ roomId, password }).then((data) => {
        const { success, msg } = data;
        if (success) {
          setIsLoggedIn(true);
          router.push({
            pathname: "/room",
            query: { username, roomId: roomId.toUpperCase() },
          });
        } else {
          setErrorText(msg);
        }
      });
    }
  }

  return (
    <>
      <Header title="Create Room" />
      <div className={styles.wrapper}>
        <h1>Bleh</h1>
        <div className={styles.inputWrapperBox}>
          <strong>Create a room</strong>
          <div className={styles.inputWrapper}>
            <div>
              <span>Room ID</span>
              <input type="text" value={roomId} disabled />
            </div>
            <div>
              <span>Username</span>
              <input ref={usernameRef} type="text" autoCapitalize="off" />
            </div>
            <div>
              <span>Password</span>
              <input
                ref={passwordRef}
                type="password"
                inputMode="numeric"
                maxLength={6}
              />
            </div>
          </div>
          {errorText && <small>{errorText}</small>}
          <div className={styles.actionsWrapper}>
            <button onClick={onClickCreateRoom}>Create room</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
