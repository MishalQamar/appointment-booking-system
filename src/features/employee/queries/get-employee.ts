import prisma from '@/lib/primsa';

export const getEmployee = async (id: string) => {
  const employee = await prisma.employee.findUnique({
    where: {
      id,
    },
    include: {
      EmployeeService: {
        where: {
          employeeId: id,
        },
        include: {
          service: true,
        },
      },
    },
  });

  return employee;
};
