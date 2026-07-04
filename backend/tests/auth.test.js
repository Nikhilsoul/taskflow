import test from 'node:test';
import assert from 'node:assert';
import jwt from 'jsonwebtoken';

process.env.JWT_ACCESS_SECRET = 'test_secret';

test('access token contains the correct payload', () => {
  const token = jwt.sign(
    { sub: 1, role: 'user' },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

  assert.strictEqual(decoded.sub, 1);
  assert.strictEqual(decoded.role, 'user');
});

test('expired token fails verification', () => {
  const token = jwt.sign(
    { sub: 1, role: 'user' },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: -1 }
  );
  assert.throws(() => jwt.verify(token, process.env.JWT_ACCESS_SECRET));
});
