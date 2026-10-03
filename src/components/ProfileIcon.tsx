import React from 'react';
import { Music, Clapperboard, MessageSquare, Gamepad2, Sliders } from 'lucide-react';

interface ProfileIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export function ProfileIcon({ icon, size = 16, className }: ProfileIconProps) {
  switch (icon) {
    case 'music':
    case '🎵':
      return <Music size={size} className={className} />;
    case 'movie':
    case '🎬':
      return <Clapperboard size={size} className={className} />;
    case 'meeting':
    case '💬':
      return <MessageSquare size={size} className={className} />;
    case 'gaming':
    case '🎮':
      return <Gamepad2 size={size} className={className} />;
    default:
      return <Sliders size={size} className={className} />;
  }
}

export default ProfileIcon;
