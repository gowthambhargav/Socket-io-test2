import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [email, setEmail] = useState();
  const [Username, setUsername] = useState();
  const navagate = useNavigate;
  return (
    <div>
      <input
        value={Username}
        placeholder="Username"
        type="text"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <input
        value={email}
        placeholder="Email"
        type="text"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <button
        onClick={() => {
          localStorage.setItem("username", Username);
          localStorage.setItem("email", email);
          navagate("/chat");
        }}
      >
        Start Chat
      </button>
    </div>
  );
}

export default Home;
