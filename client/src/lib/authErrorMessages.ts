export const getAuthErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  return 'Unable to authenticate. Please verify your society flat credentials.';
};
