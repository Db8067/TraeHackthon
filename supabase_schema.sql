-- Create contacts table
create table contacts (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  phone text,
  relation text,
  priority int, -- 0, 1, 2, 3 corresponding to M1, M2, M3, M4
  user_id uuid default auth.uid() -- Optional: if you add auth later
);

-- Enable RLS (Row Level Security) - Optional for now but good practice
alter table contacts enable row level security;

-- Policy: Allow anonymous access (since we are in dev/hackathon mode without auth)
-- WARNING: In production, you should restrict this!
create policy "Allow public access" on contacts for all using (true);

-- Insert dummy data (Optional)
insert into contacts (name, phone, relation, priority) values 
('Mom', '+1234567890', 'Mother', 0),
('Dad', '+1987654321', 'Father', 1);