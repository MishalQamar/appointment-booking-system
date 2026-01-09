import prisma from '@/lib/primsa';

export const getEmployee = async (employeeId: string) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });
    return employee;
  } catch (error) {
    console.error('Error fetching employee:', error);
    return null;
  }
};
