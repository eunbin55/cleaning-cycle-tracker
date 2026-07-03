import React from 'react';
import {
  Droplet,
  Sparkles,
  Flame,
  Bed,
  WashingMachine,
  Wind,
  Fan,
  Refrigerator,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Filter,
  ChevronRight,
  Info,
  Settings,
  PlusCircle,
  BarChart3,
  Award,
  RotateCcw,
  Home,
  Tv,
  Check,
  ListTodo,
  Activity,
  BookOpen,
  Coffee,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

interface CleanIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const CleanIcon: React.FC<CleanIconProps> = ({ name, className = '', size = 20 }) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    Droplet,
    Sparkles,
    Flame,
    Bed,
    WashingMachine,
    Wind,
    Fan,
    Refrigerator,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    Plus,
    Trash2,
    Filter,
    ChevronRight,
    Info,
    Settings,
    PlusCircle,
    BarChart3,
    Award,
    RotateCcw,
    Home,
    Tv,
    Check,
    ListTodo,
    Activity,
    BookOpen,
    Coffee,
    Lightbulb,
    CheckCircle
  };

  const IconComponent = iconMap[name] || Sparkles; // Fallback to Sparkles
  return <IconComponent className={className} size={size} />;
};
