import prisma from '@/lib/primsa';

export const getEmployeesWithMetadata = async () => {
  const employees = await prisma.employee.findMany({
    include: {
      schedule: true,
      scheduleExculsion: true,
      appointments: true,
    },
  });
  if (!employees) return [];
  return employees;
};
