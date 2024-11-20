import { create } from 'zustand';

interface HouseholdState {
  name: string | null;
  id: string | null;
  authenticated: boolean;
  login: (householdName: string, householdId: string) => void;
  logout: () => void;
}

export const useHouseholdStore = create<HouseholdState>((set) => ({
  id: null,
  name: null,
  authenticated: false,
  login: (householdName, householdId) =>
    set({ name: householdName, id: householdId, authenticated: true }),
  logout: () => set({ name: null, id: null, authenticated: false }),
}));
