import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./VideoPlayer.css";

const VideoPlayer = ({ options, onReady, onTimeUpdate }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(playerRef.current);
      });
    }

    const player = playerRef.current;
    const handleTimeUpdate = () => {
      if (onTimeUpdate) {
        onTimeUpdate(player.currentTime());
      }
    };

    player.on("timeupdate", handleTimeUpdate);

    return () => {
      if (playerRef.current) {
        player.off("timeupdate", handleTimeUpdate);
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options, onReady, onTimeUpdate]);

  return (
    <div data-vjs-player className="video-player-container">
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoPlayer;
