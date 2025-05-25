import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';

export async function getSessionUser() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    return {
      userId: session.user.id,
      role: session.user.role,
      email: session.user.email
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}
