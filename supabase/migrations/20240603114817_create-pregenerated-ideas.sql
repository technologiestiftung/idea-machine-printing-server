CREATE TABLE pregenerated_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea TEXT NOT NULL,
    focus_group TEXT NOT NULL,
    medium TEXT NOT NULL,
    topic TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL,
    illustration_url TEXT NOT NULL,
    postcard_url TEXT NOT NULL
);

ALTER TABLE pregenerated_ideas ENABLE ROW LEVEL SECURITY;

