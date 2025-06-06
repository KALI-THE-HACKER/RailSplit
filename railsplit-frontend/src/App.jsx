import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import useIsMobile from './Hooks/useIsMobile'
import MobileView from './Screens/MobileView';

function App() {
  const isMobile = useIsMobile();

  return (
    <>
    <BrowserRouter>
      {isMobile ? <MobileView /> : <DesktopView />}
    </BrowserRouter>
    </>
  )
}

export default App
