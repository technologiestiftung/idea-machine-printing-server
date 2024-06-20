CREATE TABLE printing_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL,
    postcard_url TEXT NOT NULL,
    printed BOOLEAN DEFAULT false
);

ALTER TABLE printing_jobs ENABLE ROW LEVEL SECURITY;

create policy "Enable write access for all users"
on "public"."printing_jobs"
as PERMISSIVE
for INSERT with check (auth.role() = 'anon');

alter publication supabase_realtime add table printing_jobs;
