const { CreateUserUseCase } = require('../use-cases/create-user.usecase');
import { ETypeUser } from '../../../domain/enums/typeuser.enum';

jest.mock('../../../infrastructure/hash.service', () => ({
  hashPassword: jest.fn(),
}));

const { hashPassword } = require('../../../infrastructure/hash.service');

describe('CreateUserUseCase', () => {
  const mockUserRepo = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
  const mockTypeUserRepo = {
    findById: jest.fn(),
  };
  const useCase = new CreateUserUseCase(mockUserRepo, mockTypeUserRepo);

  const typeUser = { typeUserID: 1, type: ETypeUser.ADMIN };
  const userData = {
    name: 'Test',
    email: 'test@demo.com',
    password: '123456',
    typeUserID: 1,
    numberPhone: '1234567890',
    countryCode: '+52',
  };

  beforeEach(() => jest.clearAllMocks());

  it('crea usuario si no existe email y typeUser existe', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockTypeUserRepo.findById.mockResolvedValue(typeUser);
    hashPassword.mockResolvedValue('hashed');
    mockUserRepo.create.mockResolvedValue({ ...userData, password: 'hashed', typeUser });

    const result = await useCase.execute(userData);
    expect(result.password).toBe('hashed');
    expect(result.typeUser).toBe(typeUser);
    expect(result.email).toBe(userData.email);
    expect(result.numberPhone).toBe(userData.numberPhone);
    expect(result.countryCode).toBe(userData.countryCode);
  });

  it('lanza error si el email ya existe', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({});
    await expect(useCase.execute(userData)).rejects.toThrow('Ya existe un usuario activo con ese correo');
  });

  it('lanza error si el typeUser no existe', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockTypeUserRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(userData)).rejects.toThrow('Tipo de usuario no encontrado');
  });
}); 