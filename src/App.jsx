import { useState, useEffect } from 'react';
import BestPublications from "./components/Home/BestPublications";
import CategoryCards from "./components/Home/CategoryCards";
import HeroC from "./components/Home/HeroC";
import Loading from "./components/Loading";
import Steps from "./components/Home/Steps";
import Videos from "./components/Home/Videos";
import YoutubeFrames from "./components/Home/YoutubeFrames";
import NewArriavals from './components/Home/NewArriavals';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Main app content */}
      <HeroC />
      <CategoryCards />
      <NewArriavals/>
      <BestPublications />
      <Steps />
      <YoutubeFrames />
      <Videos />

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500">
          <Loading />
        </div>
      )}
    </>
  );
};

export default App;
