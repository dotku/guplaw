import { auth0 } from '@/lib/auth0';
import { practiceAreas } from '@/lib/practiceAreas';
import NavbarClient from './NavbarClient';

export default async function Navbar() {
  const session = await auth0.getSession();

  const user = session?.user
    ? {
        email: session.user.email ?? null,
        name: session.user.name ?? null,
      }
    : null;

  const areas = practiceAreas.map((a) => ({
    slug: a.slug,
    title: a.title,
    shortDescription: a.shortDescription,
  }));

  return <NavbarClient user={user} practiceAreas={areas} />;
}
