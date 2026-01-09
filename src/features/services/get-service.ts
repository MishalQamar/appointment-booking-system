import prisma from '@/lib/primsa';

export const getService = async (serviceId: string) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    return service;
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
};

