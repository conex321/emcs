/**
 * Interactive Activity Data for Grades K-5
 *
 * These activities follow the IXL-style pattern for engaging
 * elementary students with immediate feedback.
 */

export const activities = {
  // =========================================
  // GRADE 1 MATH ACTIVITIES
  // =========================================

  'ACT-G1MATH001': {
    activityId: 'ACT-G1MATH001',
    grade: '1',
    subject: 'Math',
    topic: 'Number Sense and Numeration',
    skill: 'Counting objects to 10',
    difficulty: 'easy',
    type: 'multipleChoice',
    prompt: {
      text: 'How many fire trucks are there?',
      subtext: 'Count the fire trucks carefully.',
      voiceover: true,
    },
    media: {
      image: '/assets/activities/g1/counting/firetrucks-3.png',
      imageAlt: 'Three red fire trucks in a row',
      animation: null,
    },
    choices: [
      { value: 1, display: '1' },
      { value: 2, display: '2' },
      { value: 3, display: '3' },
      { value: 4, display: '4' },
    ],
    answer: 3,
    acceptedAnswers: [3],
    feedback: {
      correct: {
        text: 'Great job! There are 3 fire trucks!',
        animation: 'stars',
        encouragement: [
          "You're a counting superstar!",
          'Excellent counting!',
          'You got it right!',
        ],
      },
      incorrect: {
        text: 'Not quite. Try counting again!',
        hint: 'Point to each fire truck as you count: 1, 2, 3...',
        showCorrectAfter: 2,
        encouragement: [
          'Keep trying!',
          'You can do it!',
          "Let's count together!",
        ],
      },
    },
    accessibility: {
      screenReaderText: 'Image shows three red fire trucks. Question: How many fire trucks are there? Options: 1, 2, 3, or 4.',
      keyboardNavigable: true,
      highContrastMode: true,
    },
    metadata: {
      ontarioCurriculum: 'B1.1',
      estimatedTime: 30,
      tags: ['counting', 'numbers-to-10', 'vehicles'],
    },
  },

  'ACT-G1MATH002': {
    activityId: 'ACT-G1MATH002',
    grade: '1',
    subject: 'Math',
    topic: 'Number Sense and Numeration',
    skill: 'Addition to 10',
    difficulty: 'medium',
    type: 'numericInput',
    prompt: {
      text: 'There are 2 red apples and 3 green apples. How many apples are there in all?',
      subtext: 'Type your answer in the box.',
      voiceover: true,
    },
    media: {
      image: '/assets/activities/g1/addition/apples-2-plus-3.png',
      imageAlt: 'Two red apples on the left and three green apples on the right',
      animation: null,
    },
    choices: null,
    answer: 5,
    acceptedAnswers: [5, '5', 'five', 'Five'],
    validation: {
      caseSensitive: false,
      trimWhitespace: true,
      numericTolerance: 0,
    },
    feedback: {
      correct: {
        text: 'Fantastic! 2 + 3 = 5. There are 5 apples altogether!',
        animation: 'confetti',
        encouragement: [
          "You're an addition expert!",
          'Super math skills!',
          "That's exactly right!",
        ],
      },
      incorrect: {
        text: "That's not quite right. Let's count together!",
        hint: 'Start with the red apples (2), then count on with the green apples: 3, 4, 5!',
        showCorrectAfter: 3,
        encouragement: [
          'Almost there!',
          'Try counting all the apples!',
          "Don't give up!",
        ],
      },
    },
    accessibility: {
      screenReaderText: 'Image shows 2 red apples and 3 green apples. Question: How many apples are there in all? Enter a number.',
      keyboardNavigable: true,
      highContrastMode: true,
    },
    metadata: {
      ontarioCurriculum: 'B2.1',
      estimatedTime: 45,
      tags: ['addition', 'numbers-to-10', 'combining', 'fruit'],
    },
  },

  'ACT-G1MATH003': {
    activityId: 'ACT-G1MATH003',
    grade: '1',
    subject: 'Math',
    topic: 'Number Sense and Numeration',
    skill: 'Comparing quantities',
    difficulty: 'medium',
    type: 'multipleChoice',
    prompt: {
      text: 'Which group has MORE stars?',
      subtext: 'Look at both groups and pick the one with more.',
      voiceover: true,
    },
    media: {
      image: '/assets/activities/g1/comparing/stars-4-vs-7.png',
      imageAlt: 'Group A shows 4 yellow stars. Group B shows 7 yellow stars.',
    },
    choices: [
      {
        value: 'A',
        display: 'Group A (4 stars)',
        image: '/assets/activities/g1/comparing/group-a-4stars.png',
      },
      {
        value: 'B',
        display: 'Group B (7 stars)',
        image: '/assets/activities/g1/comparing/group-b-7stars.png',
      },
    ],
    answer: 'B',
    acceptedAnswers: ['B', 'b', 'Group B'],
    feedback: {
      correct: {
        text: "You're right! Group B has MORE stars. 7 is more than 4!",
        animation: 'thumbsUp',
        encouragement: [
          'Great comparing!',
          'You know your numbers!',
          'Super work!',
        ],
      },
      incorrect: {
        text: "Hmm, let's look again.",
        hint: 'Count the stars in each group. Group A has 4 stars. Group B has 7 stars. Which number is bigger?',
        showCorrectAfter: 2,
        encouragement: [
          'Count carefully!',
          'Which number is bigger?',
          "You've got this!",
        ],
      },
    },
    accessibility: {
      screenReaderText: 'Two groups of stars. Group A has 4 stars. Group B has 7 stars. Question: Which group has more stars?',
      keyboardNavigable: true,
      highContrastMode: true,
    },
    metadata: {
      ontarioCurriculum: 'B1.3',
      estimatedTime: 40,
      tags: ['comparing', 'more-less', 'counting', 'quantities'],
    },
  },

  // =========================================
  // ADDITIONAL GRADE 1 ACTIVITIES (TEMPLATES)
  // =========================================

  'ACT-G1MATH004': {
    activityId: 'ACT-G1MATH004',
    grade: '1',
    subject: 'Math',
    topic: 'Number Sense and Numeration',
    skill: 'Subtraction to 10',
    difficulty: 'medium',
    type: 'multipleChoice',
    prompt: {
      text: 'There are 5 balloons. 2 fly away. How many balloons are left?',
      subtext: 'Choose the correct answer.',
      voiceover: true,
    },
    media: {
      image: '/assets/activities/g1/subtraction/balloons-5-minus-2.png',
      imageAlt: 'Five colorful balloons with two floating away',
    },
    choices: [
      { value: 1, display: '1' },
      { value: 2, display: '2' },
      { value: 3, display: '3' },
      { value: 4, display: '4' },
    ],
    answer: 3,
    acceptedAnswers: [3],
    feedback: {
      correct: {
        text: 'Awesome! 5 - 2 = 3. There are 3 balloons left!',
        animation: 'stars',
        encouragement: [
          'Super subtraction!',
          "You're a math whiz!",
          'Perfect!',
        ],
      },
      incorrect: {
        text: 'Not quite right. Count what remains!',
        hint: 'Start with 5 balloons. Take away 2. Count what is left: 1, 2, 3!',
        showCorrectAfter: 2,
        encouragement: [
          'Try again!',
          "You're doing great!",
          'Almost there!',
        ],
      },
    },
    accessibility: {
      screenReaderText: 'Image shows 5 balloons with 2 flying away. Question: How many balloons are left? Options: 1, 2, 3, or 4.',
      keyboardNavigable: true,
      highContrastMode: true,
    },
    metadata: {
      ontarioCurriculum: 'B2.2',
      estimatedTime: 40,
      tags: ['subtraction', 'numbers-to-10', 'taking-away'],
    },
  },

  'ACT-G1MATH005': {
    activityId: 'ACT-G1MATH005',
    grade: '1',
    subject: 'Math',
    topic: 'Number Sense and Numeration',
    skill: 'Number order',
    difficulty: 'easy',
    type: 'multipleChoice',
    prompt: {
      text: 'What number comes AFTER 6?',
      subtext: 'Think about counting: 1, 2, 3, 4, 5, 6, ...',
      voiceover: true,
    },
    media: {
      image: '/assets/activities/g1/ordering/number-line-6.png',
      imageAlt: 'A number line showing numbers 1 through 8, with 6 highlighted',
    },
    choices: [
      { value: 5, display: '5' },
      { value: 6, display: '6' },
      { value: 7, display: '7' },
      { value: 8, display: '8' },
    ],
    answer: 7,
    acceptedAnswers: [7],
    feedback: {
      correct: {
        text: 'Yes! 7 comes after 6!',
        animation: 'thumbsUp',
        encouragement: [
          'You know your numbers!',
          'Great counting!',
          'Perfect!',
        ],
      },
      incorrect: {
        text: 'Think about the counting order.',
        hint: 'Count up from 6: six... seven! What comes next?',
        showCorrectAfter: 2,
        encouragement: [
          'Count along!',
          "What's next?",
          'You can do it!',
        ],
      },
    },
    accessibility: {
      screenReaderText: 'Question: What number comes after 6? Options: 5, 6, 7, or 8.',
      keyboardNavigable: true,
      highContrastMode: true,
    },
    metadata: {
      ontarioCurriculum: 'B1.2',
      estimatedTime: 25,
      tags: ['number-order', 'counting', 'sequence'],
    },
  },
};

