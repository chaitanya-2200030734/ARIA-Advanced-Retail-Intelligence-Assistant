import jwt from 'jsonwebtoken'

export const generateToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  )
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' })
  }

  req.user = decoded
  next()
}

export default { generateToken, verifyToken, authenticateToken }
