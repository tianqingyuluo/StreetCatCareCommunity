import {create} from 'zustand';
import { navigateToTab } from '../utils/navRouteMap';

interface NavigationState {
    activeTab: string;
    showBottomNav: boolean;
    setActiveTab: (tab: string) => void;
    setShowBottomNav: (show: boolean) => void;
    changeTab: (tab: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
    activeTab: 'login',
    showBottomNav: false,
    setActiveTab: (tab: string) => set({ activeTab: tab }),
    setShowBottomNav: (show: boolean) => set({ showBottomNav: show }),
    changeTab: (tab: string) => {
        set({ activeTab: tab })
        navigateToTab(tab);
    },
}));