import React from 'react';
import { Volume2 } from 'lucide-react';

interface AppIconProps {
  name: string;
  icon?: string;
  size?: number;
}

export function AppIcon({ name, icon, size = 20 }: AppIconProps) {
  // 1. Se veio o ícone real do executável Windows em Base64
  if (icon && icon.startsWith('data:image/')) {
    return (
      <img
        src={icon}
        alt={name}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          borderRadius: 3,
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
          display: 'block',
        }}
      />
    );
  }

  const normalized = (name || '').toLowerCase();

  // 2. Logotipos vetoriais oficiais de alta fidelidade
  if (normalized.includes('spotify')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#1DB954" />
        <path
          d="M17.5 10.8c-3.1-1.8-8.2-2-11.2-1.1-.5.1-.9-.1-1.1-.6-.2-.5.1-.9.6-1.1 3.5-1 9.1-.8 12.7 1.3.4.2.6.8.3 1.2-.2.4-.7.5-1.3.3zm-.3 3.1c-.2.4-.7.5-1.1.2-2.6-1.6-6.6-2.1-9.7-1.1-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1 3.5-1.1 7.9-.5 10.9 1.3.4.3.5.7.4 1.1zm-1.3 3c-.2.3-.6.4-.9.2-2.3-1.4-5.2-1.7-8.6-.9-.3.1-.7-.1-.8-.5-.1-.3.1-.7.5-.8 3.8-.9 7-.5 9.5 1 .3.3.4.7.3 1z"
          fill="#000000"
        />
      </svg>
    );
  }

  if (normalized.includes('chrome')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="11" fill="#FFFFFF" />
        <path d="M12 2a10 10 0 0 0-8.66 5l4.33 7.5L12 7h9.54A10 10 0 0 0 12 2z" fill="#EA4335" />
        <path d="M3.34 7a10 10 0 0 0 4.32 13.66L12 13.16 7.67 7.5H3.34z" fill="#34A853" />
        <path d="M20.66 7H12l4.33 7.5L20.66 7z" fill="#FBBC05" />
        <path d="M12 22a10 10 0 0 0 8.66-5h-8.66l-4.33 5A9.95 9.95 0 0 0 12 22z" fill="#FBBC05" />
        <circle cx="12" cy="12" r="5" fill="#FFFFFF" />
        <circle cx="12" cy="12" r="4" fill="#1A73E8" />
      </svg>
    );
  }

  if (normalized.includes('edge')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <defs>
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0078D7" />
            <stop offset="100%" stopColor="#00C781" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="11" fill="url(#edgeGrad)" />
        <path d="M12 4a8 8 0 0 1 7.8 6.2c-.8-.5-1.8-.8-2.8-.8-3.3 0-6 2.7-6 6 0 .4 0 .7.1 1.1A8 8 0 1 1 12 4z" fill="#FFFFFF" opacity="0.9" />
      </svg>
    );
  }

  if (normalized.includes('discord')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="5" fill="#5865F2" />
        <path
          d="M18.8 6.5A14.8 14.8 0 0 0 15 5.3a.1.1 0 0 0-.1 0 10.4 10.4 0 0 0-.5 1 13.7 13.7 0 0 0-4.8 0 10 10 0 0 0-.5-1 .1.1 0 0 0-.1 0 14.8 14.8 0 0 0-3.8 1.2.1.1 0 0 0 0 0C2.8 10 2.2 13.3 2.5 16.6a.1.1 0 0 0 0 .1 15 15 0 0 0 4.6 2.3.1.1 0 0 0 .1 0 10.8 10.8 0 0 0 1-1.6.1.1 0 0 0 0-.1 9.8 9.8 0 0 1-1.5-.7.1.1 0 0 1 0-.2c.1-.1.2-.2.3-.2a10.8 10.8 0 0 0 10.2 0 .1.1 0 0 1 .3.2c0 .1 0 .1 0 .2a9.8 9.8 0 0 1-1.5.7.1.1 0 0 0 0 .1 11.2 11.2 0 0 0 1 1.6.1.1 0 0 0 .1 0 15 15 0 0 0 4.6-2.3.1.1 0 0 0 0-.1c.4-3.8-.7-7.1-2.9-10.1zM8.5 14.4c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7c.9 0 1.5.8 1.5 1.7 0 1-.7 1.7-1.5 1.7zm7 0c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7c.9 0 1.5.8 1.5 1.7 0 1-.6 1.7-1.5 1.7z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  if (normalized.includes('whatsapp')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="11" fill="#25D366" />
        <path
          d="M17.3 14.5c-.3-.1-1.6-.8-1.8-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5 0-.2 0-.4-.1-.5s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.8 1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .8.8.3 1.6.2 2.2.1.7-.1 2.1-.8 2.4-1.7.3-.8.3-1.6.2-1.7-.1-.2-.3-.3-.6-.4z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }


  if (normalized.includes('eartrumpet')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="5" fill="#1E232A" />
        <path
          d="M6 9v6h4l5 5V4L10 9H6zm11.5 3c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4z"
          fill="#00E5FF"
        />
        <path
          d="M17.5 4.8v2.1c2.9.9 5 3.5 5 6.6s-2.1 5.7-5 6.6v2.1c4-.9 7-4.4 7-8.7s-3-7.8-7-8.7z"
          fill="#00FF88"
        />
      </svg>
    );
  }

  if (normalized.includes('vlc')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M12 2L6 18h12L12 2z" fill="#FF8800" />
        <path d="M7.5 14h9l1 3H6.5l1-3zm2-5h5l1 3H8.5l1-3z" fill="#FFFFFF" />
        <rect x="5" y="19" width="14" height="3" rx="1" fill="#FF8800" />
      </svg>
    );
  }

  if (normalized.includes('steam')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="11" fill="#171A21" stroke="#3A4753" strokeWidth="1" />
        <circle cx="16" cy="8" r="3.5" fill="#FFFFFF" />
        <circle cx="8" cy="15" r="2.5" fill="#FFFFFF" />
        <path d="M16 8l-8 7" stroke="#FFFFFF" strokeWidth="2.5" />
      </svg>
    );
  }

  if (normalized.includes('valorant')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="4" fill="#0F1923" />
        <path d="M4 6.5h4.8l5.8 11H9.8L4 6.5zm11.2 0h4.8L20 9.7l-4.8 7.8H10.4l4.8-11z" fill="#FF4655" />
      </svg>
    );
  }

  // Fallback padrão limpo e elegante
  return <Volume2 size={size} color="var(--color-primary)" />;
}

export default AppIcon;
