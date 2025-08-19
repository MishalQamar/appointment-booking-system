import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function main(): Promise<void> {
  // Clean existing data
  await prisma.employee.deleteMany({});
  await prisma.service.deleteMany({});
  console.log('🧹 Cleared employees and services tables');

  // Create employees
  await prisma.employee.createMany({
    data: [
      {
        name: 'Alice Johnson',
        profilePictureUrl: 'https://example.com/alice.jpg',
        createdAt: daysAgo(7),
      },
      {
        name: 'Bob Smith',
        profilePictureUrl: 'https://example.com/bob.jpg',
        createdAt: daysAgo(1),
      },
    ],
  });

  // Create salon services
  await prisma.service.createMany({
    data: [
      {
        title: 'Hair Cut',
        price: 2500, // $25.00
        duration: 30, // 30 minutes
        createdAt: daysAgo(10),
      },
      {
        title: 'Beard Trim',
        price: 1500, // $15.00
        duration: 15, // 15 minutes
        createdAt: daysAgo(10),
      },
    ],
  });

  console.log('✅ Seeded 2 employees and 2 salon services');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
