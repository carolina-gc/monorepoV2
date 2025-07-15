const { LoginUseCase } = require('../use-cases/login.use-case');
import { ETypeUser } from '../../../domain/enums/typeuser.enum';

jest.mock('../../../infrastructure/hash.service', () => ({
  comparePassword: jest.fn(),
}));

const { comparePassword } = require('../../../infrastructure/hash.service');

describe('LoginUseCase', () => {
  const mockUserRepo = {
    findByEmail: jest.fn(),
  };

  const loginUseCase = new LoginUseCase(mockUserRepo);

  const userMock = {
    userID: 1,
    email: 'test@demo.com',
    password: 'hashedpass',
    typeUser: { type: ETypeUser.ADMIN, typeUserID: 1 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe retornar user y token si las credenciales son correctas', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(userMock);
    comparePassword.mockResolvedValue(true);

    const result = await loginUseCase.execute('test@demo.com', '123456');
    expect(result.user.email).toBe('test@demo.com');
    expect(result.token).toBeDefined();
  });

  it('debe lanzar error si el usuario no existe', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);

    await expect(loginUseCase.execute('no@demo.com', '123456'))
      .rejects
      .toThrow('Credenciales inválidas');
  });

  it('debe lanzar error si la contraseña es incorrecta', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(userMock);
    comparePassword.mockResolvedValue(false);

    await expect(loginUseCase.execute('test@demo.com', 'wrongpass'))
      .rejects
      .toThrow('Credenciales inválidas');
  });
}); 