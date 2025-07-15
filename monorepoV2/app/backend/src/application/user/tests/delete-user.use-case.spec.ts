const { DeleteUserUseCase } = require('../use-cases/delete-user.usecase');

describe('DeleteUserUseCase', () => {
  const mockUserRepo = {
    softDelete: jest.fn(),
  };
  const useCase = new DeleteUserUseCase(mockUserRepo);

  it('debe llamar softDelete con el id correcto', async () => {
    await useCase.execute(1);
    expect(mockUserRepo.softDelete).toHaveBeenCalledWith(1);
  });

  it('no debe lanzar error si softDelete se ejecuta correctamente', async () => {
    mockUserRepo.softDelete.mockResolvedValue(undefined);
    await expect(useCase.execute(2)).resolves.toBeUndefined();
  });
}); 