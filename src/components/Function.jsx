import anime from 'animejs/lib/anime.es.js';  // Ensure anime.js is imported

const animateBotReply = (id) => {
  const replyElement = document.querySelector(`#message-${id}`);
  if (replyElement) {
    anime({
      targets: replyElement,
      opacity: [0, 1],         // Fade-in effect
      translateY: [50, 0],     // Slide in from below
      duration: 700,           // Smooth animation
      easing: "easeInOutCubic",
    });
  }
};
function generateSessionId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
function getSessionId() {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('session_id', sessionId);
      console.log('New session created:', sessionId);
  } else {
      console.log('Existing session:', sessionId);
  }

  return sessionId;
}


async function getVisitorIp() {
  try {
      const response = await fetch("https://api.ipify.org?format=json");
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("Visitor's IP address:", data.ip); // Correctly log the IP address
      return data.ip; // Return only the IP address

  } catch (error) {
      console.error("Error fetching IP address:", error);
      return null;
  }
}

export { animateBotReply, getSessionId,getVisitorIp};
