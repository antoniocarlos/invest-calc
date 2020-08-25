import React from 'react';

import Home from './pages/home'
import AppProvider from './hooks';


const App: React.FC = () => (
  <AppProvider>
    <Home />
  </AppProvider>
);

export default App;
