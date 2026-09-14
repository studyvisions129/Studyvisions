import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UserTable from "./_components/UserTable";

export default async function StudentsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Get current user to determine if they are SUPER_ADMIN
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  // Fetch all users
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      createdAt: true,
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all students and administrators.</p>
        </div>
      </div>

      <UserTable users={users} isSuperAdmin={isSuperAdmin} />
    </div>
  );
}
