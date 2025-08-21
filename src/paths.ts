export const homePath = () => '/';

export const employeePath = (employeeId: string) =>
  `/employee/${employeeId}`;

export const checkoutPath = (
  serviceId: string,
  employeeId?: string
) => {
  if (employeeId) {
    return `/checkout/${employeeId}/${serviceId}`;
  }
  return `/checkout/${serviceId}`;
};
