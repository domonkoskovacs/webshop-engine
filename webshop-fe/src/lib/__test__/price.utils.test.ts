import { describe, expect, it } from 'vitest';
import { calculateCartTotals, calculateDiscountedPrice } from '../price.utils';
import type { CartItemResponse } from '@/shared/api';

describe('calculateCartTotals', () => {
    const mockCart: CartItemResponse[] = [
        {
            count: 2,
            product: { price: 100, discountPercentage: 10 },
        },
        {
            count: 1,
            product: { price: 200 },
        },
    ] as CartItemResponse[];

    it('should calculate full, discounted, and final prices correctly', () => {
        const result = calculateCartTotals(mockCart, 20);

        expect(result.fullPrice).toBe(400);
        expect(result.discountedPrice).toBeCloseTo(380);
        expect(result.discountAmount).toBeCloseTo(20);
        expect(result.finalPrice).toBeCloseTo(400);
    });
});

describe('calculateDiscountedPrice', () => {
    it('should apply discount correctly', () => {
        expect(calculateDiscountedPrice(100, 10)).toBe(90);
    });

    it('should return full price if discount is 0', () => {
        expect(calculateDiscountedPrice(100, 0)).toBe(100);
    });
});
