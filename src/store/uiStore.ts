import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type SidebarState = 'expanded' | 'collapsed';

interface UIStore {
  theme: Theme;
  sidebarState: SidebarState;
  mobileMenuOpen: boolean;
  commandPaletteOpen: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSidebarState: (state: SidebarState) => void;
  toggleSidebar: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      sidebarState: 'expanded',
      mobileMenuOpen: false,
      commandPaletteOpen: false,

      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },

      toggleTheme: () => {
        const current = get().theme;
        const next = current === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        applyTheme(next);
      },

      setSidebarState: (sidebarState) => set({ sidebarState }),

      toggleSidebar: () =>
        set((state) => ({
          sidebarState:
            state.sidebarState === 'expanded' ? 'collapsed' : 'expanded',
        })),

      setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
      toggleMobileMenu: () =>
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

      setCommandPaletteOpen: (commandPaletteOpen) =>
        set({ commandPaletteOpen }),
    }),
    {
      name: 'lms-ui',
      partialize: (state) => ({
        theme: state.theme,
        sidebarState: state.sidebarState,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);

// ─── Theme Application ────────────────────────────────────────────────────────

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  root.classList.toggle('dark', isDark);
}

// Apply theme on system preference change
if (typeof window !== 'undefined') {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      const { theme } = useUIStore.getState();
      if (theme === 'system') {
        applyTheme('system');
      }
    });
}
