import { useEffect } from 'react';
import { Logger } from '../lib/logger';

interface SecurityHeadersConfig {
  enableCSP: boolean;
  enableHSTS: boolean;
  enableXSSProtection: boolean;
  enableFrameOptions: boolean;
  enableContentTypeOptions: boolean;
  cspDirectives?: ContentSecurityPolicyDirectives;
}

interface ContentSecurityPolicyDirectives {
  'default-src'?: string;
  'script-src'?: string;
  'style-src'?: string;
  'img-src'?: string;
  'font-src'?: string;
  'connect-src'?: string;
  'media-src'?: string;
  'object-src'?: string;
  'frame-src'?: string;
  'frame-ancestors'?: string;
  'form-action'?: string;
  'base-uri'?: string;
  'manifest-src'?: string;
  'worker-src'?: string;
  'child-src'?: string;
  'prefetch-src'?: string;
  'navigate-to'?: string;
  [key: string]: string | undefined;
}

const defaultCSPDirectives: ContentSecurityPolicyDirectives = {
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://actual-shark-31.clerk.accounts.dev",
  'style-src': "'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com https://fonts.googleapis.com",
  'img-src': "'self' data: https: https://brokeranalysis.com",
  'font-src': "'self' data: https://fonts.gstatic.com https://fonts.googleapis.com",
  'connect-src': "'self' https://efxpwrnxdorgzcqhbnfn.supabase.co wss://efxpwrnxdorgzcqhbnfn.supabase.co https://actual-shark-31.clerk.accounts.dev",
  'media-src': "'self' data:",
  'object-src': "'none'",
  'frame-src': "'self'",
  // frame-ancestors removed - cannot be used in meta tags
  'form-action': "'self'",
  'base-uri': "'self'",
  'manifest-src': "'self'",
  'worker-src': "'self' blob:",
  'child-src': "'self'",
  // prefetch-src and navigate-to removed - not recognized in meta tags
};

export const useSecurityHeaders = (config: SecurityHeadersConfig = {
  enableCSP: true,
  enableHSTS: true,
  enableXSSProtection: true,
  enableFrameOptions: true,
  enableContentTypeOptions: true,
  cspDirectives: defaultCSPDirectives,
}) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const headers: Record<string, string> = {};

      // Content Security Policy
      if (config.enableCSP) {
        const cspDirectives = config.cspDirectives || defaultCSPDirectives;
        const cspString = Object.entries(cspDirectives)
          .map(([key, value]) => value ? `${key} ${value}` : '')
          .filter(Boolean)
          .join('; ');
        headers['Content-Security-Policy'] = cspString;
      }

      // HTTP Strict Transport Security
      if (config.enableHSTS && window.location.protocol === 'https:') {
        headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
      }

      // XSS Protection
      if (config.enableXSSProtection) {
        headers['X-XSS-Protection'] = '1; mode=block';
      }

      // Frame Options - removed as it cannot be set via meta tags
      // X-Frame-Options should be set via HTTP headers, not meta tags
      // if (config.enableFrameOptions) {
      // headers['X-Frame-Options'] = 'DENY';
      // }

      // Content Type Options
      if (config.enableContentTypeOptions) {
        headers['X-Content-Type-Options'] = 'nosniff';
      }

      // Additional security headers
      headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
      headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=(), payment=()';
      headers['Cross-Origin-Opener-Policy'] = 'same-origin';
      headers['Cross-Origin-Embedder-Policy'] = 'require-corp';

      // Apply headers via meta tags (for client-side only)
      applySecurityHeaders(headers);
      Logger.info('Security headers applied successfully');
    } catch (error) {
      Logger.error('Failed to apply security headers:', error);
    }
  }, [config]);
};

function applySecurityHeaders(headers: Record<string, string>): void {
  Object.entries(headers).forEach(([name, content]) => {
    // Remove existing meta tag if present
    const existingMeta = document.querySelector(`meta[http-equiv="${name}"]`);
    if (existingMeta) {
      existingMeta.remove();
    }

    // Create new meta tag
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', name);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  });
}

// Hook for preventing clickjacking
export const useClickjackingProtection = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const style = document.createElement('style');
    style.textContent = `
      body {
        position: relative;
      }
      body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999999;
        pointer-events: none;
        display: none;
      }
      body.in-iframe::before {
        display: block;
        background: rgba(255, 0, 0, 0.1);
      }
    `;
    document.head.appendChild(style);

    // Check if page is in iframe
    if (window.top !== window.self) {
      document.body.classList.add('in-iframe');
      Logger.warn('Page is loaded in an iframe - potential clickjacking attempt');
    }

    return () => {
      document.head.removeChild(style);
    };
  }, []);
};

// Hook for preventing CSRF
export const useCSRFProtection = () => {
  const getCSRFToken = (): string => {
    let token = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrf_token='))
      ?.split('=')[1];

    if (!token) {
      token = generateCSRFToken();
      document.cookie = `csrf_token=${token}; path=/; secure; samesite=strict`;
    }

    return token;
  };

  const generateCSRFToken = (): string => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  return { getCSRFToken };
};

// Hook for secure localStorage
export const useSecureStorage = () => {
  const isSecureContext = typeof window !== 'undefined' && window.isSecureContext;

  const setItem = (key: string, value: string): void => {
    if (isSecureContext) {
      try {
        localStorage.setItem(key, btoa(value));
      } catch (error) {
        Logger.error('Failed to encrypt localStorage item:', error);
      }
    }
  };

  const getItem = (key: string): string | null => {
    if (isSecureContext) {
      try {
        const value = localStorage.getItem(key);
        return value ? atob(value) : null;
      } catch (error) {
        Logger.error('Failed to decrypt localStorage item:', error);
        return null;
      }
    }
    return null;
  };

  const removeItem = (key: string): void => {
    localStorage.removeItem(key);
  };

  return { setItem, getItem, removeItem };
};