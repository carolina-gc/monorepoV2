const { UpdateUserUseCase } = require('../use-cases/update-user.usecase');
const { ETypeUser } = require('../../../domain/enums/typeuser.enum');

jest.mock('../../../infrastructure/hash.service', () => ({
  hashPassword: jest.fn(),
}));
const { hashPassword } = require('../../../infrastructure/hash.service');

describe('UpdateUserUseCase', () => {
  const mockUserRepo = {
    findById: jest.fn(),
    update: jest.fn(),
  };
  const mockTypeUserRepo = {
    findById: jest.fn(),
  };
  const useCase = new UpdateUserUseCase(mockUserRepo, mockTypeUserRepo);

  const user = { userID: 1, name: 'Test', email: 'test@demo.com', password: 'old', typeUser: { typeUserID: 1, type: ETypeUser.ADMIN } };

  beforeEach(() => jest.clearAllMocks());

  it('actualiza usuario si existe', async () => {
    mockUserRepo.findById.mockResolvedValue({ ...user });
    mockTypeUserRepo.findById.mockResolvedValue(user.typeUser);
    hashPassword.mockResolvedValue('hashed');
    mockUserRepo.update.mockResolvedValue({ ...user, password: 'hashed', name: 'Nuevo' });
    const result = await useCase.execute(1, { password: 'new', typeUserID: 1, name: 'Nuevo' });
    expect(result.password).toBe('hashed');
    expect(result.name).toBe('Nuevo');
    expect(result.typeUser).toBe(user.typeUser);
  });

  it('lanza error si usuario no existe', async () => {
    mockUserRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(1, {})).rejects.toThrow('Usuario no encontrado');
  });

  it('lanza error si typeUser no existe', async () => {
    mockUserRepo.findById.mockResolvedValue({ ...user });
    mockTypeUserRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(1, { typeUserID: 2 })).rejects.toThrow('Tipo de usuario no encontrado');
  });
}); 