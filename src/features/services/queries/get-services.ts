import prisma from '@/lib/primsa';

export const getServices = async () => {
  try {
    const services = await prisma.service.findMany({});
    console.log('📊 getServices result:', services.length, 'services');
    return services;
  } catch (error) {
    console.error('❌ Error fetching services:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return [];
  }
};
