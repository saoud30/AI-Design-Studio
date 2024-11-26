'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const models = [
  { 
    id: 'llama-11b', 
    name: 'Llama 3.2 11B',
    url: 'meta-llama/Llama-3.2-11B-Vision-Instruct'
  },
  { 
    id: 'llama-90b', 
    name: 'Llama 3.2 90B',
    url: 'meta-llama/Llama-3.2-90B-Vision-Instruct'
  }
];

const languages = [
  { id: 'english', name: 'English' },
  { id: 'spanish', name: 'Spanish' },
  { id: 'french', name: 'French' },
  { id: 'german', name: 'German' },
  { id: 'italian', name: 'Italian' },
  { id: 'japanese', name: 'Japanese' },
  { id: 'korean', name: 'Korean' },
  { id: 'chinese', name: 'Chinese' },
  { id: 'portuguese', name: 'Portuguese' }
];

const lengths = [
  { id: 'short', name: 'Short' },
  { id: 'medium', name: 'Medium' },
  { id: 'long', name: 'Long' }
];

export function ProductDescriptionGenerator() {
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState('llama-11b');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['english']);
  const [selectedLength, setSelectedLength] = useState('short');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLanguageToggle = (languageId: string) => {
    setSelectedLanguages(prev => {
      if (prev.includes(languageId)) {
        return prev.filter(id => id !== languageId);
      }
      if (prev.length < 3) {
        return [...prev, languageId];
      }
      return prev;
    });
  };

  const generateDescriptions = async () => {
    if (!imageUrl) {
      toast({
        title: 'Image required',
        description: 'Please upload a product image first.',
        variant: 'destructive',
      });
      return;
    }

    if (selectedLanguages.length === 0) {
      toast({
        title: 'Language required',
        description: 'Please select at least one language.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const model = models.find(m => m.id === selectedModel);
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          model: model?.url,
          languages: selectedLanguages,
          length: selectedLength,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate descriptions');
      }

      const data = await response.json();
      setDescriptions(data.descriptions);
      
      toast({
        title: 'Descriptions generated!',
        description: 'Your product descriptions have been created successfully.',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate descriptions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Product Description Generator</h1>
        <p className="text-muted-foreground text-lg">
          Upload an image of your product to generate descriptions in multiple languages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6 shadow-lg">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {imageUrl ? (
                      <div className="relative aspect-video w-full">
                        <Image
                          src={imageUrl}
                          alt="Product"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload product image
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Model</Label>
                <div className="grid grid-cols-2 gap-2">
                  {models.map((model) => (
                    <Button
                      key={model.id}
                      type="button"
                      variant={selectedModel === model.id ? 'default' : 'outline'}
                      className="h-10"
                      onClick={() => setSelectedModel(model.id)}
                    >
                      {model.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Languages (Choose up to 3)</Label>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((language) => (
                    <Button
                      key={language.id}
                      type="button"
                      variant={selectedLanguages.includes(language.id) ? 'default' : 'outline'}
                      className={cn(
                        'h-10',
                        selectedLanguages.length >= 3 && 
                        !selectedLanguages.includes(language.id) && 
                        'opacity-50 cursor-not-allowed'
                      )}
                      onClick={() => handleLanguageToggle(language.id)}
                      disabled={selectedLanguages.length >= 3 && !selectedLanguages.includes(language.id)}
                    >
                      {language.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description Length</Label>
                <div className="grid grid-cols-3 gap-2">
                  {lengths.map((length) => (
                    <Button
                      key={length.id}
                      type="button"
                      variant={selectedLength === length.id ? 'default' : 'outline'}
                      className="h-10"
                      onClick={() => setSelectedLength(length.id)}
                    >
                      {length.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full h-12 text-lg font-medium"
                onClick={generateDescriptions}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Descriptions'
                )}
              </Button>
            </div>
          </Card>
        </div>

        <div className="md:sticky md:top-8 h-fit">
          <Card className="p-6 shadow-lg">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Generated Descriptions</h2>
              {Object.entries(descriptions).length > 0 ? (
                Object.entries(descriptions).map(([language, description]) => (
                  <div key={language} className="space-y-2">
                    <h3 className="font-medium capitalize">{language}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Your generated descriptions will appear here
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}