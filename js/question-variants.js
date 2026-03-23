/**
 * Structured question variant bank for qualification pipeline.
 * Each topic has 3-4 alternative phrasings used when evasive
 * responses are detected, allowing follow-up with fresh wording.
 */

export const questionVariants = {
  budget: [
    "What budget range have you set aside for this project?",
    "How much are you looking to invest in your website?",
    "What's the financial scope you're working with?",
    "Have you allocated a specific amount for this initiative?"
  ],
  timeline: [
    "When do you need the website ready by?",
    "What's your ideal launch date for this project?",
    "Is there a specific deadline driving this project?",
    "How soon are you looking to go live?"
  ],
  authority: [
    "Are you the decision-maker for this project?",
    "Who else is involved in approving this project?",
    "Will anyone else need to sign off on the website?",
    "Do you have the authority to move forward on this?"
  ],
  pain_specifics: [
    "What's the biggest challenge your current website creates?",
    "What specific problems are you trying to solve with a new site?",
    "How is your current web presence holding your business back?",
    "What frustrations do you experience with your current setup?"
  ]
};

export const TOPICS = Object.keys(questionVariants);

/**
 * Get a random variant for a topic.
 * @param {string} topic - One of: budget, timeline, authority, pain_specifics
 * @returns {string|null} A question variant or null if topic is invalid
 */
export function getRandomVariant(topic) {
  const variants = questionVariants[topic];
  if (!variants || variants.length === 0) return null;
  return variants[Math.floor(Math.random() * variants.length)];
}

/**
 * Get the next sequential variant for a topic based on attempt count.
 * Wraps around when attempts exceed available variants.
 * @param {string} topic - One of: budget, timeline, authority, pain_specifics
 * @param {number} attemptCount - The current attempt number (0-based)
 * @returns {string|null} A question variant or null if topic is invalid
 */
export function getNextVariant(topic, attemptCount) {
  const variants = questionVariants[topic];
  if (!variants || variants.length === 0) return null;
  return variants[attemptCount % variants.length];
}

/**
 * Select an alternative phrasing when an evasive response is detected.
 * Uses sequential selection to avoid repeating the same question.
 * @param {string} topic - The qualification topic
 * @param {number} previousAttempts - How many times this topic has been asked
 * @returns {{question: string, attemptNumber: number}|null}
 */
export function handleEvasiveResponse(topic, previousAttempts = 0) {
  const variants = questionVariants[topic];
  if (!variants || variants.length === 0) return null;
  const index = previousAttempts % variants.length;
  return {
    question: variants[index],
    attemptNumber: previousAttempts + 1
  };
}
