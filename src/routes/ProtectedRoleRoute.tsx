import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';

type InternalRole = 'customer' | 'store' | 'admin' | 'delivery';

type ProtectedRoleRouteProps = {
  allowedRoles: InternalRole[];
  children: ReactNode;
};

export default function ProtectedRoleRoute({ allowedRoles, children }: ProtectedRoleRouteProps) {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<InternalRole | null>(null);
  const [hasSession, setHasSession] = useState(false);

  const loadRole = async (userId: string): Promise<InternalRole | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    return error ? null : ((data?.role as InternalRole) || 'customer');
  };

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;

      const session = data.session;
      setHasSession(!!session);

      if (session) {
        const nextRole = await loadRole(session.user.id);
        if (!active) return;
        setRole(nextRole);
      }

      if (active) setLoading(false);
    }).catch(() => {
      if (active) setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!active) return;
      setLoading(true);
      setHasSession(!!nextSession);

      if (nextSession) {
        const nextRole = await loadRole(nextSession.user.id);
        if (!active) return;
        setRole(nextRole);
      } else {
        setRole(null);
      }

      if (active) setLoading(false);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f4f1] flex items-center justify-center text-[#5d3f3e]">
        Carregando acesso
      </div>
    );
  }

  if (hasSession && (!role || !allowedRoles.includes(role))) {
    return (
      <div className="min-h-screen bg-[#f7f4f1] flex items-center justify-center px-4 text-center">
        <div className="max-w-sm bg-white border border-[#e5e2e1] rounded-lg p-6">
          <h1 className="font-display font-extrabold text-xl mb-2">Acesso nao autorizado</h1>
          <p className="text-sm text-[#5d3f3e] mb-5">Seu usuario nao tem permissao para esta area.</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-full bg-[#1c1b1b] text-white font-bold px-5 py-3"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
