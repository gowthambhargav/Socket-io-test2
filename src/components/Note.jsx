import React from "react";

import { FaLinkedin, FaGithub } from "react-icons/fa";

const Note = () => {
  return (
    <div className="bg-gray-300 text-white text-center p-4">
      <div className="flex justify-center">
        <div className="flex justify-between items-center">
          <FaLinkedin className="text-blue-600 -mb-1 text-2xl" />
          <a
            className="ml-2 font-bold text-2xl"
            href="https://www.linkedin.com/in/gowtham-bhargav-6a64a5218/"
          >
            Linkdin
          </a>
        </div>
        <div className="flex justify-between ml-2 items-center">
          <FaGithub className="text-black -mb-1 text-2xl" />
          <a
            className="ml-2 font-bold text-2xl"
            href="https://github.com/gowthambhargav"
          >
            Github
          </a>
        </div>
      </div>
      {/* <div className="text-right flex">
        <p className="mr-2 font-bold text-red-800">
          Note: All the chat/conversation will be Deleted Wben you Click
        </p>
        <button className="bg-red-500 p-2 rounded-sm text-white text-base font-bold mr-2 mt-2 mb-2">
          Leave
        </button>
      </div> */}
    </div>
  );
};

export default Note;
