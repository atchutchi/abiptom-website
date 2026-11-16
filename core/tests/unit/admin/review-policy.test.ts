import { describe, expect, it } from 'vitest';
import { isAdminDesignReviewEnabled } from '@/core/lib/admin/review-policy';

describe('isolamento da demonstração administrativa', () => {
  it('não existe na execução normal', () => {
    expect(isAdminDesignReviewEnabled({})).toBe(false);
  });
  it('exige revisão local explícita ou ambiente preview', () => {
    expect(isAdminDesignReviewEnabled({ ABIPTOM_REVIEW_ONLY: '1' })).toBe(true);
    expect(isAdminDesignReviewEnabled({ VERCEL_ENV: 'preview' })).toBe(true);
    expect(isAdminDesignReviewEnabled({ ABIPTOM_REVIEW_ONLY: '0' })).toBe(false);
  });
  it('recusa produção mesmo quando o sinalizador de revisão está activo', () => {
    expect(isAdminDesignReviewEnabled({ VERCEL_ENV: 'production', ABIPTOM_REVIEW_ONLY: '1' })).toBe(false);
    expect(isAdminDesignReviewEnabled({ VERCEL_ENV: 'production' })).toBe(false);
  });
});
