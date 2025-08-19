import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function main(): Promise<void> {
  // Clean existing data (in correct order to avoid foreign key conflicts)
  await prisma.employeeService.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.service.deleteMany({});
  console.log('🧹 Cleared all tables');

  // Create employees
  const employees = await prisma.employee.createMany({
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
  const services = await prisma.service.createMany({
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

  // Get the created records to use their IDs
  const alice = await prisma.employee.findFirst({
    where: { name: 'Alice Johnson' },
  });

  const bob = await prisma.employee.findFirst({
    where: { name: 'Bob Smith' },
  });

  const hairCut = await prisma.service.findFirst({
    where: { title: 'Hair Cut' },
  });

  const beardTrim = await prisma.service.findFirst({
    where: { title: 'Beard Trim' },
  });

  // Create employee-service relationships
  if (alice && bob && hairCut && beardTrim) {
    await prisma.employeeService.createMany({
      data: [
        // Alice can perform both services
        {
          employeeId: alice.id,
          serviceId: hairCut.id,
        },
        {
          employeeId: alice.id,
          serviceId: beardTrim.id,
        },
        // Bob can only perform hair cut
        {
          employeeId: bob.id,
          serviceId: hairCut.id,
        },
      ],
    });
  }

  console.log(
    '✅ Seeded 2 employees, 2 services, and employee-service relationships'
  );
  console.log('📋 Alice can perform: Hair Cut, Beard Trim');
  console.log('📋 Bob can perform: Hair Cut only');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
