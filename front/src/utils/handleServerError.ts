import { isAxiosError } from 'axios';

const handleServerError = (e: unknown) => {
  if (isAxiosError(e)) {
    if (e?.response?.data) {
      if (Array.isArray(e.response.data)) {
        return e.response.data[0].msg;
      }
      if (typeof e.response.data === 'object' && 'm' in e.response.data) {
        return e.response.data.m;
      }
      return e.message;
    }
    return e.message;
  }
};

export default handleServerError;
