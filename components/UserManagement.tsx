
import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';
import { User, UserRole, UserPermissions } from '../types';
import { store } from '../services/mockStore';

const UserStatCard = ({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between flex-1">
    <div className="space-y-1">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <h3 className="text-4xl font-black text-slate-800">{value}</h3>
    </div>
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white`}>
      {icon}
    </div>
  </div>
);

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(store.users);
  const [showModal, setShowModal] = useState<'add' | 'edit' | 'permissions' | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Omit<User, 'id' | 'permissions'>>({
    name: '',
    email: '',
    role: UserRole.AGENT,
    isActive: true
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const agentUsers = users.filter(u => u.role === UserRole.AGENT).length;

  const handleToggleStatus = (id: string, current: boolean) => {
    store.updateUser(id, { isActive: !current });
    setUsers([...store.users]);
  };

  const handleChangeRole = (id: string, role: UserRole) => {
    store.updateUser(id, { role });
    setUsers([...store.users]);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟ سيتم إزالة جميع بياناته من النظام.')) {
      store.deleteUser(id);
      setUsers([...store.users]);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    if (showModal === 'add') {
      store.addUser(formData);
    } else if (showModal === 'edit' && selectedUser) {
      store.updateUser(selectedUser.id, formData);
    }
    
    setUsers([...store.users]);
    setShowModal(null);
    setFormData({ name: '', email: '', role: UserRole.AGENT, isActive: true });
  };

  const handlePermissionToggle = (permission: keyof UserPermissions) => {
    if (!selectedUser) return;
    const newPermissions = { ...selectedUser.permissions, [permission]: !selectedUser.permissions[permission] };
    store.updateUser(selectedUser.id, { permissions: newPermissions });
    setUsers([...store.users]);
    setSelectedUser({ ...selectedUser, permissions: newPermissions });
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">إدارة المستخدمين</h2>
          <p className="text-slate-400 font-medium text-lg">تحكم في الموظفين، الأدوار، وصلاحيات الوصول للنظام</p>
        </div>
        <button 
          onClick={() => { setFormData({ name: '', email: '', role: UserRole.AGENT, isActive: true }); setShowModal('add'); }}
          className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          إضافة موظف
        </button>
      </div>

      {/* Stats Section */}
      <div className="flex gap-6">
        <UserStatCard 
          label="إجمالي المستخدمين" 
          value={totalUsers} 
          color="bg-slate-800" 
          icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} 
        />
        <UserStatCard 
          label="المستخدمين النشطين" 
          value={activeUsers} 
          color="bg-emerald-500" 
          icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A3.33 3.33 0 0014.158 11a6.003 6.003 0 00-4 5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>} 
        />
        <UserStatCard 
          label="الموظفين" 
          value={agentUsers} 
          color="bg-blue-500" 
          icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} 
        />
      </div>

      {/* Users List Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 bg-slate-50/20">
          <h3 className="text-2xl font-black text-slate-800">قائمة المستخدمين</h3>
          <p className="text-slate-400 font-medium mt-1">عرض وإدارة جميع مستخدمي النظام وصلاحياتهم الفردية</p>
        </div>

        <div className="divide-y divide-slate-50">
          {users.map(user => (
            <div key={user.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
              <div className="flex items-center gap-6 flex-1">
                <div className="relative">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=128`} 
                    className="w-16 h-16 rounded-[1.5rem] shadow-sm object-cover" 
                    alt={user.name} 
                  />
                  {user.isActive && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xl text-slate-800 group-hover:text-blue-600 transition-colors">{user.name}</h4>
                  <p className="text-sm text-slate-400 font-mono mt-1">@{user.email.split('@')[0]}</p>
                </div>
                <div className="mr-8">
                  {user.role === UserRole.ADMIN && <span className="px-4 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-black border border-rose-100 uppercase tracking-wider">مدير النظام</span>}
                  {user.role === UserRole.SUPERVISOR && <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-black border border-blue-100 uppercase tracking-wider">مشرف</span>}
                  {user.role === UserRole.AGENT && <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-black border border-slate-200 uppercase tracking-wider">موظف</span>}
                </div>
              </div>

              <div className="flex items-center gap-10">
                {/* Active Toggle */}
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-black ${user.isActive ? 'text-emerald-500' : 'text-slate-300'}`}>
                    {user.isActive ? 'نشط' : 'معطل'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={user.isActive} onChange={() => handleToggleStatus(user.id, user.isActive)} />
                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                  </label>
                </div>

                {/* Role Selector */}
                <div className="w-40">
                  <select 
                    value={user.role} 
                    onChange={(e) => handleChangeRole(user.id, e.target.value as UserRole)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none text-center cursor-pointer hover:border-blue-300"
                  >
                    <option value={UserRole.ADMIN}>مدير</option>
                    <option value={UserRole.SUPERVISOR}>مشرف</option>
                    <option value={UserRole.AGENT}>موظف</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => { setSelectedUser(user); setShowModal('permissions'); }}
                    title="تعديل الصلاحيات المتقدمة"
                    className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => { setSelectedUser(user); setFormData({ name: user.name, email: user.email, role: user.role, isActive: user.isActive }); setShowModal('edit'); }}
                    title="تعديل البيانات الأساسية"
                    className="p-3 text-blue-500 hover:bg-blue-50 rounded-2xl transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    title="حذف المستخدم"
                    className="p-3 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add/Edit User */}
      {(showModal === 'add' || showModal === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-3xl font-black text-slate-800">
                {showModal === 'add' ? 'إضافة موظف جديد' : 'تعديل بيانات الموظف'}
              </h3>
              <button onClick={() => setShowModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-600 px-1">الاسم بالكامل</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-6 py-4 text-lg font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" 
                  placeholder="مثال: أحمد عبد الله"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-600 px-1">البريد الإلكتروني / اسم المستخدم</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-6 py-4 text-lg font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-mono" 
                  placeholder="ahmed@company.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-600 px-1">الدور الوظيفي</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-6 py-4 text-lg font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                  >
                    <option value={UserRole.ADMIN}>مدير النظام</option>
                    <option value={UserRole.SUPERVISOR}>مشرف</option>
                    <option value={UserRole.AGENT}>موظف</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-600 px-1">حالة الحساب</label>
                  <div className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-[1.5rem] h-[60px]">
                     <label className="flex items-center gap-3 cursor-pointer">
                        <span className="font-bold text-slate-600">نشط الآن</span>
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 accent-blue-600"
                          checked={formData.isActive}
                          onChange={e => setFormData({...formData, isActive: e.target.checked})}
                        />
                     </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-50 flex gap-6">
              <button 
                onClick={handleSave} 
                className="flex-1 bg-blue-600 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1 transition-all"
              >
                {showModal === 'add' ? 'تأكيد الإضافة' : 'حفظ التغييرات'}
              </button>
              <button 
                onClick={() => setShowModal(null)} 
                className="flex-1 bg-white border border-slate-200 text-slate-500 py-5 rounded-[2rem] font-black text-xl hover:bg-slate-50 transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Permissions Management */}
      {showModal === 'permissions' && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-10 duration-300">
            <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-4 text-right">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                  {selectedUser.name[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">صلاحيات: {selectedUser.name}</h3>
                  <p className="text-sm text-slate-400 font-bold">{selectedUser.role === UserRole.ADMIN ? 'مدير كامل الصلاحيات' : 'تخصيص الصلاحيات المتقدمة'}</p>
                </div>
              </div>
              <button onClick={() => setShowModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-12 space-y-6 text-right">
              {[
                { id: 'canManageSettings', label: 'إدارة إعدادات النظام والربط التقني', desc: 'التحكم في مفاتيح API، إعدادات الواتساب، والويب هوك' },
                { id: 'canManageUsers', label: 'إدارة الموظفين والفرق والصلاحيات', desc: 'إضافة، تعديل وحذف حسابات الموظفين وتوزيع الأدوار' },
                { id: 'canViewReports', label: 'مشاهدة التقارير والإحصائيات التحليلية', desc: 'الوصول إلى لوحات القيادة، تقارير الأداء، وتحليلات الفريق' },
                { id: 'canReassignChats', label: 'إعادة تعيين وسحب المحادثات يدوياً', desc: 'إمكانية نقل محادثة من موظف لآخر أو سحبها للمدير' },
                { id: 'canExportData', label: 'تصدير بيانات العملاء والتقارير (Excel/CSV)', desc: 'تحميل البيانات الحساسة لجهات الاتصال والمحادثات خارج النظام' },
              ].map(perm => (
                <div key={perm.id} className="group relative flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
                  <div className="space-y-1">
                    <span className="font-black text-lg text-slate-700 group-hover:text-blue-600 transition-colors block">{perm.label}</span>
                    <p className="text-xs text-slate-400 font-medium">{perm.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={selectedUser.permissions[perm.id as keyof UserPermissions]} 
                      onChange={() => handlePermissionToggle(perm.id as keyof UserPermissions)} 
                    />
                    <div className="w-16 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="p-10 bg-slate-50 flex justify-center">
              <button 
                onClick={() => setShowModal(null)} 
                className="px-20 py-5 bg-slate-800 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-slate-900 hover:-translate-y-1 transition-all"
              >
                حفظ وإنهاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
