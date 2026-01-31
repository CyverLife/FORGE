-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text,
  avatar_url text,
  level integer default 1,
  xp integer default 0,
  anti_gravity_score integer default 0,
  subscription_status text check (subscription_status in ('free', 'premium')) default 'free',
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(username) >= 3)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- HABITS
create table public.habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  attribute text check (attribute in ('IRON', 'FIRE', 'STEEL', 'FOCUS')),
  frequency text[], -- Array of days
  difficulty integer check (difficulty between 1 and 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.habits enable row level security;

create policy "Individuals can create habits." on public.habits
  for insert with check (auth.uid() = user_id);

create policy "Individuals can view their own habits. " on public.habits
  for select using (auth.uid() = user_id);

create policy "Individuals can update their own habits." on public.habits
  for update using (auth.uid() = user_id);

create policy "Individuals can delete their own habits." on public.habits
  for delete using (auth.uid() = user_id);

-- LOGS
create table public.logs (
  id uuid default uuid_generate_v4() primary key,
  habit_id uuid references public.habits(id) on delete cascade not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text check (status in ('completed', 'failed', 'skipped')),
  note text
);

alter table public.logs enable row level security;

create policy "Individuals can create logs." on public.logs
  for insert with check (auth.uid() = (select user_id from public.habits where id = habit_id));

create policy "Individuals can view their own logs." on public.logs
  for select using (auth.uid() = (select user_id from public.habits where id = habit_id));

-- DECISIONS
create table public.decisions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  type text check (type in ('ANGEL', 'APE')),
  context text,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.decisions enable row level security;

create policy "Individuals can create decisions." on public.decisions
  for insert with check (auth.uid() = user_id);

create policy "Individuals can view their own decisions." on public.decisions
  for select using (auth.uid() = user_id);

-- FUNCTION to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
