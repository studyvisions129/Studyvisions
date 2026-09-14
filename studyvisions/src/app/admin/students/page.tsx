import { prisma } from "@/lib/prisma";
import { User, Eye } from "lucide-react";

export default async function StudentsPage() {
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: {
      profile: true,
      _count: {
        select: { orders: true, purchases: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Students</h1>
          <p className="text-slate-500 text-sm">Manage enrolled students and their profiles.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--sv-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[var(--sv-border)] text-sm font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Enrolled Courses</th>
                <th className="px-6 py-4">Total Orders</th>
                <th className="px-6 py-4">Joined On</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--sv-border)]">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                          {student.fullName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">{student.fullName}</div>
                          <div className="text-xs text-slate-500">{student.profile?.schoolName || 'No school provided'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div>{student.email}</div>
                      <div className="text-xs text-slate-400">{student.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {student._count.purchases} course(s)
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {student._count.orders} order(s)
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {student.isActive ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
