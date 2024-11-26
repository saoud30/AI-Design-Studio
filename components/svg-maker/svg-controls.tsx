'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SVGControlsProps {
  width: string;
  height: string;
  backgroundColor: string;
  strokeColor: string;
  strokeWidth: string;
  onWidthChange: (width: string) => void;
  onHeightChange: (height: string) => void;
  onBackgroundColorChange: (color: string) => void;
  onStrokeColorChange: (color: string) => void;
  onStrokeWidthChange: (width: string) => void;
}

export function SVGControls({
  width,
  height,
  backgroundColor,
  strokeColor,
  strokeWidth,
  onWidthChange,
  onHeightChange,
  onBackgroundColorChange,
  onStrokeColorChange,
  onStrokeWidthChange,
}: SVGControlsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            type="number"
            value={width}
            onChange={(e) => onWidthChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            type="number"
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Fill Color</Label>
          <Input
            id="backgroundColor"
            type="color"
            value={backgroundColor}
            onChange={(e) => onBackgroundColorChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="strokeColor">Stroke Color</Label>
          <Input
            id="strokeColor"
            type="color"
            value={strokeColor}
            onChange={(e) => onStrokeColorChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="strokeWidth">Stroke Width</Label>
        <Input
          id="strokeWidth"
          type="number"
          value={strokeWidth}
          onChange={(e) => onStrokeWidthChange(e.target.value)}
        />
      </div>
    </>
  );
}