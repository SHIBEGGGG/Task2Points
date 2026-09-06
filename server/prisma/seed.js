const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  await prisma.task.create({
    data: {
      type: 'QUIZ', title: 'General Knowledge Quiz', description: 'Answer a random general knowledge question.',
      category: 'general-knowledge', xpValue: 10,
      quizQuestions: { create: [
        { question: 'What is the capital of France?', correctAnswer: 'Paris', options: ['Paris', 'Rome', 'Berlin', 'Madrid'] },
        { question: 'How many continents are there?', correctAnswer: '7', options: ['5', '6', '7', '8'] },
        { question: 'What planet is known as the Red Planet?', correctAnswer: 'Mars', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'] },
        { question: 'What is the largest ocean on Earth?', correctAnswer: 'Pacific Ocean', options: ['Atlantic Ocean', 'Pacific Ocean', 'Indian Ocean', 'Arctic Ocean'] },
        { question: 'How many strings does a standard guitar have?', correctAnswer: '6', options: ['4', '5', '6', '7'] },
      ]},
    },
  });

  await prisma.task.create({
    data: {
      type: 'QUIZ', title: 'Housework Know-How', description: 'Test your cleaning knowledge.',
      category: 'housework', xpValue: 15,
      quizQuestions: { create: [
        { question: 'What water temperature is best for washing dark-colored clothes?', correctAnswer: 'Cold water', options: ['Cold water', 'Boiling water', 'Hot water', 'No water'] },
        { question: 'How often should a kitchen sponge be replaced?', correctAnswer: 'Every 1-2 weeks', options: ['Every 1-2 weeks', 'Once a year', 'Never', 'Every 6 months'] },
        { question: 'What should you do before washing greasy dishes?', correctAnswer: 'Wipe off excess grease first', options: ['Wipe off excess grease first', 'Use only cold water', 'Skip soap', 'Soak overnight only'] },
        { question: 'Which surface should NOT be cleaned with bleach?', correctAnswer: 'Marble countertops', options: ['Marble countertops', 'Ceramic tile', 'Glass', 'Stainless steel'] },
      ]},
    },
  });

  await prisma.task.create({
    data: {
      type: 'QUIZ', title: 'Science Quiz', description: 'Basic science trivia.',
      category: 'science', xpValue: 15,
      quizQuestions: { create: [
        { question: 'What gas do plants absorb from the air?', correctAnswer: 'Carbon dioxide', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'] },
        { question: 'What is the chemical symbol for water?', correctAnswer: 'H2O', options: ['H2O', 'CO2', 'O2', 'NaCl'] },
        { question: 'How many bones are in the adult human body?', correctAnswer: '206', options: ['186', '206', '226', '246'] },
        { question: 'What force pulls objects toward Earth?', correctAnswer: 'Gravity', options: ['Magnetism', 'Friction', 'Gravity', 'Inertia'] },
      ]},
    },
  });

  await prisma.task.create({
    data: {
      type: 'QUIZ', title: 'Geography Challenge', description: 'How well do you know the world?',
      category: 'geography', xpValue: 15,
      quizQuestions: { create: [
        { question: 'Which is the longest river in the world?', correctAnswer: 'Nile', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'] },
        { question: 'Which country has the most population?', correctAnswer: 'India', options: ['China', 'India', 'USA', 'Indonesia'] },
        { question: 'Mount Everest is located in which mountain range?', correctAnswer: 'Himalayas', options: ['Andes', 'Alps', 'Himalayas', 'Rockies'] },
        { question: 'Which desert is the largest in the world?', correctAnswer: 'Sahara', options: ['Gobi', 'Sahara', 'Mojave', 'Kalahari'] },
      ]},
    },
  });

  await prisma.task.create({
    data: {
      type: 'QUIZ', title: 'Coding Basics Quiz', description: 'Beginner programming concepts.',
      category: 'tech', xpValue: 20,
      quizQuestions: { create: [
        { question: 'What does HTML stand for?', correctAnswer: 'HyperText Markup Language', options: ['HyperText Markup Language', 'HighText Machine Language', 'HyperTransfer Markup Language', 'Home Tool Markup Language'] },
        { question: 'Which symbol is used for comments in JavaScript (single line)?', correctAnswer: '//', options: ['//', '#', '<!-- -->', '**'] },
        { question: 'What does CSS stand for?', correctAnswer: 'Cascading Style Sheets', options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style System', 'Colorful Style Sheets'] },
        { question: 'Which data type holds true/false values?', correctAnswer: 'Boolean', options: ['String', 'Integer', 'Boolean', 'Float'] },
      ]},
    },
  });

  await prisma.task.create({
    data: {
      type: 'QUIZ', title: 'Math Warm-Up', description: 'Quick arithmetic and logic questions.',
      category: 'math', xpValue: 10,
      quizQuestions: { create: [
        { question: 'What is 12 x 8?', correctAnswer: '96', options: ['86', '96', '106', '112'] },
        { question: 'What is the square root of 144?', correctAnswer: '12', options: ['10', '11', '12', '14'] },
        { question: 'What is 15% of 200?', correctAnswer: '30', options: ['20', '25', '30', '35'] },
      ]},
    },
  });

  await prisma.task.createMany({
    data: [
      { type: 'PHOTO', title: 'Clean Your Room', description: 'Upload a photo of your tidied room.', category: 'housework', xpValue: 25 },
      { type: 'PHOTO', title: 'Wash the Dishes', description: 'Upload a photo of your clean, empty sink.', category: 'housework', xpValue: 15 },
      { type: 'PHOTO', title: 'Exercise for 20 Minutes', description: 'Upload a photo showing proof of your workout.', category: 'fitness', xpValue: 25 },
      { type: 'PHOTO', title: 'Read for 30 Minutes', description: 'Upload a photo of the book you read.', category: 'education', xpValue: 20 },
      { type: 'PHOTO', title: 'Organize Your Desk', description: 'Upload a before/after or final photo of your desk.', category: 'housework', xpValue: 15 },
      { type: 'PHOTO', title: 'Cook a Meal', description: 'Upload a photo of a meal you cooked yourself.', category: 'lifestyle', xpValue: 20 },
      { type: 'PHOTO', title: 'Water the Plants', description: 'Upload a photo of your watered plants.', category: 'lifestyle', xpValue: 10 },
      { type: 'PHOTO', title: 'Take Out the Trash', description: 'Upload a photo confirming the trash is out.', category: 'housework', xpValue: 10 },
    ],
  });

  await prisma.achievement.createMany({
    data: [
      { name: 'First Task', description: 'Complete your first task.', icon: 'target', unlockCondition: { type: 'tasksCompleted', value: 1 } },
      { name: 'Getting Started', description: 'Earn 100 XP.', icon: 'star', unlockCondition: { type: 'xp', value: 100 } },
      { name: 'Dedicated', description: 'Complete 10 tasks.', icon: 'medal', unlockCondition: { type: 'tasksCompleted', value: 10 } },
      { name: 'Hard Worker', description: 'Complete 50 tasks.', icon: 'dumbbell', unlockCondition: { type: 'tasksCompleted', value: 50 } },
      { name: 'Quiz Master', description: 'Get 10 quiz questions correct.', icon: 'book', unlockCondition: { type: 'quizCorrect', value: 10 } },
      { name: 'Trivia Wizard', description: 'Get 50 quiz questions correct.', icon: 'book', unlockCondition: { type: 'quizCorrect', value: 50 } },
      { name: 'Streak Starter', description: 'Complete tasks 3 days in a row.', icon: 'flame', unlockCondition: { type: 'streak', value: 3 } },
      { name: 'Streak Master', description: 'Complete tasks 7 days in a row.', icon: 'flame', unlockCondition: { type: 'streak', value: 7 } },
      { name: 'XP Hunter', description: 'Reach 1,000 XP.', icon: 'crown', unlockCondition: { type: 'xp', value: 1000 } },
      { name: 'Legendary', description: 'Reach 5,000 XP.', icon: 'trophy', unlockCondition: { type: 'xp', value: 5000 } },
    ],
  });

  console.log('Seed complete - expanded task and achievement set loaded.');
  console.log('Admin login: admin@example.com / Admin123!  (change this password!)');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });