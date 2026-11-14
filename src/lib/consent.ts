'use client';

import { useSyncExternalStore } from 'react';

/*
 * Consentement aux contenus tiers (RGPD / recommandations CNIL).
 * Le site ne dépose aucun cookie et ne mesure pas l'audience. Seul YouTube (Google) peut
 * déposer des traceurs : il n'est donc chargé qu'après un accord explicite du visiteur.
 * - "granted" : accord retenu dans ce navigateur (localStorage), modifiable à tout moment ;
 * - "session" : accord donné pour une seule lecture, oublié au rechargement ;
 * - null : aucun choix, rien n'est chargé.
 * Le choix retenu expire au bout de 6 mois, comme le recommande la CNIL.
 */

export type Consent = 'granted' | 'denied' | 'session' | null;

const KEY = 'consent.youtube';
const MAX_AGE = 1000 * 60 * 60 * 24 * 182;

let session: Consent = null;
const listeners = new Set<() => void>();

function read(): Consent {
  if (session) return session;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { value, at } = JSON.parse(raw) as { value: Consent; at: number };
    if (Date.now() - at > MAX_AGE) {
      localStorage.removeItem(KEY);
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

export function setYouTubeConsent(value: Consent, remember = true) {
  session = null;
  try {
    if (value && remember && value !== 'session') localStorage.setItem(KEY, JSON.stringify({ value, at: Date.now() }));
    else localStorage.removeItem(KEY);
  } catch {
    /* stockage indisponible : le choix vaut pour cette visite */
  }
  if (value && !remember) session = value === 'granted' ? 'session' : value;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === KEY && listener();
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/** Choix courant ; côté serveur (export statique), toujours « aucun choix ». */
export function useYouTubeConsent(): Consent {
  return useSyncExternalStore(subscribe, read, () => null);
}

/** Vrai si YouTube peut être chargé (accord retenu ou pour cette visite). */
export const allowsYouTube = (c: Consent) => c === 'granted' || c === 'session';
