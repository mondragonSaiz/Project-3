// import React from 'react';
// import Head from './components/Head';
//

// function App() {
//   return <Head />;
// }

// export default App;

import React from 'react';
import Head from './pages/Head';
import '../src/styles/globals.css';
import Nav from './pages/navBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Uncomment import statement below after building queries and mutations
// import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

function App() {
  return (
    <Router>
      <div className="flex-column justify-center align-center min-100-vh bg-primary">
        <Routes>
          <Route path="/" element={<Head />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;