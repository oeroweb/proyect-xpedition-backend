import { jest } from '@jest/globals';
import SubscriptionService from '../../src/service/SubscriptionService.js';
import { SUBSCRIPTION_STATUS } from '../../src/domain/subscription.constants.js';
import { BusinessRuleError } from '../../src/domain/errors/BusinessRuleError.js';

const mockPlanRepository = {
  findById: jest.fn(),
};

const mockUserRepository = {
  findById: jest.fn(),
};

const mockSubscriptionRepository = {
  findActiveByUserIdAndPlanId: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  updateStatus: jest.fn(),
  updateEndDate: jest.fn(),
  findExpiredActiveSubscriptions: jest.fn(),
};

const service = new SubscriptionService();
service.planRepository = mockPlanRepository;
service.userRepository = mockUserRepository;
service.subRepository = mockSubscriptionRepository;

describe('SubscriptionService Funcion - Reglas de Negocio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Crear una suscripción con estado "trial" y duración de 7 días', async () => {
    const TEST_USER_ID = 'user-test-id';
    const TEST_PLAN_ID = 'plan-test-id';

    mockUserRepository.findById.mockResolvedValue({
      id: TEST_USER_ID,
      name: 'Test User',
    });
    mockPlanRepository.findById.mockResolvedValue({
      id: TEST_PLAN_ID,
      name: 'Plan Test',
      durationDays: 30,
    });

    mockSubscriptionRepository.findActiveByUserIdAndPlanId.mockResolvedValue(null);

    mockSubscriptionRepository.create.mockImplementation((data) =>
      Promise.resolve({
        ...data,
        id: 'new-sub-id',
      }),
    );

    const result = await service.createSubscription(TEST_USER_ID, TEST_PLAN_ID);

    expect(result.status).toBe(SUBSCRIPTION_STATUS.TRIAL);

    const startDate = new Date(result.startDate);
    const endDate = new Date(result.endDate);

    const diffInTime = endDate.getTime() - startDate.getTime();
    const diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));

    expect(diffInDays).toBe(7);

    expect(mockSubscriptionRepository.create).toHaveBeenCalledTimes(1);
  });

  test('Lanzar 409 Conflict si la suscripción ya existe y está activa/trial', async () => {
    const TEST_USER_ID = 'user-test-id';
    const TEST_PLAN_ID = 'plan-test-id';

    mockUserRepository.findById.mockResolvedValue({ id: TEST_USER_ID });
    mockPlanRepository.findById.mockResolvedValue({ id: TEST_PLAN_ID });
    mockSubscriptionRepository.findActiveByUserIdAndPlanId.mockResolvedValue({
      id: 'existing-sub-id',
      status: SUBSCRIPTION_STATUS.ACTIVE,
    });

    await expect(service.createSubscription(TEST_USER_ID, TEST_PLAN_ID)).rejects.toThrow(
      BusinessRuleError,
    );

    await expect(service.createSubscription(TEST_USER_ID, TEST_PLAN_ID)).rejects.toHaveProperty(
      'statusCode',
      409,
    );

    expect(mockSubscriptionRepository.create).not.toHaveBeenCalled();
  });

  test('Cancelar la suscripción, cambiando el estado a "cancelled" sin modificar la fecha de fin', async () => {
    const TEST_SUB_ID = 'sub-to-cancel-id';
    const TEST_END_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    mockSubscriptionRepository.findById.mockResolvedValue({
      id: TEST_SUB_ID,
      status: SUBSCRIPTION_STATUS.ACTIVE,
      endDate: TEST_END_DATE,
    });

    await service.cancelSubscription(TEST_SUB_ID);

    expect(mockSubscriptionRepository.updateStatus).toHaveBeenCalledWith(
      TEST_SUB_ID,
      SUBSCRIPTION_STATUS.CANCELLED,
    );

    expect(mockSubscriptionRepository.updateEndDate).not.toHaveBeenCalled();
  });

  test('4. Debería lanzar 404 si el ID de Usuario no existe al crear suscripción', async () => {
    const TEST_USER_ID = 'non-existent-user';

    mockUserRepository.findById.mockResolvedValue(null);
    mockPlanRepository.findById.mockResolvedValue({ id: 'plan-id' });

    await expect(service.createSubscription(TEST_USER_ID, 'plan-id')).rejects.toHaveProperty(
      'statusCode',
      404,
    );

    expect(mockSubscriptionRepository.create).not.toHaveBeenCalled();
  });
});
