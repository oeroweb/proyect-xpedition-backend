import { jest } from '@jest/globals';

import PaymentService from '../../src/service/PaymentService.js';
import { SUBSCRIPTION_STATUS } from '../../src/domain/subscription.constants.js';
import { BusinessRuleError } from '../../src/domain/errors/BusinessRuleError.js';

const mockPlanRepository = {
  findById: jest.fn(),
};

const mockSubscriptionRepository = {
  findById: jest.fn(),
  updateStatus: jest.fn(),
  updateEndDate: jest.fn(),
};

const mockPaymentRepository = {
  create: jest.fn(),
};

const service = new PaymentService();
service.planRepository = mockPlanRepository;
service.subRepository = mockSubscriptionRepository;
service.payRepository = mockPaymentRepository;

const mockAddDays = jest.fn((date, days) => {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
});

const PLAN_DURATION_DAYS = 30;
const TRIAL_END_DATE = new Date('2025-12-10T00:00:00.000Z');
const EXPECTED_NEW_END_DATE = new Date(
  TRIAL_END_DATE.getTime() + PLAN_DURATION_DAYS * 24 * 60 * 60 * 1000,
);

describe('PaymentService - Reglas de Activación y Extensión', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Debería cambiar el estado a "active" y extender la fecha de fin de la suscripción', async () => {
    const TEST_SUB_ID = 'sub-pay-id';
    const TEST_AMOUNT = 9.99;

    const TRIAL_END_DATE = new Date('2025-12-10T00:00:00.000Z');
    const PLAN_DURATION_DAYS = 30;

    mockSubscriptionRepository.findById.mockResolvedValue({
      id: TEST_SUB_ID,
      planId: 'plan-id',
      status: SUBSCRIPTION_STATUS.TRIAL,
      endDate: TRIAL_END_DATE,
    });

    mockPlanRepository.findById.mockResolvedValue({
      id: 'plan-id',
      durationDays: PLAN_DURATION_DAYS,
    });

    mockPaymentRepository.create.mockImplementation((data) =>
      Promise.resolve({
        ...data,
        id: 'new-pay-id',
      }),
    );

    await service.processPayment(TEST_SUB_ID, TEST_AMOUNT);

    expect(mockSubscriptionRepository.updateStatus).toHaveBeenCalledWith(
      TEST_SUB_ID,
      SUBSCRIPTION_STATUS.ACTIVE,
    );

    mockAddDays.mockReturnValueOnce(EXPECTED_NEW_END_DATE);

    expect(mockSubscriptionRepository.updateEndDate).toHaveBeenCalledWith(
      TEST_SUB_ID,
      EXPECTED_NEW_END_DATE,
    );

    expect(mockPaymentRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        subscriptionId: TEST_SUB_ID,
        amount: TEST_AMOUNT,
        status: 'completed',
      }),
    );
  });

  test('2. Debería lanzar 404 si la Suscripción no existe al procesar pago', async () => {
    mockSubscriptionRepository.findById.mockResolvedValue(null);

    const promise = service.processPayment('non-existent-sub', 10.0);

    await expect(promise).rejects.toThrow('Suscripción no encontrada.');

    await expect(promise).rejects.toMatchObject({
      message: 'Suscripción no encontrada.',
      statusCode: 404,
    });
    throw new BusinessRuleError('Suscripción no encontrada.', 404);
  });
});
