-- Create RPC function to get categories with post count
-- This fixes the N+1 query problem by doing the counting in the database

create or replace function get_categories_with_post_count()
returns table (
  id uuid,
  name text,
  slug text,
  description text,
  post_count bigint
)
language sql
stable
as $$
  select
    c.id,
    c.name,
    c.slug,
    c.description,
    count(p.id) filter (where p.status = 'PUBLISHED') as post_count
  from categories c
  left join post_categories pc on c.id = pc.category_id
  left join posts p on pc.post_id = p.id
  group by c.id, c.name, c.slug, c.description
  order by c.name;
$$;
