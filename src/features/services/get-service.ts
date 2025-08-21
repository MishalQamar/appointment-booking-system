import prisma from '@/lib/primsa';

export const getService = async (serviceId: string) => {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });
  return service;
};

