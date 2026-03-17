export const lowRiskNudges = [
  "Try a 5-minute breathing exercise. Research shows it can reduce anxiety up to 25% and improve focus.",
  "Take a short walk outside. Fresh air and movement can boost your mood and energy levels.",
  "Write down three things you're grateful for today. Gratitude practice enhances positive emotions.",
  "Call or text a friend. Social connection is a powerful mood booster.",
  "Listen to your favorite upbeat music. It can instantly lift your spirits.",
  "Do a quick stretching routine. Physical movement releases feel-good endorphins.",
  "Try a new hobby or activity you've been curious about. Novelty sparks joy.",
  "Spend 10 minutes in nature. Studies show it reduces stress and improves mental clarity.",
  "Practice a short mindfulness meditation. Even 5 minutes can calm your mind.",
  "Treat yourself to something small you enjoy, like a favorite snack or coffee.",
  "Watch a funny video or comedy show. Laughter truly is great medicine.",
  "Help someone else with a small act of kindness. Giving boosts happiness.",
  "Set one small, achievable goal for today and celebrate when you complete it.",
  "Take a few minutes to declutter your space. A tidy environment can clear your mind.",
  "Do something creative - draw, write, or make something with your hands."
];

export const mediumRiskNudges = [
  "Practice deep breathing for 10 minutes. Focus on slow, controlled breaths to calm your nervous system.",
  "Reach out to a trusted friend or family member. Talking about your feelings can provide relief.",
  "Create a simple self-care routine for today. Small acts of self-compassion matter.",
  "Try progressive muscle relaxation. Tense and release each muscle group to reduce physical tension.",
  "Limit social media and news consumption today. Digital detox can reduce anxiety.",
  "Journal about your thoughts and feelings. Writing helps process emotions.",
  "Engage in moderate exercise like yoga or a brisk walk. Physical activity reduces stress hormones.",
  "Practice positive self-talk. Challenge negative thoughts with kinder perspectives.",
  "Establish a consistent sleep schedule. Quality rest is crucial for mental health.",
  "Try a guided meditation app or video. Structured relaxation can be very effective.",
  "Break large tasks into smaller, manageable steps. Progress reduces overwhelm.",
  "Spend time with pets or animals. Animal interaction lowers stress and anxiety.",
  "Listen to calming music or nature sounds. Soothing audio can regulate emotions.",
  "Practice saying 'no' to additional commitments. Protecting your energy is important.",
  "Create a worry time - set aside 15 minutes to address concerns, then move on."
];

export const highRiskNudges = [
  "Please consider reaching out to a mental health professional. You don't have to face this alone.",
  "Contact a crisis helpline if you're having thoughts of self-harm. Help is available 24/7.",
  "Talk to someone you trust about how you're feeling. Support from others is crucial.",
  "Practice grounding techniques: name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste.",
  "Focus on basic self-care: eat regular meals, stay hydrated, and maintain sleep hygiene.",
  "Avoid making major life decisions right now. Give yourself time and support first.",
  "Use a crisis text line or app for immediate support. You deserve help and compassion.",
  "Create a safety plan with emergency contacts and coping strategies readily available.",
  "Practice deep breathing exercises every few hours to manage acute stress and anxiety.",
  "Limit alcohol and avoid substances. They can worsen depression and anxiety.",
  "Break your day into small, achievable tasks. Focus on one thing at a time.",
  "Spend time in a safe, comfortable environment. Create a calming space for yourself.",
  "Consider joining a support group. Connecting with others who understand can help.",
  "Schedule an appointment with a counselor or therapist as soon as possible.",
  "Remember: this feeling is temporary. Professional help can make a real difference."
];

export const getRandomNudge = (riskLevel?: string): string => {
  if (!riskLevel) return "Take your first depression check-in to unlock personalized nudges.";
  
  let nudgeArray: string[];
  if (riskLevel === 'Low') {
    nudgeArray = lowRiskNudges;
  } else if (riskLevel === 'Medium') {
    nudgeArray = mediumRiskNudges;
  } else {
    nudgeArray = highRiskNudges;
  }
  const randomIndex = Math.floor(Math.random() * nudgeArray.length);
  return nudgeArray[randomIndex];
};
