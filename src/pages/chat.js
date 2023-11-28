import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";
import { socket } from "../socket";
function Chat() {
  const [connectedUsers, setConnectedUsers] = useState({});
  const [message, setMessage] = useState();
  const [msgrecived, setmsgRecived] = useState([]);
  // const [to, setTo] = useState("");
  useEffect(() => {
    const username = localStorage.getItem("name") || prompt("Enter your Name");
    const email = localStorage.getItem("email") || prompt("Enter your email");
    localStorage.setItem("name", username);
    localStorage.setItem("email", email);
    const user = {
      userName: username,
      email: email,
    };
    // Emit the 'join' event to send user information to the server
    socket.emit("join", user);

    // Listen for 'connectedUsers' event to receive the list of connected users
    socket.on("connectedUsers", (users) => {
      setConnectedUsers(users);
    });
    socket.on("recive_msg", (data) => {
      setmsgRecived((list) => [...list, data]);
    });
    return () => {
      socket.off("recive_msg"); // Remove the event listener
    };
  }, []);

  const handelChange = (e) => {
    setMessage(e.target.value);
  };
  const handelSubmit = (e) => {
    e.preventDefault();
    const author = localStorage.getItem("name");
    const time = new Date().getUTCMilliseconds() + new Date().getTime();
    socket.emit("message", { message, author, time });
  };
  return (
    <div className="text-center">
      <input
        placeholder="Message"
        value={message}
        onChange={handelChange}
        type="text"
        className="border-2 border-gray-500 rounded-md w-[12rem] p-2"
      />
      <button
        onClick={handelSubmit}
        type="submit"
        className="m-5 bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-3 rounded-lg items-center  dark:bg-sky-500  dark:hover:bg-sky-400"
      >
        Send
      </button>
      <h1 className="text-center font-extrabold text-xl">Online Users</h1>
      <ul id="test-connection" className="m-5">
        {Object.keys(connectedUsers).map((userId) => (
          <li key={userId}>
            <strong>Name:</strong> {connectedUsers[userId].userName},
          </li>
        ))}
      </ul>
      {/* <div>{msgrecived}</div> */}
      <div
        onClick={() => {
          console.log(msgrecived, "sahjghjgshf");
        }}
      ></div>
      <div className="text-center font-extrabold text-lg">Chats</div>
      {msgrecived.map((msgContent, index) => {
        return (
          <div key={index}>
            <strong>
              {localStorage.getItem("name") === msgContent.author ? (
                <p>You</p>
              ) : (
                msgContent.author
              )}
            </strong>
            <span>
              {" "}
              <p>{msgContent.msg}</p>
            </span>
            <br />
          </div>
        );
      })}
      {/* <strong>From</strong> {msgrecived && msgrecived.author}{" "}
      <strong>MESSAGE</strong> {msgrecived && msgrecived.msg} */}
    </div>
  );
}

export default Chat;
