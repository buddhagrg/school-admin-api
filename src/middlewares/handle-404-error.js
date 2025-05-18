export const handle404Error = (req, res) => {
  res.status(404).json({
    error: 'Resource not found'
  });
};
