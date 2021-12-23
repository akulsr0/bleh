import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import styles from "../styles/Home.module.css";
import Header from "../components/_head";
import { AppContext } from "../contexts/AppContext";
import { joinRoom } from "../services";

const Home = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState();

  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);

  const router = useRouter();

  function onClickCreateRoom() {
    router.push("/create");
  }

  async function onClickEnterRoom() {
    setErrorText(null);
    if (!username || !roomId || !password) {
      setErrorText("Enter all fields");
      return;
    }
    const { success } = await joinRoom({
      roomId: roomId.toUpperCase(),
      password,
    });
    if (success) {
      setIsLoggedIn(true);
      router.push({
        pathname: "/room",
        query: { username, roomId: roomId.toUpperCase() },
      });
    } else {
      setErrorText("Login Failed");
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {
    setIsLoggedIn(false);
  }, [setIsLoggedIn]);

  function onChangeInput(event) {
    const { value } = event.target;
    const inputfor = event.target.getAttribute("inputfor");

    switch (inputfor) {
      case "username":
        setUsername(value);
        break;
      case "roomId":
        setRoomId(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        return;
    }
  }

  return (
    <>
      <Header title="Bleh" />
      <div className={styles.wrapper}>
        <h1>Bleh</h1>
        <div className={styles.inputWrapperBox}>
          <strong>Join a room</strong>
          <div className={styles.inputWrapper}>
            <div>
              <span>Username</span>
              <input
                type="text"
                inputfor="username"
                autoCapitalize="off"
                onChange={onChangeInput}
              />
            </div>
            <div>
              <span>Room ID</span>
              <input
                type="text"
                inputfor="roomId"
                autoCapitalize="characters"
                maxLength={6}
                onChange={onChangeInput}
              />
            </div>
            <div>
              <span>Password</span>
              <input
                type="password"
                inputfor="password"
                inputMode="numeric"
                maxLength="6"
                onChange={onChangeInput}
              />
            </div>
          </div>
          {errorText && <small>{errorText}</small>}
          <div className={styles.actionsWrapper}>
            <button onClick={onClickEnterRoom}>join</button>
            <button onClick={onClickCreateRoom}>create</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
