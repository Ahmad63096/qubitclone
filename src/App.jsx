import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../src/App.css';
import Chatbot from './components/Chatbot';
import Bot2 from './vs/Bot2';
import Bot3 from './v3/Bot3';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chatbot />} />
        <Route path="/v2" element={<Bot2 />} />
        <Route path="/v3" element={<Bot3/>} />
      </Routes>
    </Router>
  );
}
export default App;