import React from 'react'
import NavBar from './components/NavBar'
import HeroC from './components/HeroC'
import CategoryCards from './components/CategoryCards'
import BestPublications from './components/BestPublications'
import YoutubeFrames from './components/YoutubeFrames'
import Steps from './components/Steps'
import Videos from './components/Videos'
import Footer from './components/Footer'

const App = () => {
  return (
    <>
    <NavBar />
    <HeroC/>
    <CategoryCards/>
    <BestPublications/>
    <Steps/>
    <YoutubeFrames/>
    <Videos/>
    <Footer/>
</>
  )
}

export default App