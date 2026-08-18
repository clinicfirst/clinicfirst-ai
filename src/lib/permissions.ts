import { User, PermissionAction, StaffPermissions } from '../types';

export const DEFAULT_STAFF_PERMISSIONS: StaffPermissions = {
  appointments: 'EDIT',
  patients: 'EDIT',
  doctors: 'READ',
  services: 'READ',
  schedules: 'READ',
  calls: 'READ',
  ai_receptionist: 'READ',
  staff: 'READ',
};

function hasAccess(user: User, resource: keyof StaffPermissions, requiredLevel: 'READ' | 'EDIT'): boolean {
  if (user.role === 'CLINIC_ADMIN') return true;
  if (user.role === 'CLINIC_STAFF') {
    const perms = user.permissions || DEFAULT_STAFF_PERMISSIONS;
    const level = perms[resource] || 'NONE';
    if (requiredLevel === 'EDIT') {
      return level === 'EDIT';
    } else {
      return level === 'READ' || level === 'EDIT';
    }
  }
  return false;
}

/**
 * Single central authorization check for CLINICFIRST.
 * All frontend components and backend middleware rely on this definition.
 */
export function can(user: User | null | undefined, action: PermissionAction): boolean {
  if (!user || user.status !== 'ACTIVE') {
    return false;
  }

  const { role } = user;

  switch (action) {
    // Platform Admin permissions
    case 'create_clinic':
    case 'view_all_clinics':
    case 'update_clinic':
    case 'manage_platform_users':
    case 'view_platform_dashboard':
      return role === 'PLATFORM_ADMIN';

    // Clinic View Dashboard
    case 'view_own_clinic_dashboard':
      return role === 'CLINIC_ADMIN' || role === 'CLINIC_STAFF';

    // Doctors
    case 'manage_doctors':
      return hasAccess(user, 'doctors', 'EDIT');
    case 'view_doctors':
      return hasAccess(user, 'doctors', 'READ');

    // Staff
    case 'manage_staff':
      return hasAccess(user, 'staff', 'EDIT');
    case 'view_staff':
      return hasAccess(user, 'staff', 'READ');

    // Services
    case 'manage_services':
      return hasAccess(user, 'services', 'EDIT');
    case 'view_services':
      return hasAccess(user, 'services', 'READ');

    // Schedules
    case 'manage_schedules':
      return hasAccess(user, 'schedules', 'EDIT');
    case 'view_schedules':
      return hasAccess(user, 'schedules', 'READ');

    // Patients
    case 'manage_patients':
      return hasAccess(user, 'patients', 'EDIT');
    case 'view_patients':
      return hasAccess(user, 'patients', 'READ');

    // Appointments
    case 'manage_appointments':
      return hasAccess(user, 'appointments', 'EDIT');
    case 'view_appointments':
      return hasAccess(user, 'appointments', 'READ');

    // AI Receptionist
    case 'configure_ai_receptionist':
      return hasAccess(user, 'ai_receptionist', 'EDIT');
    case 'view_ai_receptionist':
      return hasAccess(user, 'ai_receptionist', 'READ');

    // Calls
    case 'view_calls':
      return hasAccess(user, 'calls', 'READ');

    // View Audit Logs
    case 'view_audit_logs':
      return role === 'PLATFORM_ADMIN' || role === 'CLINIC_ADMIN';

    default:
      return false;
  }
}
