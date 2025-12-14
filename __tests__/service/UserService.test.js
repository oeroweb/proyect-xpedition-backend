import UserService from '../../src/service/UserService.js';
import { jest } from '@jest/globals';
import { BusinessRuleError } from '../../src/domain/errors/BusinessRuleError.js';

const mockUserRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const service = new UserService();
service.repository = mockUserRepository;

describe('UserService - CRUD y Manejo de Errores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const TEST_USER_ID = 'user-test-id';
  const TEST_USER_DATA = { name: 'Alice', email: 'alice@test.com' };

  test('Debería crear un nuevo usuario exitosamente', async () => {
    mockUserRepository.create.mockResolvedValue({ id: TEST_USER_ID, ...TEST_USER_DATA });

    const result = await service.createUser(TEST_USER_DATA);

    expect(mockUserRepository.create).toHaveBeenCalledWith(TEST_USER_DATA);
    expect(result.name).toBe('Alice');
  });

  test('Debería obtener una lista de todos los usuarios', async () => {
    const mockUsers = [{ id: 'id1' }, { id: 'id2' }];
    mockUserRepository.findAll.mockResolvedValue(mockUsers);

    const result = await service.getAllUsers();

    expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
  });

  test('Debería obtener un usuario por ID', async () => {
    mockUserRepository.findById.mockResolvedValue({ id: TEST_USER_ID, name: 'Alice' });

    const result = await service.getUserById(TEST_USER_ID);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(TEST_USER_ID);
    expect(result.name).toBe('Alice');
  });

  test('Debería lanzar 404 si el usuario no existe (getUserById)', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(service.getUserById('non-existent-id')).rejects.toHaveProperty('statusCode', 404);
  });

  test('Debería actualizar un usuario existente', async () => {
    const updateData = { name: 'Alicia' };

    mockUserRepository.findById.mockResolvedValue({ id: TEST_USER_ID, ...TEST_USER_DATA });
    mockUserRepository.update.mockResolvedValue({ id: TEST_USER_ID, name: 'Alicia' });

    const result = await service.updateUser(TEST_USER_ID, updateData);

    expect(mockUserRepository.update).toHaveBeenCalledWith(TEST_USER_ID, updateData);
    expect(result.name).toBe('Alicia');
  });

  test('Debería lanzar 404 si intenta actualizar un usuario que no existe', async () => {
    mockUserRepository.findById.mockResolvedValue(null); // La verificación de existencia falla

    await expect(service.updateUser('non-existent-id', { name: 'Test' })).rejects.toHaveProperty(
      'statusCode',
      404,
    );

    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  test('Debería eliminar un usuario existente', async () => {
    mockUserRepository.findById.mockResolvedValue({ id: TEST_USER_ID });
    mockUserRepository.delete.mockResolvedValue({});

    await service.deleteUser(TEST_USER_ID);

    expect(mockUserRepository.delete).toHaveBeenCalledWith(TEST_USER_ID);
  });

  test('Debería lanzar 404 si intenta eliminar un usuario que no existe', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(service.deleteUser('non-existent-id')).rejects.toHaveProperty('statusCode', 404);

    expect(mockUserRepository.delete).not.toHaveBeenCalled();
  });
});
