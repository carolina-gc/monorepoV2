const { ListUsersUseCase } = require('../use-cases/list-users.usecase');

describe('ListUsersUseCase', () => {
  const mockUserRepo = {
    findAllActive: jest.fn(),
  };
  const useCase = new ListUsersUseCase(mockUserRepo);

  it('debe retornar solo usuarios activos (sin eliminados)', async () => {
    const users = [
      { userID: 1, name: 'Activo', deletedAt: null },
      { userID: 2, name: 'Eliminado', deletedAt: new Date() }
    ];
    mockUserRepo.findAllActive.mockResolvedValue(users.filter(u => !u.deletedAt));
    const result = await useCase.execute();
    expect(result).toEqual([{ userID: 1, name: 'Activo', deletedAt: null }]);
    expect(result.find(u => u.deletedAt)).toBeUndefined();
    expect(result.length).toBe(1);
  });

  it('debe retornar un array vacío si no hay usuarios activos', async () => {
    mockUserRepo.findAllActive.mockResolvedValue([]);
    const result = await useCase.execute();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
}); 