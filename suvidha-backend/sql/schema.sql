-- =========================
-- SUVIDHA DATABASE SCHEMA
-- =========================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------- Citizens ----------
CREATE TABLE IF NOT EXISTS citizens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(15) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ---------- Departments ----------
CREATE TABLE IF NOT EXISTS departments (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- ---------- Services ----------
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(80) PRIMARY KEY,
  department_id VARCHAR(50) REFERENCES departments(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  type VARCHAR(30) NOT NULL, -- "PAYMENT" | "REQUEST" | "COMPLAINT"
  requires_payment BOOLEAN DEFAULT FALSE,
  requires_documents BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ---------- Tickets ----------
CREATE TABLE IF NOT EXISTS tickets (
  id VARCHAR(30) PRIMARY KEY,
  citizen_id UUID REFERENCES citizens(id) ON DELETE SET NULL,
  department_id VARCHAR(50) REFERENCES departments(id),
  service_id VARCHAR(80) REFERENCES services(id),

  title VARCHAR(200),
  description TEXT,
  ward VARCHAR(50),
  address TEXT,

  status VARCHAR(30) DEFAULT 'Submitted', -- Submitted, In Review, Assigned, Resolved
  assigned_to VARCHAR(100),
  sla_hours INT DEFAULT 48,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ---------- Ticket Timeline ----------
CREATE TABLE IF NOT EXISTS ticket_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id VARCHAR(30) REFERENCES tickets(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL,
  remark TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ---------- Upload Sessions (QR upload) ----------
CREATE TABLE IF NOT EXISTS upload_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id VARCHAR(30),
  citizen_phone VARCHAR(15),
  service_id VARCHAR(80),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ---------- Documents ----------
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id VARCHAR(30) REFERENCES tickets(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100),
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- ---------- Admin Users ----------
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(30) DEFAULT 'ADMIN',
  created_at TIMESTAMP DEFAULT NOW()
);
