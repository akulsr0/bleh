import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import { AppContext } from "../contexts/AppContext";
import Header from "../components/_head";
import styles from "../styles/Room.module.css";

const Room = () => {
  const router = useRouter();
  const { roomId, username } = router.query;

  const { isLoggedIn } = useContext(AppContext);

  const [chatSocket, setChatSocket] = useState();

  const messagesWrapperRef = useRef();
  const messageInputRef = useRef();

  function onMessageKeyPress(event) {
    if (event.which && event.which === 13) {
      onClickSend();
    }
  }

  // Sending Message
  function onClickSend() {
    const msg = messageInputRef.current.value;
    if (!msg || msg === "") return;
    messageInputRef.current.value = "";
    chatSocket.emit("chat-message", { roomId, username, msg });
  }

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [router, isLoggedIn]);

  useEffect(() => {
    return () => {
      chatSocket && chatSocket.emit("user-left", { username, roomId });
    };
  }, [roomId, username, chatSocket]);

  useEffect(() => {
    if (isLoggedIn && username && roomId) {
      fetch("/api/chat").finally(() => {
        const socket = io();
        setChatSocket(socket);

        // User Joining
        socket.emit("user-joined", { username, roomId });

        // When a user joins
        socket.on("user-joined", (payload) => {
          const text = `${payload.username} joined`;
          const userJoinMarkup = document.createElement("small");
          userJoinMarkup.innerText = text;
          messagesWrapperRef.current &&
            messagesWrapperRef.current.appendChild(userJoinMarkup);
        });

        // When a message is recieved
        socket.on("message", (data) => {
          const { username, msg } = data;
          const messageMarkup = document.createElement("div");
          messageMarkup.innerHTML = `<strong>${username}:</strong> ${msg}`;
          if (messagesWrapperRef.current) {
            messagesWrapperRef.current.appendChild(messageMarkup);
            messagesWrapperRef.current.scrollTop =
              messagesWrapperRef.current.scrollHeight;
          }
        });

        socket.on("user-left", (data) => {
          const text = `${data.username} left`;
          const userLeftMarkup = document.createElement("small");
          userLeftMarkup.innerText = text;
          messagesWrapperRef.current &&
            messagesWrapperRef.current.appendChild(userLeftMarkup);
        });
      });
    }
    return () => {
      socket && socket.close();
    };
  }, [roomId, username, isLoggedIn]);

  return (
    <>
      <Header title={`Chat Room - ${roomId ? roomId : ""}`} />
      <div className={styles.roomWrapper}>
        <div className={styles.chatHeader}>
          <strong>ChatRoom - {roomId}</strong>
        </div>
        <div className={styles.messagesWrapper} ref={messagesWrapperRef}></div>
        <div className={styles.bottomInputWrapper}>
          <input
            type="text"
            placeholder="Enter message"
            ref={messageInputRef}
            enterKeyHint="send"
            onKeyPress={onMessageKeyPress}
          />
          <button onClick={onClickSend}>Send</button>
        </div>
      </div>
    </>
  );
};

export default Room;
