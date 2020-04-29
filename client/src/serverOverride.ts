const getServerURL = () : string => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://keepid-server-staging.herokuapp.com';
  }
  return 'http://localhost:3001';
};

export default getServerURL;
