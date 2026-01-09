import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function addYears(date: Date, years: number): Date {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
}

function calculateEndTime(startTime: Date, durationMinutes: number): Date {
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + durationMinutes);
  return endTime;
}

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
    date: startTime,
    name,
    email,
    ...(cancelledAt && { cancelledAt }),
  };
}

export async function POST(request: NextRequest) {
  // Simple security check - use a secret key from environment variable
  const authHeader = request.headers.get('authorization');
  const expectedSecret = process.env.SEED_SECRET || 'your-secret-key-change-this';

  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Clean existing data
    await prisma.appointment.deleteMany({});
    await prisma.scheduleExculsion.deleteMany({});
    await prisma.schedule.deleteMany({});
    await prisma.employeeService.deleteMany({});
    await prisma.employee.deleteMany({});
    await prisma.service.deleteMany({});

    // Create employees
    await prisma.employee.createMany({
      data: [
        {
          name: 'Alice Johnson',
          profilePictureUrl:
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
          createdAt: new Date(2025, 11, 25), // 7 days before Jan 1, 2026
        },
        {
          name: 'Bob Smith',
          profilePictureUrl:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
          createdAt: new Date(2025, 11, 31), // 1 day before Jan 1, 2026
        },
      ],
    });

    // Create services
    await prisma.service.createMany({
      data: [
        {
          title: 'Hair Cut',
          price: 2500,
          duration: 30,
          createdAt: new Date(2025, 11, 22),
        },
        {
          title: 'Beard Trim',
          price: 1500,
          duration: 15,
          createdAt: new Date(2025, 11, 22),
        },
        {
          title: 'Hair Coloring',
          price: 4500,
          duration: 90,
          createdAt: new Date(2025, 11, 22),
        },
        {
          title: 'Hair Styling',
          price: 3500,
          duration: 45,
          createdAt: new Date(2025, 11, 22),
        },
      ],
    });

    // Get created records
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

    if (alice && bob && hairCut && beardTrim && hairColoring && hairStyling) {
      // Create employee-service relationships
      await prisma.employeeService.createMany({
        data: [
          { employeeId: alice.id, serviceId: hairCut.id },
          { employeeId: alice.id, serviceId: beardTrim.id },
          { employeeId: alice.id, serviceId: hairColoring.id },
          { employeeId: alice.id, serviceId: hairStyling.id },
          { employeeId: bob.id, serviceId: hairCut.id },
          { employeeId: bob.id, serviceId: beardTrim.id },
        ],
      });

      // Create schedules for 2026
      const baseDate2026 = new Date(2026, 0, 1);

      await prisma.schedule.create({
        data: {
          employeeId: alice.id,
          startDate: baseDate2026,
          endDate: addYears(baseDate2026, 1),
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
          sundayStartsAt: null,
          sundayEndsAt: null,
        },
      });

      await prisma.schedule.create({
        data: {
          employeeId: bob.id,
          startDate: baseDate2026,
          endDate: addYears(baseDate2026, 1),
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
          saturdayStartsAt: null,
          saturdayEndsAt: null,
          sundayStartsAt: null,
          sundayEndsAt: null,
        },
      });

      // Create schedule exclusions
      await prisma.scheduleExculsion.createMany({
        data: [
          {
            employeeId: alice.id,
            startDate: new Date(2026, 6, 1),
            endDate: new Date(2026, 6, 31),
          },
          {
            employeeId: bob.id,
            startDate: new Date(2026, 11, 15),
            endDate: new Date(2026, 11, 31),
          },
        ],
      });

      // Create some sample appointments
      const appointments = [
        createAppointment(
          alice.id,
          hairCut.id,
          new Date(2025, 11, 30, 10, 0),
          hairCut.duration,
          'John Smith',
          'john.smith@email.com'
        ),
        createAppointment(
          bob.id,
          beardTrim.id,
          new Date(2025, 11, 31, 14, 0),
          beardTrim.duration,
          'Mike Johnson',
          'mike.johnson@email.com'
        ),
        createAppointment(
          alice.id,
          hairColoring.id,
          new Date(2025, 11, 29, 11, 0),
          hairColoring.duration,
          'Emily Davis',
          'emily.davis@email.com'
        ),
        createAppointment(
          alice.id,
          hairStyling.id,
          new Date(2026, 0, 2, 9, 0),
          hairStyling.duration,
          'Lisa Wilson',
          'lisa.wilson@email.com'
        ),
        createAppointment(
          bob.id,
          hairCut.id,
          new Date(2026, 0, 2, 10, 0),
          hairCut.duration,
          'David Brown',
          'david.brown@email.com'
        ),
      ];

      await prisma.appointment.createMany({
        data: appointments,
      });
    }

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with 2026 data',
      employees: 2,
      services: 4,
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    await prisma.$disconnect();
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
