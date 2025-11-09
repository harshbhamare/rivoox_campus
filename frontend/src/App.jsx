import React, { useState } from 'react';
import RivooxIntro from './components/RivooxIntro';
import AuthWrapper from './components/AuthWrapper';
import './App.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return <RivooxIntro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="app">
      <AuthWrapper />
    </div>
  );
}

export default App;