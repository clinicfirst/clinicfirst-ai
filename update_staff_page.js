const fs = require('fs');
const content = fs.readFileSync('src/pages/clinic/StaffPage.tsx', 'utf8');

let newContent = content.replace(
  "  const [resetLoading, setResetLoading] = useState(false);",
  `  const [resetLoading, setResetLoading] = useState(false);
  
  // Permissions Modal
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [editingPermissions, setEditingPermissions] = useState<any>(null);
  const [permStaff, setPermStaff] = useState<User | null>(null);
  const [permLoading, setPermLoading] = useState(false);`
);

newContent = newContent.replace(
  "                    {s.role !== 'CLINIC_ADMIN' && (",
  `                    {s.role !== 'CLINIC_ADMIN' && (
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
                    {s.role !== 'CLINIC_ADMIN' && (`
);

const permissionsModal = `
      {/* PERMISSIONS MODAL */}
      {permStaff && editingPermissions && (
        <Modal
          isOpen={permissionsModalOpen}
          onClose={() => setPermissionsModalOpen(false)}
          title={\`Access Rights: \${permStaff.name}\`}
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
                  await apiRequest(\`/api/clinic/staff/\${permStaff.id}\`, {
                    method: 'PUT',
                    body: JSON.stringify({ permissions: editingPermissions }),
                  });
                  setPermissionsModalOpen(false);
                  fetchStaff();
                } catch(err: any) {
                  alert(err.message || 'Failed to save permissions');
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
`;

newContent = newContent.replace(
  "    </div>\n  );\n};",
  permissionsModal + "\n    </div>\n  );\n};"
);

fs.writeFileSync('src/pages/clinic/StaffPage.tsx', newContent);
