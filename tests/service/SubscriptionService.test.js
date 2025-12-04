import SubscriptionService from '../../src/service/SubscriptionService.js';
import { SUBSCRIPTION_STATUS } from '../../src/domain/subscription.constants.js';

const mockPlanRepository = {
  findById: jest.fn(),
};

const mockUserRepository = {
  findById: jest.fn(),
};

const mockSubscriptionRepository = {
  findActiveByUserIdAndPlanId: jest.fn(),
  create: jest.fn(),
};

const service = new SubscriptionService();
service.planRepository = mockPlanRepository;
service.userRepository = mockUserRepository;
service.subRepository = mockSubscriptionRepository;

describe('SubscriptionService - Reglas de Negocio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. Debería crear una suscripción con estado "trial" y duración de 7 días', async () => {
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
    }); // Duración real del plan no importa para el trial

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

  // (Aquí iría el test para la regla de NO DUPLICIDAD: debería lanzar un error si ya existe una activa)
});
