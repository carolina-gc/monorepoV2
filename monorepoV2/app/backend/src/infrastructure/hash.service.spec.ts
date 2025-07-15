import { hashPassword, comparePassword } from './hash.service';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('hash.service', () => {
  it('debe hashear la contraseña', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    const result = await hashPassword('123456');
    expect(result).toBe('hashed');
  });

  it('debe comparar contraseñas', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await comparePassword('123456', 'hashed');
    expect(result).toBe(true);
  });
}); 