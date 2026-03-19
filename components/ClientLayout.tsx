'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useBrowserExtensionProtection } from '@/hooks/useBrowserExtensionProtection';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useBrowserExtensionProtection();

  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}