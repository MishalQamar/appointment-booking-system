import prisma from '@/lib/primsa';

export const getEmployees = async () => {
  const employees = await prisma.employee.findMany({
    select: {
      id: true,
      name: true,
      profilePictureUrl: true,
    },
  });
  if (!employees) return [];
  return employees;
};
