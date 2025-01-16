import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Chatbot from './components/Chatbot';
import Bot2 from './vs/Bot2';

function App() {
  return (
    <Router>
      <DynamicCSSLoader />
      <Routes>
        <Route path="/" element={<Chatbot />} />
        <Route path="/v2" element={<Bot2 />} />
      </Routes>
    </Router>
  );
}

function DynamicCSSLoader() {
  const location = useLocation();
  const [style, setStyle] = useState(null);

  useEffect(() => {
    if (location.pathname === '/') {
      import('./components/assets/css/v1.css')
        .then(() => setStyle('v1'))
        .catch((err) => console.error("Error loading v1.css", err));
    } else if (location.pathname === '/v2') {
      import('./vs/assets/css/v2.css')
        .then(() => setStyle('v2'))
        .catch((err) => console.error("Error loading v2.css", err));
    }
  }, [location]);

  return null;  // This component doesn't render anything itself
}

export default App;

















// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import './components/assets/css/v1.css';
// // import './vs/assets/css/v2.css';
// import Chatbot from './components/Chatbot'
// import Bot2 from './vs/Bot2';
// function App() {

//   return (
//     <>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Chatbot />} />
//           <Route path="/v2" element={ <Bot2/> } />
//         </Routes>
//       </Router>
//     </>
//   )
// }

// export default App





// import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
// import { useEffect } from 'react';
// import Chatbot from './components/Chatbot';
// import Bot2 from './vs/Bot2';

// function App() {
//   return (
//     <Router>
//       <DynamicCSSLoader />
//       <Routes>
//         <Route path="/" element={<Chatbot />} />
//         <Route path="/v2" element={<Bot2 />} />
//       </Routes>
//     </Router>
//   );
// }

// function DynamicCSSLoader() {
//   const location = useLocation();

//   useEffect(() => {
//     const head = document.head;
//     let link = document.getElementById('dynamic-css');
//     if (link) {
//       head.removeChild(link);
//     }
//     link = document.createElement('link');
//     link.id = 'dynamic-css';
//     link.rel = 'stylesheet';

//     if (location.pathname === '/') {
//       link.href = './components/assets/css/v1.css'; 
//     } else if (location.pathname === '/v2') {
//       link.href = './vs/assets/css/v2.css'; 
//     }

//     head.appendChild(link);
//   }, [location]);

//   return null;
// }

// export default App;