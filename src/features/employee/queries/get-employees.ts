import prisma from '@/lib/primsa';

export const getEmployees = async () => {
  try {
    const employees = await prisma.employee.findMany({
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });
    console.log('📊 getEmployees result:', employees.length, 'employees');
    if (!employees) return [];
    return employees;
  } catch (error) {
    console.error('❌ Error fetching employees:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return [];
  }
};
