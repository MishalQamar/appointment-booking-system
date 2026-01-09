import prisma from '@/lib/primsa';

export const getServices = async () => {
  try {
    const services = await prisma.service.findMany({});
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};
