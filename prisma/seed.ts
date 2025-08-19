import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function addYears(date: Date, years: number): Date {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
}

function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}

async function main(): Promise<void> {
  // Clean existing data (in correct order to avoid foreign key conflicts)
  await prisma.appointment.deleteMany({});
  await prisma.scheduleExculsion.deleteMany({});
  await prisma.schedule.deleteMany({});
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

    // Create schedules with one-year gaps
    const currentDate = new Date();

    // Alice's schedule - works most days, but not Sundays
    await prisma.schedule.create({
      data: {
        employeeId: alice.id,
        startDate: currentDate,
        endDate: addYears(currentDate, 1),
        // Monday to Saturday - full time
        mondayStartsAt: '09:00',
        mondayEndsAt: '17:00',
        tuesdayStartsAt: '09:00',
        tuesdayEndsAt: '17:00',
        wednesdayStartsAt: '09:00',
        wednesdayEndsAt: '17:00',
        thursdayStartsAt: '09:00',
        thursdayEndsAt: '17:00',
        fridayStartsAt: '09:00',
        fridayEndsAt: '17:00',
        saturdayStartsAt: '10:00',
        saturdayEndsAt: '16:00',
        // Sunday - null (not working)
        sundayStartsAt: null,
        sundayEndsAt: null,
      },
    });

    // Bob's schedule - works weekdays only, shorter hours
    await prisma.schedule.create({
      data: {
        employeeId: bob.id,
        startDate: currentDate,
        endDate: addYears(currentDate, 1),
        // Monday to Friday only
        mondayStartsAt: '10:00',
        mondayEndsAt: '16:00',
        tuesdayStartsAt: '10:00',
        tuesdayEndsAt: '16:00',
        wednesdayStartsAt: '10:00',
        wednesdayEndsAt: '16:00',
        thursdayStartsAt: '10:00',
        thursdayEndsAt: '16:00',
        fridayStartsAt: '10:00',
        fridayEndsAt: '16:00',
        // Weekend - null (not working)
        saturdayStartsAt: null,
        saturdayEndsAt: null,
        sundayStartsAt: null,
        sundayEndsAt: null,
      },
    });

    // Create schedule exclusions for unavailable months
    await prisma.scheduleExculsion.createMany({
      data: [
        // Alice takes vacation in July
        {
          employeeId: alice.id,
          startDate: new Date(currentDate.getFullYear(), 6, 1), // July 1st
          endDate: new Date(currentDate.getFullYear(), 6, 31), // July 31st
        },
        // Bob takes vacation in December
        {
          employeeId: bob.id,
          startDate: new Date(currentDate.getFullYear(), 11, 15), // December 15th
          endDate: new Date(currentDate.getFullYear(), 11, 31), // December 31st
        },
        // Alice also unavailable in March for training
        {
          employeeId: alice.id,
          startDate: new Date(currentDate.getFullYear(), 2, 10), // March 10th
          endDate: new Date(currentDate.getFullYear(), 2, 20), // March 20th
        },
      ],
    });
  }

  console.log(
    '✅ Seeded 2 employees, 2 services, employee-service relationships, schedules, and exclusions'
  );
  console.log('📋 Alice can perform: Hair Cut, Beard Trim');
  console.log('📋 Bob can perform: Hair Cut only');
  console.log('📅 Alice works: Mon-Sat 9-5 (Sat 10-4), not Sundays');
  console.log('📅 Bob works: Mon-Fri 10-4, not weekends');
  console.log('🚫 Alice unavailable: July, March 10-20');
  console.log('🚫 Bob unavailable: December 15-31');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
