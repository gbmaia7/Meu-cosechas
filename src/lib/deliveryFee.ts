export const FREE_DELIVERY_MINIMUM = 20;
export const DELIVERY_FEE_BELOW_MINIMUM = 4;

type DeliveryFeeItem = {
  name?: string;
  price: number;
  quantity: number;
  pointsCost?: number;
  deliveryEligibilityPrice?: number;
};

export const calculateDeliverySubtotal = (items: DeliveryFeeItem[]) =>
  items.reduce((sum, item) => {
    const useEligibilityPrice =
      item.pointsCost && item.name?.startsWith('[CLUBE]') && item.deliveryEligibilityPrice !== undefined;
    return sum + (useEligibilityPrice ? item.deliveryEligibilityPrice! : item.price) * item.quantity;
  }, 0);

export const calculateDeliveryFee = (
  subtotal: number,
  modality: 'counter' | 'delivery',
) => {
  if (modality === 'counter') return 0;
  return subtotal >= FREE_DELIVERY_MINIMUM ? 0 : DELIVERY_FEE_BELOW_MINIMUM;
};
