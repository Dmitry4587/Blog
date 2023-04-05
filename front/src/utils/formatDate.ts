import dayjs from 'dayjs';

export const formatDate = (date: Date) => dayjs(date).format('MMMM D, YYYY HH:mm');
