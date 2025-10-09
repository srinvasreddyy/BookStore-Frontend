import React from 'react';
import YoutubeFrames from '../components/Home/YoutubeFrames'; // Assuming YoutubeFrames is in the same directory
import Videos from '../components/Home/Videos';             // Assuming Videos is in the same directory

const MediaCoverage = () => {
  return (
    <div>
      <YoutubeFrames />
      <Videos />
    </div>
  );
};

export default MediaCoverage;