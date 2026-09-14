"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "../actions";
import { Shield, ShieldAlert, User as UserIcon } from "lucide-react";

type User = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: Date;
};

export default function UserTable({ users, isSuperAdmin }: { users: User[], isSuperAdmin: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (userId: string, newRole: "STUDENT" | "ADMIN" | "SUPER_ADMIN") => {
    startTransition(async () => {
      const res = await updateUserRole(userId, newRole);
      if (res.error) {
        alert(res.error);
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[var(--sv-border)] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-[var(--sv-border)] text-slate-600">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Joined At</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--sv-border)]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{user.fullName}</div>
                      <div className="text-slate-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {user.role === "SUPER_ADMIN" && <ShieldAlert className="w-4 h-4 text-purple-600" />}
                    {user.role === "ADMIN" && <Shield className="w-4 h-4 text-blue-600" />}
                    {user.role === "STUDENT" && <UserIcon className="w-4 h-4 text-slate-400" />}
                    
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-700" :
                      user.role === "ADMIN" ? "bg-blue-100 text-blue-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {isSuperAdmin ? (
                    <select
                      disabled={isPending}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                      className="bg-slate-50 border border-[var(--sv-border)] text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  ) : (
                    <span className="text-slate-400 text-xs">No permission</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
