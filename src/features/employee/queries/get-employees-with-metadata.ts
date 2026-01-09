import prisma from '@/lib/primsa';

export const getEmployeesWithMetadata = async () => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        schedule: true,
        scheduleExculsion: true,
        appointments: true,
      },
    });
    if (!employees) return [];
    return employees;
  } catch (error) {
    console.error('Error fetching employees with metadata:', error);
    return [];
  }
};
