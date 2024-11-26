'use client';

import { Button } from '../ui/button';
import { Label } from '../ui/label';

export const styles = [
  { 
    id: 'minimal', 
    name: 'Minimal', 
    /*description: 'Clean, simple shapes with clear lines',*/
    prompt: 'minimalist design, clean lines, simple shapes, high contrast, vector style'
  },
  { 
    id: 'geometric', 
    name: 'Geometric', 
    /*description: 'Based on geometric shapes and patterns',*/
    prompt: 'geometric shapes, mathematical patterns, precise lines, vector art style'
  },
  { 
    id: 'abstract', 
    name: 'Abstract', 
    /*description: 'Creative, artistic abstract designs',*/
    prompt: 'abstract design, artistic shapes, creative patterns, vector illustration'
  },
  { 
    id: 'technical', 
    name: 'Technical', 
    /* description: 'Technical, precise, engineering style',*/
    prompt: 'technical drawing style, engineering precision, blueprint aesthetic, vector format'
  }
];

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
}

export function StyleSelector({ selectedStyle, onStyleChange }: StyleSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Style</Label>
      <div className="grid grid-cols-2 gap-2">
        {styles.map((style) => (
          <Button
            key={style.id}
            variant={selectedStyle === style.id ? 'default' : 'outline'}
            className="h-auto py-4 flex flex-col gap-1 transition-all duration-200"
            onClick={() => onStyleChange(style.id)}
          >
            <span className="font-medium">{style.name}</span>
            {/*<span className="text-xs opacity-70">{style.description}</span>*/} 
          </Button>
        ))}
      </div>
    </div>
  );
}
