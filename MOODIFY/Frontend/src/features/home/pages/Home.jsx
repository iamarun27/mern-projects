import React from "react";
import FaceExpression from "../../Expression/component/FaceExpression";
import Player from "../components/Player";
import { useSong } from "../hooks/useSong";

const Home = () => {
  const { handleGetSong } = useSong();

  return (
    <>
      <FaceExpression
        onClick={(expression) => {
          handleGetSong({ mood: expression });
        }}
      />
      <Player />
    </>
  );
};

export default Home;
