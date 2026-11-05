import { PeopleForm } from "@/components/desk-forms";
import { requirePeopleAccess } from "@/lib/access";
import { roleLabel } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/site";

export default async function PeoplePage() {
  const session = await requirePeopleAccess();
  const people = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div>
        <h1 className="font-serif text-5xl">People</h1>
        <p className="mt-2 text-sm text-muted">Create a customer, a staff member, or an admin. New roles apply the next time that person signs in.</p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.id} className="border-t border-line">
                  <td className="py-3">{person.name}</td>
                  <td>{person.email}</td>
                  <td>{roleLabel(person.role)}</td>
                  <td>{formatDate(person.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <PeopleForm allowAdmin={session.role === "SUPER_ADMIN"} />
    </div>
  );
}
