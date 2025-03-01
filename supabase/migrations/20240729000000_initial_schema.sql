-- Create enums
CREATE TYPE document_type AS ENUM ('baptism', 'marriage', 'communion', 'confirmation');
CREATE TYPE document_status AS ENUM ('active', 'archived');
CREATE TYPE intention_status AS ENUM ('pending', 'completed', 'cancelled');
CREATE TYPE user_role AS ENUM ('admin', 'secretary', 'priest');

-- Create tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'secretary',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE priests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type document_type NOT NULL,
  number TEXT NOT NULL,
  book TEXT NOT NULL,
  page TEXT NOT NULL,
  date DATE NOT NULL,
  church TEXT NOT NULL,
  priest TEXT NOT NULL,
  notes TEXT,
  status document_status NOT NULL DEFAULT 'active'
);

CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_place TEXT NOT NULL,
  role TEXT
);

CREATE TABLE mass_intentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  intention TEXT NOT NULL,
  priest_id UUID NOT NULL REFERENCES priests(id),
  notes TEXT,
  status intention_status NOT NULL DEFAULT 'pending'
);

CREATE TABLE ai_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  default_model TEXT NOT NULL DEFAULT 'openai',
  openai_key TEXT,
  deepseek_key TEXT,
  auto_digitize BOOLEAN NOT NULL DEFAULT FALSE,
  prompt_templates JSONB NOT NULL DEFAULT '{
    "baptism": "Extrae la siguiente información del certificado de bautismo: nombre, apellidos, fecha de nacimiento, fecha de bautismo, lugar, padres, padrinos y ministro.",
    "marriage": "Extrae la siguiente información del certificado de matrimonio: nombres y apellidos de los contrayentes, fecha, lugar, testigos y ministro.",
    "communion": "Extrae la siguiente información del certificado de primera comunión: nombre, apellidos, fecha de nacimiento, fecha de comunión, lugar y ministro.",
    "confirmation": "Extrae la siguiente información del certificado de confirmación: nombre, apellidos, fecha de nacimiento, fecha de confirmación, lugar, padrino/madrina y ministro."
  }'::jsonb,
  api_endpoints JSONB NOT NULL DEFAULT '{
    "openai": "https://api.openai.com/v1",
    "deepseek": "https://api.deepseek.com/v1"
  }'::jsonb
);

-- Insert sample data
INSERT INTO users (email, name, role) VALUES 
('admin@example.com', 'Admin Usuario', 'admin'),
('secretario@example.com', 'Secretario Parroquial', 'secretary'),
('padre@example.com', 'Padre Francisco', 'priest');

INSERT INTO priests (name) VALUES 
('Padre Francisco'),
('Padre Antonio'),
('Padre Miguel');

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE priests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE mass_intentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (for development, allow all operations)
CREATE POLICY "Allow all operations for anon" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon" ON priests FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon" ON documents FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon" ON people FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon" ON mass_intentions FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon" ON ai_settings FOR ALL USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE documents;
ALTER PUBLICATION supabase_realtime ADD TABLE people;
ALTER PUBLICATION supabase_realtime ADD TABLE mass_intentions;
