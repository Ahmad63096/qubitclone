import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../src/App.css';
import Chatbot from './components/Chatbot';
import Bot2 from './vs/Bot2';
import ChatbotToggler from './v3/components/ChatbotToggler';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chatbot />} />
        <Route path="/v2" element={<Bot2 />} />
        <Route path="/v3" element={<ChatbotToggler />} />
      </Routes>
    </Router>
  );
}
export default App;