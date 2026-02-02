import { useState, useEffect } from 'react';
import { useAboutContent, useUpdateAboutContent, AboutContent } from '@/hooks/useAboutContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Save, FileText, Heart, Leaf, Users, Mountain, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const sectionConfig: Record<string, { label: string; description: string; icon: React.ElementType }> = {
  origin_story: { 
    label: 'Origin Story', 
    description: 'The "Where We Came From" section about humble beginnings',
    icon: FileText 
  },
  main_story: { 
    label: 'Main Story', 
    description: 'The "A Dream Born in the Highlands" main narrative',
    icon: FileText 
  },
  value_hospitality: { 
    label: 'Value: Hospitality', 
    description: 'Hospitality value card content',
    icon: Heart 
  },
  value_sustainability: { 
    label: 'Value: Sustainability', 
    description: 'Sustainability value card content',
    icon: Leaf 
  },
  value_community: { 
    label: 'Value: Community', 
    description: 'Community value card content',
    icon: Users 
  },
  value_adventure: { 
    label: 'Value: Adventure', 
    description: 'Adventure value card content',
    icon: Mountain 
  },
  location_info: { 
    label: 'Location Info', 
    description: 'The "Discover Nanyuki" section details',
    icon: MapPin 
  },
};

interface ContentEditorProps {
  content: AboutContent;
  onSave: (data: { id: string; title?: string; content: string }) => void;
  isSaving: boolean;
}

function ContentEditor({ content, onSave, isSaving }: ContentEditorProps) {
  const [title, setTitle] = useState(content.title || '');
  const [text, setText] = useState(content.content);
  const [hasChanges, setHasChanges] = useState(false);

  const config = sectionConfig[content.section_key] || { 
    label: content.section_key, 
    description: '',
    icon: FileText 
  };
  const Icon = config.icon;

  useEffect(() => {
    setTitle(content.title || '');
    setText(content.content);
    setHasChanges(false);
  }, [content]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setHasChanges(true);
  };

  const handleTextChange = (value: string) => {
    setText(value);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave({ id: content.id, title: title || undefined, content: text });
    setHasChanges(false);
  };

  const isValueSection = content.section_key.startsWith('value_');

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base font-semibold">{config.label}</CardTitle>
            <CardDescription className="text-xs">{config.description}</CardDescription>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || isSaving}
            size="sm"
            className="gap-2"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`title-${content.id}`} className="text-sm font-medium">
            Section Title
          </Label>
          <Input
            id={`title-${content.id}`}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Section title..."
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`content-${content.id}`} className="text-sm font-medium">
            {isValueSection ? 'Description' : 'Content'}
          </Label>
          <Textarea
            id={`content-${content.id}`}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter content..."
            className="min-h-[120px] bg-background resize-y"
            rows={isValueSection ? 3 : 8}
          />
          <p className="text-xs text-muted-foreground">
            {isValueSection 
              ? 'A brief description for this value card.'
              : 'Use paragraphs separated by blank lines. For location info, use • for bullet points.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function AboutContentEditor() {
  const { data: contents, isLoading, error } = useAboutContent();
  const updateMutation = useUpdateAboutContent();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border/50">
            <CardHeader className="pb-3">
              <Skeleton className="h-10 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="py-6">
          <p className="text-destructive text-center">Failed to load content: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!contents || contents.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-muted-foreground text-center">No content sections found.</p>
        </CardContent>
      </Card>
    );
  }

  // Order sections logically
  const orderedKeys = [
    'origin_story',
    'main_story',
    'value_hospitality',
    'value_sustainability',
    'value_community',
    'value_adventure',
    'location_info',
  ];

  const orderedContents = orderedKeys
    .map(key => contents.find(c => c.section_key === key))
    .filter((c): c is AboutContent => c !== undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">About Page Content</h2>
          <p className="text-sm text-muted-foreground">
            Edit the content displayed on the public About page
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {orderedContents.map((content) => (
          <ContentEditor
            key={content.id}
            content={content}
            onSave={(data) => updateMutation.mutate(data)}
            isSaving={updateMutation.isPending}
          />
        ))}
      </div>
    </div>
  );
}
