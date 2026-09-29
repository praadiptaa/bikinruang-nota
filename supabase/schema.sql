-- ==============================================================================
-- Event Expense Management System (Input Nota Event) Schema for Supabase PostgreSQL
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    budget BIGINT NOT NULL DEFAULT 0 CHECK (budget >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('planned', 'active', 'completed', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Expenses Table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    vendor VARCHAR(255),
    transaction_date DATE NOT NULL,
    description TEXT,
    amount BIGINT NOT NULL CHECK (amount >= 0),
    payment_method VARCHAR(50),
    receipt_path TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Indexes for fast query performance
CREATE INDEX IF NOT EXISTS idx_expenses_event_id ON public.expenses(event_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON public.expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_transaction_date ON public.expenses(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);

-- 6. Trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS tr_events_updated_at ON public.events;
CREATE TRIGGER tr_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_categories_updated_at ON public.categories;
CREATE TRIGGER tr_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_expenses_updated_at ON public.expenses;
CREATE TRIGGER tr_expenses_updated_at
    BEFORE UPDATE ON public.expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Row Level Security (RLS) for single-user internal operations
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on events" ON public.events;
CREATE POLICY "Allow all on events" ON public.events FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on categories" ON public.categories;
CREATE POLICY "Allow all on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on expenses" ON public.expenses;
CREATE POLICY "Allow all on expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);

-- 8. Seed Default Categories (CLAUDE.md requirements)
INSERT INTO public.categories (name, description, is_active)
VALUES 
    ('Konsumsi', 'Makanan, minuman, konsumsi crew & guest', true),
    ('Transportasi', 'Bensin, tol, tiket pesawat/kereta, sewa kendaraan, grab/ojol', true),
    ('Akomodasi', 'Hotel, penginapan, homestay panitia/pengisi acara', true),
    ('Equipment', 'Sewa sound system, lighting, panggung, genset, alat musik', true),
    ('Produksi', 'Material panggung, konstruksi, tenda, barikade, kelistrikan', true),
    ('Venue', 'Sewa gedung, lapangan, kebersihan, retribusi tempat', true),
    ('Talent', 'Fee artis, pembicara, MC, pengisi acara, rider', true),
    ('Dekorasi', 'Dekorasi panggung, photobooth, instalasi artistik, bunga', true),
    ('Printing', 'Banner, spanduk, ID card, tiket fisik, flyer, backdrop', true),
    ('Dokumentasi', 'Fotografer, videografer, aftermovie, memory card, sewa lensa', true),
    ('Perizinan', 'Izin keramaian polisi, satpol PP, pemda, asuransi', true),
    ('Operasional', 'Komunikasi, pulsa, ATK, medis/P3K, petty cash, kebutuhan dadakan', true),
    ('Entertainment', 'Game, doorprize, souvenir, gift merchandise', true),
    ('Lainnya', 'Biaya lain-lain yang tidak tergolong kategori di atas', true)
ON CONFLICT (name) DO NOTHING;

-- 9. Storage bucket setup for Receipts
INSERT INTO storage.buckets (id, name, public) 
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket access policies
DROP POLICY IF EXISTS "Public Receipt Access" ON storage.objects;
CREATE POLICY "Public Receipt Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'receipts');

DROP POLICY IF EXISTS "Allow All Uploads in receipts" ON storage.objects;
CREATE POLICY "Allow All Uploads in receipts" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'receipts');

DROP POLICY IF EXISTS "Allow All Updates in receipts" ON storage.objects;
CREATE POLICY "Allow All Updates in receipts" ON storage.objects 
FOR UPDATE USING (bucket_id = 'receipts');

DROP POLICY IF EXISTS "Allow All Deletes in receipts" ON storage.objects;
CREATE POLICY "Allow All Deletes in receipts" ON storage.objects 
FOR DELETE USING (bucket_id = 'receipts');