// =========================================
// ACTIVITY COLLECTIONS BY GRADE/SUBJECT
// =========================================

export const activityCollections = {
  'grade-1': {
    math: [
      'ACT-G1MATH001',
      'ACT-G1MATH002',
      'ACT-G1MATH003',
      'ACT-G1MATH004',
      'ACT-G1MATH005',
    ],
    science: [],
    english: [],
  },
  'grade-2': {
    math: [],
    science: [],
    english: [],
  },
  'grade-3': {
    math: [],
    science: [],
    english: [],
  },
};

// =========================================
// HELPER FUNCTIONS
// =========================================

/**
 * Get activity by ID
 */
export function getActivity(activityId) {
  return activities[activityId] || null;
}

/**
 * Get activities for a grade and subject
 */
export function getActivitiesForGradeSubject(grade, subject) {
  const gradeKey = `grade-${grade}`;
  const subjectKey = subject.toLowerCase();

  const activityIds = activityCollections[gradeKey]?.[subjectKey] || [];
  return activityIds.map(id => activities[id]).filter(Boolean);
}

/**
 * Check if answer is correct
 */
export function checkAnswer(activity, userAnswer) {
  if (!activity) return { correct: false, error: 'Activity not found' };

  const { answer, acceptedAnswers, validation } = activity;

  // Normalize user answer
  let normalizedAnswer = userAnswer;
  if (validation?.trimWhitespace) {
    normalizedAnswer = String(normalizedAnswer).trim();
  }
  if (!validation?.caseSensitive) {
    normalizedAnswer = String(normalizedAnswer).toLowerCase();
  }

  // Check against accepted answers
  const acceptedList = acceptedAnswers || [answer];
  const isCorrect = acceptedList.some(accepted => {
    let normalizedAccepted = String(accepted);
    if (!validation?.caseSensitive) {
      normalizedAccepted = normalizedAccepted.toLowerCase();
    }
    if (typeof accepted === 'number' && typeof userAnswer === 'number') {
      const tolerance = validation?.numericTolerance || 0;
      return Math.abs(accepted - userAnswer) <= tolerance;
    }
    return normalizedAnswer === normalizedAccepted;
  });

  return {
    correct: isCorrect,
    feedback: isCorrect ? activity.feedback.correct : activity.feedback.incorrect,
    correctAnswer: answer,
  };
}

/**
 * Get random encouragement message
 */
export function getRandomEncouragement(feedbackType) {
  const messages = feedbackType.encouragement || [];
  if (messages.length === 0) return '';
  return messages[Math.floor(Math.random() * messages.length)];
}

export default {
  activities,
  activityCollections,
  getActivity,
  getActivitiesForGradeSubject,
  checkAnswer,
  getRandomEncouragement,
};
