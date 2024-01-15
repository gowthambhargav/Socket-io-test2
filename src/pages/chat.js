import React, { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
import { socket } from "../socket";
import Note from "../components/Note";
function Chat() {
  const [connectedUsers, setConnectedUsers] = useState({});
  const [message, setMessage] = useState();
  const [msgrecived, setmsgRecived] = useState([]);
  const [chatType, setChatType] = useState("Group Chat");
  const [isPrivate, setisPrivate] = useState(false);
  const [privateChats, setPrivateChats] = useState([]);
  const [popup, setPopup] = useState(false);
  const [to, setTo] = useState();
  const [from, setFrom] = useState();
  const Useref = useRef({});

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
      // localStorage.setItem("userID", username);
      setConnectedUsers(users);
    });
    socket.on("recive_msg", (data) => {
      setmsgRecived((list) => [...list, data]);
    });
    socket.on("private_message", (data) => {
      setPrivateChats((prevMessages) => [...prevMessages, data]);
    });

    window.onbeforeunload = confirmExit;
    function confirmExit() {
      return "show warning";
    }
    return () => {
      socket.off("recive_msg"); // Remove the event listener
      socket.off("private_message"); // Remove the event listener")
    };
  }, []);
  const handelChange = (e) => {
    setMessage(e.target.value);
  };
  const handelSubmit = (e) => {
    // e.preventDefault();
    const author = localStorage.getItem("name");
    const time = new Date().getUTCMilliseconds() + new Date().getTime();
    if (isPrivate) {
      if (from !== undefined && from !== null) {
        socket.emit("private_message", {
          message,
          author,
          time,
          from,
          to,
        });
      }
    } else {
      socket.emit("message", { message, author, time });
    }
    setMessage("");
  };

  const handelChat = (e) => {
    const fromUser = Object.values(connectedUsers).find(
      (user) => user.email === localStorage.getItem("email")
    );

    // Set 'from' to the found socket ID
    setFrom(fromUser ? fromUser.socketId : null);
    // # after clicking  on username log the userName and id
    const to = e.target.id;
    if (isPrivate) {
    } else {
      setPopup(true);

      setTo([to, e.target.innerHTML]);
    }
  };
  const handePrivateChat = (e) => {};
  const handelPopup = (e) => {
    const respinsid = e.target.id;
    if (isPrivate) {
      return;
    } else {
      if (respinsid === "yes") {
        setChatType("Private Chat");
        setisPrivate(true);
      }
    }

    setPopup(false);
  };
  return (
    <>
      <div className="text-center overflow-hidden">
        <header>
          <Note />
        </header>
        <section className="flex flex-col-reverse lg:flex lg:flex-row m-3">
          <div className="border-red-600 border-4 w-[60%] lg:w-[20%]  sm:w-[35%] m-3 p-3 h-fit">
            <h3 className="text-center font-extrabold text-xl">Active Users</h3>
            <ul id="test-connection" className="m-3">
              {Object.keys(connectedUsers).map((userId) => (
                <li key={userId}>
                  <strong>
                    {
                      <div
                        onClick={handelChat}
                        className="underline cursor-pointer hover:bg-slate-200 hover:rounded-md"
                      >
                        <div
                          onClick={handePrivateChat}
                          ref={Useref}
                          key={connectedUsers[userId].socketId}
                          id={connectedUsers[userId].socketId}
                        >
                          {connectedUsers[userId].userName ===
                          localStorage.getItem("name") ? (
                            <div className="pointer-events-none select-none cursor-none"></div>
                          ) : (
                            connectedUsers[userId].userName
                          )}
                        </div>
                      </div>
                    }
                  </strong>
                </li>
              ))}
            </ul>
            {/* <div>
            <h3 className="text-center font-extrabold text-xl">
              Direct Messages
            </h3>
          </div> */}
          </div>

          {/* <div>{msgrecived}</div> */}
          <div className="border-blue-600 border-4 m-1 min-w-fit lg:w-[90%]">
            <div className="text-center font-extrabold text-lg">{chatType}</div>{" "}
            <div className="border-2 border-blue-500"></div>{" "}
            {isPrivate && (
              <div className="text-right">
                <button
                  onClick={() => {
                    const leaveChatConfirmed = window.confirm(
                      `Do you want to leave the private chat with ${to[1]}? This will delete the chat.`
                    );
                    if (leaveChatConfirmed) {
                      // Implement the logic to leave the private chat here
                      // For example, you can perform a redirect or update the state accordingly
                      setChatType("Group Chat");
                      setisPrivate(false);
                      setTo("");
                      setPrivateChats([]);
                    }
                  }}
                  className="bg-red-500 p-2 rounded-sm text-white text-base font-bold mr-2 mt-2 mb-2"
                >
                  Leave
                </button>
              </div>
            )}
            {isPrivate
              ? // create a reaponsive ui and  display messages sent by the current user  alongside the private chats

                privateChats.map((primsg, index) => {
                  return (
                    <div key={index}>
                      <div>
                        {primsg.author === localStorage.getItem("name") ? (
                          <div className="flex flex-wrap flex-row bg-green-400 w-fit p-3 m-3 rounded-md">
                            <div>
                              <p className="text-xs lg:text-sm">You</p>
                              <p className="text-xs lg:text-sm">
                                {primsg.message}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end flex-row-reverse bg-red-400 w-fit mt-2 p-3 ml-auto me-3 rounded-md">
                            <div>
                              <p className="underline text-xs lg:text-sm">
                                {primsg.author}
                              </p>
                              <p className="text-xs lg:text-sm">
                                {primsg.message}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              : msgrecived.map((msgContent, index) => {
                  return (
                    <div key={index} className="">
                      <strong>
                        {localStorage.getItem("name") === msgContent.author ? (
                          <div className="flex flex-wrap flex-row bg-green-400 w-fit p-3 m-3 rounded-md">
                            <div>
                              <p className="text-xs lg:text-sm">You</p>
                              <p className="text-xs lg:text-sm">
                                {msgContent.msg}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end flex-row-reverse bg-red-400 w-fit p-3 ml-auto me-3 rounded-md">
                            <div>
                              <p className="underline text-xs lg:text-sm">
                                {msgContent.author}
                              </p>
                              <p className="text-xs lg:text-sm">
                                {msgContent.msg}
                              </p>
                            </div>
                          </div>
                        )}
                      </strong>
                      <span> {/*  */}</span>
                      <br />
                    </div>
                  );
                })}
            <div className="w-full flex  m-2 relative content-center">
              <input
                placeholder="Type your message and press Enter"
                value={message}
                onChange={handelChange}
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handelSubmit();
                  }
                }}
                className="border-2 mt-[20px] h-[50px] border-gray-500 rounded-md p-2 w-full"
              />
              {isPrivate && (
                <span
                  className="
              bg-slate-100
              p-1
              rounded-md
              shadow-sm
              absolute
            top-[-5px]
            left-[5px]
            text-xs
            text-gray-500
            dark:text-gray-400
            
            "
                >
                  <strong>To : </strong>
                  {to && to[1]}
                </span>
              )}
              <button
                onClick={handelSubmit}
                type="submit"
                className="m-5 bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-3 rounded-lg items-center  dark:bg-sky-500  dark:hover:bg-sky-400"
              >
                Send
              </button>
            </div>
          </div>
        </section>
        {/* <strong>From</strong> {msgrecived && msgrecived.author}{" "}
      <strong>MESSAGE</strong> {msgrecived && msgrecived.msg} */}
      </div>
      {popup && (
        <div
          onClick={handelPopup}
          className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center  bg-black/60 border-2 z-10 w-full h-full "
        >
          <div
            className=" rounded-md
        border-2
        border-red-500
        p-3
        lg:w-[50%]
        sm:w-[55%]
        h-[50%]
        flex
        flex-col
        justify-center
        items-center
        text-center
        gap-2
        bg-slate-100
        dark:bg-slate-800
        dark:text-slate-200
        dark:border-slate-700
        dark:hover:text-slate-200
        dark:hover:border-slate-600
        dark:hover:shadow-slate-700
        dark:shadow-slate-800
        dark:shadow-sm
        shadow-sm
        shadow-slate-500
        hover:shadow-slate-700
        hover:shadow-sm
        hover:bg-slate-200
        hover:text-slate-900
        hover:border-slate-400
        hover:dark:bg-slate-700"
          >
            {/* <div className="relative">
              <img
                src="close-144.png"
                className="w-[30px] md:w-[35px] lg:w-[50px]"
                alt=""
                srcset=""
              />
            </div> */}
            <h3
              className="font-semibold lg:text-2xl
            sm:text-sm
            text-red-500
            dark:text-red-400
            dark:hover:text-red-400
            dark:hover:shadow-red-400
            dark:shadow-red-500
            shadow-red-500
            hover:text-red-400
            hover:shadow-red-400 
"
            >
              Are you sure you want to close the group chat?
            </h3>
            <div className="flex gap-2">
              <button
                id="yes"
                className="p-2 px-3 mx-2 text-xl font-bold bg-blue-700 rounded-md"
              >
                Yes
              </button>
              <button
                id="no"
                className="p-2 px-3 mx-2 text-xl font-bold bg-red-700 rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
