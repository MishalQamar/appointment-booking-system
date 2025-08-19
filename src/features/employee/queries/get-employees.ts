import prisma from '@/lib/primsa';

export const getEmployees = async () => {
  const employees = await prisma.employee.findMany({});
  return employees;
};
