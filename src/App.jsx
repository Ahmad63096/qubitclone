import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../src/App.css';
import Chatbot from './components/Chatbot';
import Bot2 from './vs/Bot2';
import Bot3 from './v3/Bot3';
import TutorBot from './tutor/Tutorbot';
import BaytBot from './bayt/Baytbot';
import LawyerBot from './lawyer/Lawyerbot';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chatbot />} />
        <Route path="/v2" element={<Bot2 />} />
        <Route path="/v3" element={<Bot3/>} />
        <Route path="/bayt" element={<BaytBot/>} />
        <Route path="/tutor" element={<TutorBot/>} />
        <Route path="/lawyer" element={<LawyerBot/>} />
      </Routes>
    </Router>
  );
}
export default App;