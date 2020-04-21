import React, { useEffect, useState } from "react";

const Loading = ({ isFullScreen }) => {
  const CYCLE_DURATION = 1000;
  const [opacity, setOpacity] = useState(1);
  const [showText, setShowText] = useState("none");

  let mounted = true;

  const blink = () => {
    setTimeout(() => {
      if (mounted) setOpacity(0.4);
    }, CYCLE_DURATION / 2);
    setTimeout(() => {
      if (mounted) setOpacity(1);
    }, CYCLE_DURATION);
  };

  useEffect(() => {
    var interval = setInterval(blink, CYCLE_DURATION);
    var timeout = setTimeout(() => {
      if (mounted) setShowText("block");
    }, 5000);
    return () => (mounted = false);
  }, []);

  return (
    <div className={`d-flex flex-column justify-content-center align-items-center p-4 ${isFullScreen ? "h-100vh" : ""}`}>
      <div style={{ opacity: opacity }}>LOADING...</div>
      <div className="small-bold py-1 text-center" style={{ display: showText }}>
        Is this taking way too long?
        <br />
        Try reloading the page.
      </div>
    </div>
  );
};

export default Loading;
