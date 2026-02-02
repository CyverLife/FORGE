-- 1. SEGURIDAD: Configurar search_path para funciones críticas
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.handle_new_decision() SET search_path = public;
ALTER FUNCTION public.update_consciousness_rank() SET search_path = public;
ALTER FUNCTION public.handle_portal_decision() SET search_path = public;

-- 2. RENDIMIENTO: Optimizar políticas RLS (usar subconsultas para auth.uid)
-- Per Supabase linter: replace direct auth.uid() with (SELECT auth.uid()) to avoid re-evaluating for every row
ALTER POLICY "Users can view their own profile" ON public.profiles USING ( (SELECT auth.uid()) = id );
ALTER POLICY "Users can update their own profile" ON public.profiles USING ( (SELECT auth.uid()) = id );

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ( (SELECT auth.uid()) = id );

ALTER POLICY "Users can crud their own habits" ON public.habits USING ( (SELECT auth.uid()) = user_id );
ALTER POLICY "Users can crud their own logs" ON public.logs USING ( (SELECT auth.uid()) = user_id );
ALTER POLICY "Users can crud their own decisions" ON public.decisions USING ( (SELECT auth.uid()) = user_id );

-- 3. LIMPIEZA: Eliminar políticas duplicadas en portal_decisions
DROP POLICY IF EXISTS "Insert Own Decisions" ON public.portal_decisions;
DROP POLICY IF EXISTS "Select Own Decisions" ON public.portal_decisions;
DROP POLICY IF EXISTS "Users can view their own portal decisions" ON public.portal_decisions;
DROP POLICY IF EXISTS "Users can insert their own portal decisions" ON public.portal_decisions;

CREATE POLICY "Users can view their own portal decisions" 
ON public.portal_decisions FOR SELECT USING ( (SELECT auth.uid()) = user_id );

CREATE POLICY "Users can insert their own portal decisions" 
ON public.portal_decisions FOR INSERT WITH CHECK ( (SELECT auth.uid()) = user_id );

-- 4. LOGICA: Corregir trigger duplicado
DROP TRIGGER IF EXISTS on_portal_decision_created ON public.portal_decisions;
DROP FUNCTION IF EXISTS public.handle_new_portal_decision() CASCADE;

DROP TRIGGER IF EXISTS on_portal_decision_insert ON public.portal_decisions;
CREATE TRIGGER on_portal_decision_insert
  AFTER INSERT ON public.portal_decisions
  FOR EACH ROW EXECUTE FUNCTION public.handle_portal_decision();

-- 5. FIX CRÍTICO: Permitir borrar hábitos (Cascada para Logs y Decisions)
-- This ensures that deleting a habit doesn't fail due to existing logs or portal decisions
DO $$ 
BEGIN
    -- Borrado en cascada para logs
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'logs_habit_id_fkey') THEN
        ALTER TABLE public.logs DROP CONSTRAINT logs_habit_id_fkey;
    END IF;
    ALTER TABLE public.logs ADD CONSTRAINT logs_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE;

    -- Borrado en cascada para portal_decisions
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'portal_decisions_habit_id_fkey') THEN
        ALTER TABLE public.portal_decisions DROP CONSTRAINT portal_decisions_habit_id_fkey;
    END IF;
    ALTER TABLE public.portal_decisions ADD CONSTRAINT portal_decisions_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE;
END $$;
