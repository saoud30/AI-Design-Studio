'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import { StyleSelector, styles } from './svg-maker/style-selector';
import { SVGControls } from './svg-maker/svg-controls';
import { SVGPreview } from './svg-maker/svg-preview';

export function SVGMaker() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('minimal');
  const [svgCode, setSvgCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState('200');
  const [height, setHeight] = useState('200');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState('2');

  async function generateSVG() {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt required',
        description: 'Please enter a description of what you want to create.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const selectedStyle = styles.find(s => s.id === style);
      const fullPrompt = `Create a professional vector graphic: ${prompt}. Style: ${selectedStyle?.prompt}. Make it simple, clean, and optimized for SVG conversion. The design should be high-contrast and suitable for both digital and print media.`;
      
      const response = await fetch('/api/generate-svg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to generate image');
      }

      const data = await response.json();
      
      if (!data.imageUrl) {
        throw new Error('No image data received');
      }

      const svgResponse = await fetch('/api/convert-to-svg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imageUrl: data.imageUrl,
          options: {
            width: parseInt(width),
            height: parseInt(height),
            backgroundColor,
            strokeColor,
            strokeWidth: parseInt(strokeWidth)
          }
        }),
      });

      if (!svgResponse.ok) {
        const error = await svgResponse.json();
        throw new Error(error.details || 'Failed to convert to SVG');
      }

      const svgData = await svgResponse.json();
      
      if (!svgData.svg) {
        throw new Error('No SVG data received');
      }

      setSvgCode(svgData.svg);
      
      toast({
        title: 'SVG generated!',
        description: 'Your SVG has been created successfully.',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate SVG. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const downloadSVG = () => {
    if (!svgCode) {
      toast({
        title: 'No SVG to download',
        description: 'Please generate an SVG first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const blob = new Blob([svgCode], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'vector-graphic.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading SVG:', error);
      toast({
        title: 'Error',
        description: 'Failed to download SVG. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">SVG Maker</h1>
        <p className="text-muted-foreground text-lg">
          Create and customize vector graphics with AI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 shadow-lg">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe what you want to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] transition-all duration-200"
              />
            </div>

            <StyleSelector selectedStyle={style} onStyleChange={setStyle} />

            <SVGControls
              width={width}
              height={height}
              backgroundColor={backgroundColor}
              strokeColor={strokeColor}
              strokeWidth={strokeWidth}
              onWidthChange={setWidth}
              onHeightChange={setHeight}
              onBackgroundColorChange={setBackgroundColor}
              onStrokeColorChange={setStrokeColor}
              onStrokeWidthChange={setStrokeWidth}
            />

            <Button
              className="w-full h-12 text-lg font-medium transition-all duration-200"
              onClick={generateSVG}
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
                  Generate SVG
                </>
              )}
            </Button>
          </div>
        </Card>

        <div className="md:sticky md:top-8 space-y-6">
          <SVGPreview
            svgCode={svgCode}
            onSvgCodeChange={setSvgCode}
            onDownload={downloadSVG}
          />
        </div>
      </div>
    </div>
  );
}