-- Create storage buckets for media files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('media-files', 'media-files', false, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mov', 'video/avi']),
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png']),
    ('charity-logos', 'charity-logos', true, 5242880, ARRAY['image/jpeg', 'image/png']);

-- Storage policies for media-files bucket
CREATE POLICY "Users can view media for their own orders" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'media-files' AND
        EXISTS (
            SELECT 1 FROM public.media_files 
            WHERE media_files.file_url LIKE '%' || storage.objects.name || '%'
            AND EXISTS (
                SELECT 1 FROM public.orders 
                WHERE orders.id = media_files.order_id 
                AND orders.user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Butchers can upload media files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'media-files' AND
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'butcher'
        )
    );

CREATE POLICY "Butchers can update media files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'media-files' AND
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'butcher'
        )
    );

CREATE POLICY "Butchers can delete media files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'media-files' AND
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'butcher'
        )
    );

-- Storage policies for avatars bucket
CREATE POLICY "Users can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for charity-logos bucket
CREATE POLICY "Anyone can view charity logos" ON storage.objects
    FOR SELECT USING (bucket_id = 'charity-logos');

CREATE POLICY "Admins can manage charity logos" ON storage.objects
    FOR ALL USING (
        bucket_id = 'charity-logos' AND
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    ); 