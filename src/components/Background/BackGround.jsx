// src/components/BackGround/BackGround.js

import React from "react";

const BackGround = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-[-1]">
      <video autoPlay muted loop className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover opacity-70">
        <source src="https://www.w3schools.com/howto/rain.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
    </div>
  );
};

export default BackGround;
