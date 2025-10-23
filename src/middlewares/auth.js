import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header) return res.status(401).json({ error: 'Token ausente' });

  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Formato de token inválido' });

  const [, token] = parts;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, tipo }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
