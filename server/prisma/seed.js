// Populates the database with sample tasks, quiz questions, and achievements
// so there's something to test against right after migrating.
// Run with: npm run seed  (from the server/ folder)

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // --- Admin account (change the password after first login!) ---
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

  // --- Quiz task: General Knowledge ---
  const gkTask = await prisma.task.create({
    data: {
      type: 'QUIZ',
      title: 'General Knowledge Quiz',
      description: 'Answer a random general knowledge question.',
      category: 'general-knowledge',
      xpValue: 10,
      quizQuestions: {
        create: [
          { question: 'What is the capital of France?', correctAnswer: 'Paris', options: ['Paris', 'Rome', 'Berlin', 'Madrid'] },
          { question: 'How many continents are there?', correctAnswer: '7', options: ['5', '6', '7', '8'] },
          { question: 'What planet is known as the Red Planet?', correctAnswer: 'Mars', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'] },
        ],
      },
    },
  });

  // --- Quiz task: Housework ---
  await prisma.task.create({
    data: {
      type: 'QUIZ',
      title: 'Housework Know-How',
      description: 'Test your cleaning knowledge.',
      category: 'housework',
      xpValue: 15,
      quizQuestions: {
        create: [
          { question: 'What water temperature is best for washing dark-colored clothes?', correctAnswer: 'Cold water', options: ['Cold water', 'Boiling water', 'Hot water', 'No water'] },
          { question: 'How often should a kitchen sponge be replaced?', correctAnswer: 'Every 1-2 weeks', options: ['Every 1-2 weeks', 'Once a year', 'Never', 'Every 6 months'] },
        ],
      },
    },
  });

  // --- Photo tasks ---
  await prisma.task.createMany({
    data: [
      { type: 'PHOTO', title: 'Clean Your Room', description: 'Upload a photo of your tidied room.', category: 'housework', xpValue: 25 },
      { type: 'PHOTO', title: 'Exercise for 20 Minutes', description: 'Upload a photo showing proof of your workout.', category: 'fitness', xpValue: 25 },
      { type: 'PHOTO', title: 'Read for 30 Minutes', description: 'Upload a photo of the book you read.', category: 'education', xpValue: 20 },
    ],
  });

  // --- Achievements ---
  await prisma.achievement.createMany({
    data: [
      { name: 'First Task', description: 'Complete your first task.', icon: '🎯', unlockCondition: { type: 'tasksCompleted', value: 1 } },
      { name: 'Getting Started', description: 'Earn 100 XP.', icon: '⭐', unlockCondition: { type: 'xp', value: 100 } },
      { name: 'Dedicated', description: 'Complete 10 tasks.', icon: '🏅', unlockCondition: { type: 'tasksCompleted', value: 10 } },
      { name: 'Hard Worker', description: 'Complete 50 tasks.', icon: '💪', unlockCondition: { type: 'tasksCompleted', value: 50 } },
      { name: 'Quiz Master', description: 'Get 10 quiz questions correct.', icon: '🧠', unlockCondition: { type: 'quizCorrect', value: 10 } },
      { name: 'XP Hunter', description: 'Reach 1,000 XP.', icon: '🔥', unlockCondition: { type: 'xp', value: 1000 } },
      { name: 'Legendary', description: 'Reach 5,000 XP.', icon: '👑', unlockCondition: { type: 'xp', value: 5000 } },
    ],
  });

  console.log('Seed complete.');
  console.log(`Sample quiz task id: ${gkTask.id}`);
  console.log('Admin login: admin@example.com / Admin123!  (change this password!)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
