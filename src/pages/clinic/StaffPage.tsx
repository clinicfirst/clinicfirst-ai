import { showToast } from '../../components/common/Toast';
import React, { useState, useEffect } from 'react';
import { Users, Plus, Key, Check, ShieldAlert, Mail, Phone, Lock } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { apiRequest } from '../../api';
import { User } from '../../types';

export const StaffPage: React.FC = () => {
  const [staffList, setStaffList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Staff Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    tempPassword: 'StaffPassword2026!',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset Password Modal
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
  const [newTempPassword, setNewTempPassword] = useState('StaffPassword2026!');
  const [resetLoading, setResetLoading] = useState(false);

  // Permissions Modal
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [editingPermissions, setEditingPermissions] = useState<any>(null);
  const [permStaff, setPermStaff] = useState<User | null>(null);
  const [permLoading, setPermLoading] = useState(false);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await apiRequest<{ staff: User[] }>('/api/clinic/staff');
      setStaffList(res.staff);
    } catch (err) {
      console.error('Failed to load staff list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await apiRequest('/api/clinic/staff', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      setForm({
        name: '',
        email: '',
        phone: '',
        tempPassword: 'StaffPassword2026!',
      });
      setAddModalOpen(false);
      fetchStaff();
    } catch (err: any) {
      setError(err.message || 'Failed to add staff member');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;
    setResetLoading(true);

    try {
      await apiRequest(`/api/clinic/staff/${selectedStaff.id}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ newTempPassword }),
      });

      setResetModalOpen(false);
      setSelectedStaff(null);
      showToast(`Temporary password for ${selectedStaff.name} has been reset. They will be required to change it upon next login.`, 'success');
      fetchStaff();
    } catch (err: any) {
      showToast(err.message || 'Failed to reset password', 'error');
    } finally {
      setResetLoading(false);
    }
  };

  const toggleStatus = async (staffMember: User) => {
    const nextStatus = staffMember.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await apiRequest(`/api/clinic/staff/${staffMember.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchStaff();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0A0A0A] tracking-tight">Clinic Staff & Access</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage operational receptionists, staff permissions, and temporary login credentials.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setAddModalOpen(true)}
        >
          Add Staff Member
        </Button>
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Staff Name & Contact</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Password State</th>
                <th className="px-6 py-3.5">Account Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-normal">
              {staffList.map((s) => (
                <tr key={s.id} className="group hover:bg-[#F8FAFC] transition-colors duration-200 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#0A0A0A] text-sm">{s.name}</div>
                    <div className="text-gray-500 font-mono text-[11px] mt-0.5">{s.email}</div>
                  </td>

                  <td className="px-6 py-4">
                    <Badge status={s.role} />
                  </td>

                  <td className="px-6 py-4 text-xs font-mono">
                    {s.must_change_password ? (
                      <span className="text-black font-semibold">Must Reset on Login</span>
                    ) : (
                      <span className="text-gray-500">Active / Verified</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <Badge status={s.status} />
                  </td>

                  <td className="px-6 py-4 text-right space-x-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                    {s.role !== 'CLINIC_ADMIN' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPermStaff(s);
                          setEditingPermissions(s.permissions || {
                            appointments: 'EDIT',
                            patients: 'EDIT',
                            doctors: 'READ',
                            services: 'READ',
                            schedules: 'READ',
                            calls: 'READ',
                            ai_receptionist: 'READ',
                            staff: 'READ',
                          });
                          setPermissionsModalOpen(true);
                        }}
                      >
                        Permissions
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Key className="w-3 h-3" />}
                      onClick={() => {
                        setSelectedStaff(s);
                        setResetModalOpen(true);
                      }}
                    >
                      Reset Password
                    </Button>

                    {s.role !== 'CLINIC_ADMIN' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(s)}
                        className={s.status === 'ACTIVE' ? 'text-gray-600' : 'text-[#0A2540] font-semibold'}
                      >
                        {s.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD STAFF MODAL */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Clinic Staff Member"
        subtitle="Creates a receptionist/staff account with temporary credentials and forced first-time password change."
        maxWidth="md"
      >
        <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-gray-50 border border-black rounded font-semibold text-black">
              {error}
            </div>
          )}

          <Input
            label="Staff Full Name *"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Jessica Adams"
          />

          <Input
            label="Staff Work Email *"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="jessica@clinic.com"
          />

          <Input
            label="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+1-555-019-3322"
          />

          <Input
            label="Temporary Initial Password *"
            type="password"
            required
            value={form.tempPassword}
            onChange={(e) => setForm({ ...form, tempPassword: e.target.value })}
            helperText="User will be forced to choose a new password when they log in"
          />

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <Button variant="secondary" size="md" onClick={() => setAddModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" loading={saving}>
              Create Staff Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* RESET PASSWORD MODAL */}
      {selectedStaff && (
        <Modal
          isOpen={resetModalOpen}
          onClose={() => setResetModalOpen(false)}
          title={`Reset Temporary Password for ${selectedStaff.name}`}
          subtitle="Staff member will be prompted to set a permanent password upon next login."
          maxWidth="md"
        >
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            <Input
              label="New Temporary Password *"
              type="password"
              required
              value={newTempPassword}
              onChange={(e) => setNewTempPassword(e.target.value)}
              placeholder="At least 8 chars"
            />

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <Button variant="secondary" size="md" onClick={() => setResetModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" loading={resetLoading}>
                Confirm Password Reset
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* PERMISSIONS MODAL */}
      {permStaff && editingPermissions && (
        <Modal
          isOpen={permissionsModalOpen}
          onClose={() => setPermissionsModalOpen(false)}
          title={`Access Rights: ${permStaff.name}`}
          subtitle="Configure granular module access for this staff member."
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            {Object.entries(editingPermissions).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="capitalize font-semibold text-gray-700">{key.replace('_', ' ')}</span>
                <select
                  className="px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#0A2540] bg-white w-32"
                  value={val as string}
                  onChange={(e) => setEditingPermissions({ ...editingPermissions, [key]: e.target.value })}
                >
                  <option value="NONE">No Access</option>
                  <option value="READ">Read Only</option>
                  <option value="EDIT">Read & Edit</option>
                </select>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3 mt-4">
              <Button variant="secondary" size="md" onClick={() => setPermissionsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" loading={permLoading} onClick={async () => {
                setPermLoading(true);
                try {
                  await apiRequest(`/api/clinic/staff/${permStaff.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ permissions: editingPermissions }),
                  });
                  setPermissionsModalOpen(false);
                  fetchStaff();
                } catch(err: any) {
                  showToast(err.message || 'Failed to save permissions', 'error');
                } finally {
                  setPermLoading(false);
                }
              }}>
                Save Rights
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
