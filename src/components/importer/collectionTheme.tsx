import React from 'react';
import {
  Folder,
  Shapes,
  Layers,
  Type,
  Calculator,
  Flame,
  Award,
  Zap,
  BookOpen
} from 'lucide-react';

export interface CollectionColorStyles {
  border: string;
  bgLight: string;
  text: string;
  accentBg: string;
  badge: string;
  glow: string;
}

export function getColorStyles(color: string): CollectionColorStyles {
  switch (color) {
    case 'rose':
      return {
        border: 'border-rose-500/30 hover:border-rose-500/70',
        bgLight: 'bg-rose-500/10',
        text: 'text-rose-400',
        accentBg: 'bg-rose-600',
        badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        glow: 'from-rose-600/15'
      };
    case 'emerald':
      return {
        border: 'border-emerald-500/30 hover:border-emerald-500/70',
        bgLight: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        accentBg: 'bg-emerald-600',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        glow: 'from-emerald-600/15'
      };
    case 'amber':
      return {
        border: 'border-amber-500/30 hover:border-amber-500/70',
        bgLight: 'bg-amber-500/10',
        text: 'text-amber-400',
        accentBg: 'bg-amber-600',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        glow: 'from-amber-600/15'
      };
    case 'purple':
      return {
        border: 'border-purple-500/30 hover:border-purple-500/70',
        bgLight: 'bg-purple-500/10',
        text: 'text-purple-400',
        accentBg: 'bg-purple-600',
        badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        glow: 'from-purple-600/15'
      };
    case 'blue':
    default:
      return {
        border: 'border-blue-500/30 hover:border-blue-500/70',
        bgLight: 'bg-blue-500/10',
        text: 'text-blue-400',
        accentBg: 'bg-blue-600',
        badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        glow: 'from-blue-600/15'
      };
  }
}

export function renderCollectionIcon(iconName: string, className = 'w-5 h-5'): React.ReactNode {
  switch (iconName) {
    case 'shapes':
      return <Shapes className={className} />;
    case 'layers':
      return <Layers className={className} />;
    case 'type':
      return <Type className={className} />;
    case 'calculator':
      return <Calculator className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'zap':
      return <Zap className={className} />;
    case 'book':
      return <BookOpen className={className} />;
    case 'folder':
    default:
      return <Folder className={className} />;
  }
}
