alter publication supabase_realtime add table ideas;

create policy "Enable read access for all users"
on "public"."ideas"
as PERMISSIVE
for SELECT
to anon
using (true);