-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Brands table
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  logo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.brands enable row level security;
create policy "brands_select_own" on public.brands for select using (auth.uid() = user_id);
create policy "brands_insert_own" on public.brands for insert with check (auth.uid() = user_id);
create policy "brands_update_own" on public.brands for update using (auth.uid() = user_id);
create policy "brands_delete_own" on public.brands for delete using (auth.uid() = user_id);

-- Color palettes table
create table if not exists public.color_palettes (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  name text not null,
  colors jsonb not null default '[]',
  is_primary boolean default false,
  created_at timestamptz default now()
);

alter table public.color_palettes enable row level security;
create policy "color_palettes_all" on public.color_palettes for all using (
  exists (select 1 from public.brands where brands.id = color_palettes.brand_id and brands.user_id = auth.uid())
);

-- Brand fonts table
create table if not exists public.brand_fonts (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  name text not null,
  font_family text not null,
  font_type text,
  created_at timestamptz default now()
);

alter table public.brand_fonts enable row level security;
create policy "brand_fonts_all" on public.brand_fonts for all using (
  exists (select 1 from public.brands where brands.id = brand_fonts.brand_id and brands.user_id = auth.uid())
);

-- Profile trigger
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data ->> 'full_name') on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
