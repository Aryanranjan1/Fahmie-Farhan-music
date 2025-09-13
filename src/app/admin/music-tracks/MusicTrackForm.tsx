// src/app/admin/music-tracks/MusicTrackForm.tsx

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface MusicTrack {
  id?: string;
  title?: string;
    category?: string;
  description?: string;
  audioUrl?: string;
  coverImageUrl?: string;
  fileSize?: string;
  published?: boolean;
  featured?: boolean;
}

interface MusicTrackFormProps {
  initialData?: MusicTrack | null;
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
}

export default function MusicTrackForm({ initialData, onSubmit, isSubmitting }: MusicTrackFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [audioUrl, setAudioUrl] = useState(''); // Changed to handle URL
  const [coverImageUrl, setCoverImageUrl] = useState(''); // Changed to handle URL
  const [fileSize, setFileSize] = useState('');
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategory(initialData.category || '');
      setDescription(initialData.description || '');
      setAudioUrl(initialData.audioUrl || ''); // Initialize with audioUrl
      setCoverImageUrl(initialData.coverImageUrl || ''); // Initialize with coverImageUrl
      setFileSize(initialData.fileSize || '');
      setPublished(initialData.published || false);
      setFeatured(initialData.featured || false);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('audioUrl', audioUrl); // Append audioUrl
    // coverImageUrl will be fetched by backend if not provided, or can be manually set
    if (coverImageUrl) {
      formData.append('coverImageUrl', coverImageUrl);
    }
    formData.append('fileSize', fileSize);
    formData.append('published', String(published));
    formData.append('featured', String(featured));
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
       <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="audioUrl">SoundCloud URL</Label>
        <Input
          id="audioUrl"
          type="url"
          value={audioUrl}
          onChange={(e) => setAudioUrl(e.target.value)}
          placeholder="e.g., https://soundcloud.com/your-track"
          required
        />
      </div>
      <div>
        <Label htmlFor="coverImageUrl">Cover Image URL (Optional - will be fetched from SoundCloud if empty)</Label>
        {coverImageUrl && <img src={coverImageUrl} alt="Current cover" className="w-24 h-24 object-cover my-2" />}
        <Input
          id="coverImageUrl"
          type="url"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          placeholder="e.g., https://example.com/your-cover.jpg"
        />
      </div>
      <div>
        <Label htmlFor="fileSize">File Size (e.g., 4.2 MB)</Label>
        <Input id="fileSize" value={fileSize} onChange={(e) => setFileSize(e.target.value)} />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="published" checked={published} onCheckedChange={(checked) => setPublished(Boolean(checked))} />
        <Label htmlFor="published">Published</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="featured" checked={featured} onCheckedChange={(checked) => setFeatured(Boolean(checked))} />
        <Label htmlFor="featured">Featured</Label>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}