'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2 } from 'lucide-react';
import Image from 'next/image';

const styles = [
  { id: 'tech', name: 'Tech', icon: '🔷' },
  { id: 'flashy', name: 'Flashy', icon: '⚡' },
  { id: 'modern', name: 'Modern', icon: '🎯' },
  { id: 'playful', name: 'Playful', icon: '🎮' },
  { id: 'abstract', name: 'Abstract', icon: '🎨' },
  { id: 'minimal', name: 'Minimal', icon: '◯' },
];

const colors = [
  { id: 'blue', name: 'Blue', class: 'bg-blue-500' },
  { id: 'red', name: 'Red', class: 'bg-red-500' },
  { id: 'green', name: 'Green', class: 'bg-green-500' },
  { id: 'purple', name: 'Purple', class: 'bg-purple-500' },
  { id: 'orange', name: 'Orange', class: 'bg-orange-500' },
  { id: 'pink', name: 'Pink', class: 'bg-pink-500' },
  { id: 'black', name: 'Black', class: 'bg-black' },
  { id: 'gray', name: 'Gray', class: 'bg-gray-500' },
  { id: 'slate', name: 'Slate', class: 'bg-slate-500' },
  { id: 'zinc', name: 'Zinc', class: 'bg-zinc-500' },
  { id: 'neutral', name: 'Neutral', class: 'bg-neutral-500' },
  { id: 'stone', name: 'Stone', class: 'bg-stone-500' },
];

const models = [
  { 
    id: 'flux-1', 
    name: 'FLUX.1 Standard',
    url: 'Shakker-Labs/FLUX.1-dev-LoRA-Logo-Design',
    description: 'Balanced logo generation with good detail'
  },
  { 
    id: 'flux-logos', 
    name: 'FLUX Logos V1',
    url: 'AP123/flux-logos-v1',
    description: 'Specialized in vector-style logos'
  },
  { 
    id: 'flux-antiblur', 
    name: 'FLUX AntiBlur',
    url: 'Shakker-Labs/FLUX.1-dev-LoRA-AntiBlur',
    description: 'Enhanced clarity and sharpness'
  },
];

const styleLookup: Record<string, string> = {
  tech: "minimalist geometric shapes, clean lines, monochromatic palette, professional tech aesthetic, high resolution output, 8K quality, professional grade, vector-like quality, sharp edges, crisp details, suitable for both print and digital media",
  flashy: "dynamic gradients, metallic finish, glossy effect, bold typography, vibrant neon colors with metallic, shiny accents, high resolution output, 8K quality",
  modern: "balanced composition, refined typography, contemporary design principles, clean lines, natural colors with subtle accents, strategic negative space",
  playful: "organic shapes, friendly typography, vibrant color harmony, rounded shapes, lively design elements, perfect for brand identity",
  abstract: "sophisticated patterns, artistic elements, unique visual metaphors, creative shapes, textures, professional grade output",
  minimal: "essential elements only, perfect spacing, masterful simplicity, timeless design, versatile application, clean execution",
};

export function LogoMaker() {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('tech');
  const [primaryColor, setPrimaryColor] = useState('blue');
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [selectedModel, setSelectedModel] = useState('flux-1');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState<string | null>(null);

  async function generateLogo() {
    if (!companyName) {
      toast({
        title: 'Company name required',
        description: 'Please enter a company name to generate a logo.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const style = styleLookup[selectedStyle];
      const model = models.find(m => m.id === selectedModel);
      
      const prompt = `Create a professional logo for "${companyName}" company. Style: ${style}. Use ${primaryColor} as the primary color with ${backgroundColor} background. ${additionalInfo}`;

      const response = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          model: model?.url
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate logo');
      }

      const data = await response.json();
      setGeneratedLogo(data.imageUrl);
      
      toast({
        title: 'Logo generated!',
        description: 'Your logo has been created successfully.',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate logo. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (generatedLogo) {
      const link = document.createElement('a');
      link.href = generatedLogo;
      link.download = `${companyName.toLowerCase().replace(/\s+/g, '-')}-logo.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">AI Logo Maker</h1>
        <p className="text-muted-foreground text-lg">
          Generate professional logos in seconds using AI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 shadow-lg bg-card">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                placeholder="Enter your company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Logo Style</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {styles.map((style) => (
                  <Button
                    key={style.id}
                    variant={selectedStyle === style.id ? 'default' : 'outline'}
                    className="h-20 w-full"
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{style.icon}</div>
                      <div className="text-sm font-medium">{style.name}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <Select value={primaryColor} onValueChange={setPrimaryColor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color.id} value={color.id}>
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-2 ${color.class}`} />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Background</Label>
                <Select value={backgroundColor} onValueChange={setBackgroundColor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="transparent">Transparent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>AI Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="space-y-1">
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {model.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Additional Details (Optional)</Label>
              <Textarea
                placeholder="Add any specific requirements or details for your logo"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Button
              className="w-full h-12 text-lg font-medium"
              onClick={generateLogo}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Logo
                </>
              )}
            </Button>
          </div>
        </Card>

        <div className="md:sticky md:top-8 space-y-6">
          <Card className="p-6 shadow-lg bg-card">
            <div className="aspect-square w-full bg-muted/10 rounded-lg flex items-center justify-center overflow-hidden">
              {generatedLogo ? (
                <div className="relative w-full h-full">
                  <Image
                    src={generatedLogo}
                    alt="Generated Logo"
                    fill
                    className="object-contain p-4"
                    priority
                  />
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Wand2 className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg font-medium">No Logo Generated Yet</p>
                  <p className="text-sm">Fill in the details and click generate</p>
                </div>
              )}
            </div>

            {generatedLogo && (
              <Button
                className="w-full h-12 text-lg font-medium mt-6"
                variant="outline"
                onClick={handleDownload}
              >
                Download Logo
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}