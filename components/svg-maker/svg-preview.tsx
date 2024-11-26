'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Wand2 } from 'lucide-react';

interface SVGPreviewProps {
  svgCode: string;
  onSvgCodeChange: (code: string) => void;
  onDownload: () => void;
}

export function SVGPreview({ svgCode, onSvgCodeChange, onDownload }: SVGPreviewProps) {
  return (
    <Card className="p-6 shadow-lg">
      <div className="space-y-6">
        <div className="aspect-square w-full bg-muted/10 rounded-lg flex items-center justify-center overflow-hidden">
          {svgCode ? (
            <div dangerouslySetInnerHTML={{ __html: svgCode }} />
          ) : (
            <div className="text-center text-muted-foreground">
              <Wand2 className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium">No SVG Generated Yet</p>
              <p className="text-sm">Enter a description and click generate</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Textarea
            value={svgCode}
            onChange={(e) => onSvgCodeChange(e.target.value)}
            placeholder="SVG code will appear here..."
            className="font-mono text-sm"
            rows={8}
          />

          {svgCode && (
            <Button
              onClick={onDownload}
              className="w-full h-12 text-lg font-medium"
              variant="outline"
            >
              Download SVG
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}