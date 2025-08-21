import prisma from '@/lib/primsa';

export const getEmployeeWithServices = async (employeeId: string) => {
  const employee = await prisma.employee.findUnique({
    where: {
      id: employeeId,
    },
    include: {
      employeeService: {
        include: {
          service: true,
        },
      },
    },
  });

  if (!employee) {
    return null;
  }
  const services = employee.employeeService.map((es) => ({
    ...es.service,
  }));

  return {
    ...employee,
    services, // Add a services array for easier access
  };
};
