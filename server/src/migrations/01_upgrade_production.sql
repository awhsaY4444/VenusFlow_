-- Migration: Upgrade Production Features
-- Date: 2026-04-22

-- 1. Add Permissions to Users
ALTER TABLE users ADD COLUMN IF NOT EXISTS permissions TEXT[] DEFAULT '{}';

-- Initialize default permissions based on current roles
UPDATE users SET permissions = '{CREATE_TASK, UPDATE_OWN_TASK, UPDATE_ANY_TASK, DELETE_TASK, INVITE_USERS, VIEW_ANALYTICS}' WHERE role = 'admin';
UPDATE users SET permissions = '{CREATE_TASK, UPDATE_OWN_TASK}' WHERE role = 'member';

-- 2. Enhance Audit Logs
-- We keep 'changes' for flexibility but add explicit before/after tracking logic in code.
-- No schema change needed for task_audit_logs if we use 'changes' JSONB, 
-- but let's add a performance index for the action type.
CREATE INDEX IF NOT EXISTS idx_task_audit_action ON task_audit_logs(action);

-- 3. Create Invites Table
CREATE TABLE IF NOT EXISTS organization_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(160) NOT NULL,
  token VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'member',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invites_token ON organization_invites(token);
CREATE INDEX IF NOT EXISTS idx_invites_org_email ON organization_invites(organization_id, email);

-- 4. Create Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_org ON notifications(organization_id);
