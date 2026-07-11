import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { RoleName, FeatureCategory, PermissionLevel, TabId } from '../types';
import {
  hasPermission as engineHasPermission,
  isTabVisible as engineIsTabVisible,
  isActionEnabled as engineIsActionEnabled,
} from '../rbac/engine';
import { PERMISSION_MATRIX } from '../rbac/permissions';

const STORAGE_KEY = 'prizeflow_role';

const VALID_ROLES: RoleName[] = [
  'Super Administrator',
  'Event Administrator',
  'Finance Officer',
  'Distribution Officer',
  'Staff',
  'Auditor',
  'Viewer',
];

export interface RBACContextValue {
  currentRole: RoleName;
  setRole: (role: RoleName) => void;
  hasPermission: (category: FeatureCategory, level: PermissionLevel) => boolean;
  isTabVisible: (tabId: TabId) => boolean;
  isActionEnabled: (category: FeatureCategory, action: PermissionLevel) => boolean;
  isDegraded: boolean;
}

const RBACContext = createContext<RBACContextValue | null>(null);

function isValidRole(value: unknown): value is RoleName {
  return typeof value === 'string' && VALID_ROLES.includes(value as RoleName);
}

function readRoleFromStorage(): RoleName {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null && isValidRole(stored)) {
      return stored;
    }
  } catch {
    // localStorage may be unavailable
  }
  return 'Super Administrator';
}

function persistRole(role: RoleName): void {
  try {
    localStorage.setItem(STORAGE_KEY, role);
  } catch {
    // Silently fail — role stays in memory
  }
}

function checkPermissionMatrixAvailable(): boolean {
  try {
    return (
      PERMISSION_MATRIX != null &&
      typeof PERMISSION_MATRIX === 'object' &&
      'Super Administrator' in PERMISSION_MATRIX
    );
  } catch {
    return false;
  }
}

export interface RBACProviderProps {
  children: ReactNode;
}

export function RBACProvider({ children }: RBACProviderProps) {
  const [currentRole, setCurrentRole] = useState<RoleName>(readRoleFromStorage);
  const [isDegraded, setIsDegraded] = useState<boolean>(!checkPermissionMatrixAvailable());

  // Re-check degraded state on mount
  useEffect(() => {
    setIsDegraded(!checkPermissionMatrixAvailable());
  }, []);

  const setRole = useCallback((role: RoleName) => {
    if (!isValidRole(role)) {
      return;
    }
    setCurrentRole(role);
    persistRole(role);
  }, []);

  const hasPermission = useCallback(
    (category: FeatureCategory, level: PermissionLevel): boolean => {
      try {
        return engineHasPermission(currentRole, category, level);
      } catch {
        setIsDegraded(true);
        return true; // Fail open to Super Admin equivalent when degraded
      }
    },
    [currentRole]
  );

  const isTabVisible = useCallback(
    (tabId: TabId): boolean => {
      try {
        return engineIsTabVisible(currentRole, tabId);
      } catch {
        setIsDegraded(true);
        return true;
      }
    },
    [currentRole]
  );

  const isActionEnabled = useCallback(
    (category: FeatureCategory, action: PermissionLevel): boolean => {
      try {
        return engineIsActionEnabled(currentRole, category, action);
      } catch {
        setIsDegraded(true);
        return true;
      }
    },
    [currentRole]
  );

  const value: RBACContextValue = useMemo(
    () => ({
      currentRole,
      setRole,
      hasPermission,
      isTabVisible,
      isActionEnabled,
      isDegraded,
    }),
    [currentRole, setRole, hasPermission, isTabVisible, isActionEnabled, isDegraded]
  );

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
}

/**
 * Hook to access the RBAC context.
 * Must be called within an RBACProvider.
 */
export function useRBAC(): RBACContextValue {
  const context = useContext(RBACContext);
  if (context === null) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
}
