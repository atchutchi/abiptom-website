-- Additive change. Empty by default, so existing periods keep their assignments.
-- Exceptions must be explicitly authorised and scoped to one period/project.
BEGIN;
SET LOCAL lock_timeout = '5s';
ALTER TABLE public.salary_period_projects
  ADD COLUMN IF NOT EXISTS excluded_user_ids uuid[] NOT NULL DEFAULT '{}'::uuid[];
COMMIT;
