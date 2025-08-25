import prisma from '@/lib/primsa';

export const getEmployees = async () => {
  const employees = await prisma.employee.findMany({
    omit: {
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!employees) return [];
  return employees;
};
