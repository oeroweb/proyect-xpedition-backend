// Función para sumar días a una fecha (necesario para el trial)
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
