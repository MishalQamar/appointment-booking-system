import prisma from '@/lib/primsa';

export const getServices = async () => {
  const services = await prisma.service.findMany({});
  return services;
};
