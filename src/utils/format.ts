// src/utils/format.ts
// 日期格式化：YYYY-MM-DD HH:mm:ss
export const formatDate = (date: Date | string): string => {
  const target = typeof date === 'string' ? new Date(date) : date;
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const day = String(target.getDate()).padStart(2, '0');
  const hour = String(target.getHours()).padStart(2, '0');
  const minute = String(target.getMinutes()).padStart(2, '0');
  const second = String(target.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

// 手机号脱敏：138****1234
export const formatPhone = (phone: string): string => {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};