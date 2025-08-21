import prisma from '@/lib/primsa';

export const getEmployee = async (employeeId: string) => {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });
  return employee;
};
