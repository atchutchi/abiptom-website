'use client';

import { createContext, useContext, useState, type HTMLAttributes } from 'react';
import { cn } from '@/core/lib/utils';

const AdminPortalContext = createContext<HTMLElement | null>(null);

export function useAdminPortalContainer() { return useContext(AdminPortalContext); }

export function AdminSurface({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);
  return (
    <AdminPortalContext.Provider value={portal}>
      <div data-admin-theme="frost" className={cn('admin-surface dark flex min-h-screen', className)} {...props}>
        {children}
        <div ref={setPortal} data-admin-portal="" />
      </div>
    </AdminPortalContext.Provider>
  );
}
