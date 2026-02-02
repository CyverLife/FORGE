-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text,
  avatar_url text,
  level integer default 1,
  xp integer default 0,
  anti_gravity_score integer default 50, -- Starting balance
  subscription_status text default 'free' check (subscription_status in ('free', 'premium')),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Profiles
alter table public.profiles enable row level security;
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username, anti_gravity_score)
  values (new.id, new.email, 50);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. HABITS
create table public.habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  attribute text check (attribute in ('IRON', 'FIRE', 'STEEL', 'FOCUS')),
  frequency text[] default '{}', -- Array of days e.g. ['Mon', 'Tue']
  difficulty integer check (difficulty >= 1 and difficulty <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Habits
alter table public.habits enable row level security;
create policy "Users can crud their own habits" on public.habits for all using (auth.uid() = user_id);

-- 3. LOGS
create table public.logs (
  id uuid default uuid_generate_v4() primary key,
  habit_id uuid references public.habits on delete cascade not null,
  user_id uuid references auth.users not null, -- Denormalized for easier RLS
  completed_at timestamp with time zone default timezone('utc'::text, now()),
  status text check (status in ('completed', 'failed', 'skipped')),
  note text
);

-- RLS for Logs
alter table public.logs enable row level security;
create policy "Users can crud their own logs" on public.logs for all using (auth.uid() = user_id);

-- 4. DECISIONS (The missing table causing errors)
create table public.decisions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  type text check (type in ('ANGEL', 'APE')),
  context text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Decisions
alter table public.decisions enable row level security;
create policy "Users can crud their own decisions" on public.decisions for all using (auth.uid() = user_id);

-- 5. GAMIFICATION TRIGGERS
create or replace function public.handle_new_decision() 
returns trigger as $$
begin
  update public.profiles
  set 
    anti_gravity_score = greatest(0, least(100, anti_gravity_score + (case when new.type = 'ANGEL' then 10 else -5 end))),
    xp = xp + 5,
    updated_at = now()
  where id = new.user_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_decision_created
  after insert on public.decisions
  for each row execute procedure public.handle_new_decision();
