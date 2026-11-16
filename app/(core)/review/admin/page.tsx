import { notFound } from 'next/navigation';
import { isAdminDesignReviewEnabled } from '@/core/lib/admin/review-policy';
import { AdminDesignReview } from '@/core/components/review/AdminDesignReview';

export const metadata = { title: 'Demonstração do novo admin', robots: { index: false, follow: false } };

export default function AdminReviewPage() {
  if (!isAdminDesignReviewEnabled(process.env)) notFound();
  return <AdminDesignReview />;
}
