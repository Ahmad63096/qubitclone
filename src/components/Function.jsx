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

export { animateBotReply, getSessionId};
