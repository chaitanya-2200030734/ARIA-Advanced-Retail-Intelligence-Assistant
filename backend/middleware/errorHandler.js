export default function errorHandler(err, req, res, next) {
  console.error('ARIA API Error:', err.message)
  res.status(500).json({
    error: 'Something went wrong',
    message: err.message,
    timestamp: new Date().toISOString()
  })
}
