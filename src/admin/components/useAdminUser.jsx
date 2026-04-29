import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../services/supabase';

export const useAdminUser = () => {
  return useQuery({
    queryKey: ['adminUser'],
    queryFn: async () => {
      // 1. التحقق من جلسة المستخدم الحالي
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      // 2. جلب الصلاحية من جدول profiles
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error) throw new Error(error.message);

      return { ...session.user, role: profile?.role };
    },
  });
};