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

// Helper function to calculate end time based on start time and duration in minutes
function calculateEndTime(
  startTime: Date,
  durationMinutes: number
): Date {
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + durationMinutes);
  return endTime;
}

// Helper function to create appointment with proper slot times
function createAppointment(
  employeeId: string,
  serviceId: string,
  startTime: Date,
  durationMinutes: number,
  name: string,
  email: string,
  cancelledAt?: Date
) {
  const endTime = calculateEndTime(startTime, durationMinutes);
  return {
    employeeId,
    serviceId,
    startsAt: startTime,
    endsAt: endTime,
    date: startTime, // Add the date field
    name,
    email,
    ...(cancelledAt && { cancelledAt }),
  };
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
    ],
  });

  // Create New Look salon services
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
    hairCut &&
    beardTrim &&
    hairColoring &&
    hairStyling
  ) {
    await prisma.employeeService.createMany({
      data: [
        // Alice can perform all services (including Sarah's specialties)
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
      ],
    });

    // Create schedules for 2026
    // Use January 1, 2026 as the base date
    const baseDate2026 = new Date(2026, 0, 1); // January 1, 2026
    const currentDate = baseDate2026; // Use 2026 as the "current" date for seed data

    // Alice's schedule - works most days, but not Sundays
    await prisma.schedule.create({
      data: {
        employeeId: alice.id,
        startDate: baseDate2026,
        endDate: addYears(baseDate2026, 1), // Through December 31, 2026
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
        startDate: baseDate2026,
        endDate: addYears(baseDate2026, 1), // Through December 31, 2026
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

    // Create schedule exclusions for unavailable months in 2026
    await prisma.scheduleExculsion.createMany({
      data: [
        // Alice takes vacation in July 2026
        {
          employeeId: alice.id,
          startDate: new Date(2026, 6, 1), // July 1st, 2026
          endDate: new Date(2026, 6, 31), // July 31st, 2026
        },
        // Bob takes vacation in December 2026
        {
          employeeId: bob.id,
          startDate: new Date(2026, 11, 15), // December 15th, 2026
          endDate: new Date(2026, 11, 31), // December 31st, 2026
        },
      ],
    });

    // Create appointments for employees with proper slot times in 2026
    // Using January 1, 2026 as the base date
    const appointments = [
      // Past appointments (completed) - December 2025 (relative to Jan 1, 2026)
      createAppointment(
        alice.id,
        hairCut.id,
        new Date(2025, 11, 30, 10, 0), // December 30, 2025 at 10:00 AM
        hairCut.duration,
        'John Smith',
        'john.smith@email.com'
      ),
      createAppointment(
        bob.id,
        beardTrim.id,
        new Date(2025, 11, 31, 14, 0), // December 31, 2025 at 2:00 PM
        beardTrim.duration,
        'Mike Johnson',
        'mike.johnson@email.com'
      ),
      createAppointment(
        alice.id,
        hairColoring.id,
        new Date(2025, 11, 29, 11, 0), // December 29, 2025 at 11:00 AM
        hairColoring.duration,
        'Emily Davis',
        'emily.davis@email.com'
      ),

      // Future appointments (upcoming) in January 2026 - More realistic booking times
      createAppointment(
        alice.id,
        hairStyling.id,
        new Date(2026, 0, 2, 9, 0), // January 2, 2026 at 9:00 AM
        hairStyling.duration,
        'Lisa Wilson',
        'lisa.wilson@email.com'
      ),
      createAppointment(
        bob.id,
        hairCut.id,
        new Date(2026, 0, 2, 10, 0), // January 2, 2026 at 10:00 AM
        hairCut.duration,
        'David Brown',
        'david.brown@email.com'
      ),
      createAppointment(
        alice.id,
        hairStyling.id,
        new Date(2026, 0, 2, 11, 0), // January 2, 2026 at 11:00 AM
        hairStyling.duration,
        'Jennifer Lee',
        'jennifer.lee@email.com'
      ),
      createAppointment(
        bob.id,
        beardTrim.id,
        new Date(2026, 0, 2, 14, 0), // January 2, 2026 at 2:00 PM
        beardTrim.duration,
        'Chris Garcia',
        'chris.garcia@email.com'
      ),
      createAppointment(
        alice.id,
        hairColoring.id,
        new Date(2026, 0, 2, 15, 0), // January 2, 2026 at 3:00 PM
        hairColoring.duration,
        'Sarah Miller',
        'sarah.miller@email.com'
      ),

      // January 3, 2026 appointments
      createAppointment(
        alice.id,
        hairCut.id,
        new Date(2026, 0, 3, 9, 0), // January 3, 2026 at 9:00 AM
        hairCut.duration,
        'Tom Anderson',
        'tom.anderson@email.com'
      ),
      createAppointment(
        bob.id,
        hairStyling.id,
        new Date(2026, 0, 3, 10, 0), // January 3, 2026 at 10:00 AM
        hairStyling.duration,
        'Rachel Green',
        'rachel.green@email.com'
      ),
      createAppointment(
        alice.id,
        beardTrim.id,
        new Date(2026, 0, 3, 11, 0), // January 3, 2026 at 11:00 AM
        beardTrim.duration,
        'Alex Turner',
        'alex.turner@email.com'
      ),
      createAppointment(
        bob.id,
        hairCut.id,
        new Date(2026, 0, 3, 14, 0), // January 3, 2026 at 2:00 PM
        hairCut.duration,
        'Emma Wilson',
        'emma.wilson@email.com'
      ),

      // January 4, 2026 appointments
      createAppointment(
        alice.id,
        hairColoring.id,
        new Date(2026, 0, 4, 9, 0), // January 4, 2026 at 9:00 AM
        hairColoring.duration,
        'Michael Brown',
        'michael.brown@email.com'
      ),
      createAppointment(
        bob.id,
        beardTrim.id,
        new Date(2026, 0, 4, 10, 0), // January 4, 2026 at 10:00 AM
        beardTrim.duration,
        'Jessica Davis',
        'jessica.davis@email.com'
      ),
      createAppointment(
        alice.id,
        hairStyling.id,
        new Date(2026, 0, 4, 14, 0), // January 4, 2026 at 2:00 PM
        hairStyling.duration,
        'Kevin Johnson',
        'kevin.johnson@email.com'
      ),

      // January 5, 2026 appointments
      createAppointment(
        alice.id,
        hairCut.id,
        new Date(2026, 0, 5, 9, 0), // January 5, 2026 at 9:00 AM
        hairCut.duration,
        'Amanda Clark',
        'amanda.clark@email.com'
      ),
      createAppointment(
        bob.id,
        hairStyling.id,
        new Date(2026, 0, 5, 11, 0), // January 5, 2026 at 11:00 AM
        hairStyling.duration,
        'Ryan Taylor',
        'ryan.taylor@email.com'
      ),

      // Cancelled appointments
      createAppointment(
        alice.id,
        hairCut.id,
        new Date(2025, 11, 27, 9, 0), // December 27, 2025 at 9:00 AM
        hairCut.duration,
        'Robert Taylor',
        'robert.taylor@email.com',
        new Date(2025, 11, 26, 16, 0) // Cancelled December 26, 2025 at 4:00 PM
      ),
      createAppointment(
        alice.id,
        hairColoring.id,
        new Date(2026, 0, 2, 13, 0), // January 2, 2026 at 1:00 PM
        hairColoring.duration,
        'Amanda Clark',
        'amanda.clark@email.com',
        new Date(2026, 0, 1, 14, 0) // Cancelled January 1, 2026 at 2:00 PM
      ),
    ];

    await prisma.appointment.createMany({
      data: appointments,
    });
  }

  console.log(
    '✅ Seeded 2 employees, 4 services, employee-service relationships, schedules, exclusions, and 20 appointments for 2026'
  );
  console.log(
    '📋 Alice can perform: Hair Cut, Beard Trim, Hair Coloring, Hair Styling'
  );
  console.log('📋 Bob can perform: Hair Cut, Beard Trim');
  console.log('📅 Alice works: Mon-Sat 9-5 (Sat 10-4), not Sundays (2026)');
  console.log('📅 Bob works: Mon-Fri 10-4, not weekends (2026)');
  console.log('🚫 Alice unavailable: July 2026');
  console.log('🚫 Bob unavailable: December 15-31, 2026');
  console.log(
    '📝 Created 20 appointments: 3 past (Dec 2025), 15 future (Jan 2026), 2 cancelled'
  );
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
