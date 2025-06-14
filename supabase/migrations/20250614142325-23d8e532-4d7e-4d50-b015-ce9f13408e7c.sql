
-- Create a table for public profiles
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  first_name text,
  last_name text,
  primary key (id)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security
alter table public.profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile for new users.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create orders table
create table public.orders (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references auth.users on delete cascade,
  program_id text not null,
  program_name text not null,
  program_price numeric not null,
  selected_addons jsonb,
  total_price numeric not null,
  created_at timestamp with time zone not null default now()
);

-- Add RLS to orders table
alter table public.orders
  enable row level security;

create policy "Users can view their own orders." on public.orders
  for select using (auth.uid() = user_id);

create policy "Users can create their own orders." on public.orders
  for insert with check (auth.uid() = user_id);

