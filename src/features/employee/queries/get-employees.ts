import prisma from '@/lib/primsa';

export const getEmployees = async () => {
  try {
    const employees = await prisma.employee.findMany({
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!employees) return [];
    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
};
