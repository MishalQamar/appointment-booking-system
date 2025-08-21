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
        profilePictureUrl:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
        createdAt: daysAgo(7),
      },
      {
        name: 'Bob Smith',
        profilePictureUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        createdAt: daysAgo(1),
      },
      {
        name: 'Sarah Wilson',
        profilePictureUrl:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        createdAt: daysAgo(3),
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
      {
        title: 'Hair Coloring',
        price: 4500, // $45.00
        duration: 90, // 90 minutes
        createdAt: daysAgo(10),
      },
      {
        title: 'Hair Styling',
        price: 3500, // $35.00
        duration: 45, // 45 minutes
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

  const sarah = await prisma.employee.findFirst({
    where: { name: 'Sarah Wilson' },
  });

  const hairCut = await prisma.service.findFirst({
    where: { title: 'Hair Cut' },
  });

  const beardTrim = await prisma.service.findFirst({
    where: { title: 'Beard Trim' },
  });

  const hairColoring = await prisma.service.findFirst({
    where: { title: 'Hair Coloring' },
  });

  const hairStyling = await prisma.service.findFirst({
    where: { title: 'Hair Styling' },
  });

  // Create employee-service relationships
  if (
    alice &&
    bob &&
    sarah &&
    hairCut &&
    beardTrim &&
    hairColoring &&
    hairStyling
  ) {
    await prisma.employeeService.createMany({
      data: [
        // Alice can perform all services
        {
          employeeId: alice.id,
          serviceId: hairCut.id,
        },
        {
          employeeId: alice.id,
          serviceId: beardTrim.id,
        },
        {
          employeeId: alice.id,
          serviceId: hairColoring.id,
        },
        {
          employeeId: alice.id,
          serviceId: hairStyling.id,
        },
        // Bob can perform hair cut and beard trim
        {
          employeeId: bob.id,
          serviceId: hairCut.id,
        },
        {
          employeeId: bob.id,
          serviceId: beardTrim.id,
        },
        // Sarah specializes in hair coloring and styling
        {
          employeeId: sarah.id,
          serviceId: hairColoring.id,
        },
        {
          employeeId: sarah.id,
          serviceId: hairStyling.id,
        },
        {
          employeeId: sarah.id,
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

    // Sarah's schedule - works Tuesday to Saturday, specializes in longer appointments
    await prisma.schedule.create({
      data: {
        employeeId: sarah.id,
        startDate: currentDate,
        endDate: addYears(currentDate, 1),
        // Tuesday to Saturday
        mondayStartsAt: null,
        mondayEndsAt: null,
        tuesdayStartsAt: '09:00',
        tuesdayEndsAt: '18:00',
        wednesdayStartsAt: '09:00',
        wednesdayEndsAt: '18:00',
        thursdayStartsAt: '09:00',
        thursdayEndsAt: '18:00',
        fridayStartsAt: '09:00',
        fridayEndsAt: '18:00',
        saturdayStartsAt: '10:00',
        saturdayEndsAt: '16:00',
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
    '✅ Seeded 3 employees, 4 services, employee-service relationships, schedules, and exclusions'
  );
  console.log(
    '📋 Alice can perform: Hair Cut, Beard Trim, Hair Coloring, Hair Styling'
  );
  console.log('📋 Bob can perform: Hair Cut, Beard Trim');
  console.log(
    '📋 Sarah can perform: Hair Coloring, Hair Styling, Hair Cut'
  );
  console.log('📅 Alice works: Mon-Sat 9-5 (Sat 10-4), not Sundays');
  console.log('📅 Bob works: Mon-Fri 10-4, not weekends');
  console.log('📅 Sarah works: Tue-Sat 9-6 (Sat 10-4), not Mon/Sun');
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
