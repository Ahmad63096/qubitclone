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

export { animateBotReply };
