const getUrl = (req) => {
  return `${req.protocol}://${req.get('host')}`;
};

export default getUrl;
