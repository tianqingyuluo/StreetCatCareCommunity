import { create } from 'zustand';
import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { mapToUICat } from "../types/mapper";
import { catDataSource } from '@/services/dataSource';
import { NavigationHelper } from '../utils/navigation';
import { ROUTES } from '../config/routes';

interface CatState {
  // API 类型数据
  cats: API.CatResp[];
  selectedCat: API.CatResp | null;
  // 状态
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  // 导航状态
  currentTargetId: string | null;
  navigationLoading: boolean;
  // 筛选状态
  filterShelterId: string | null;
}

interface CatActions {
  // 数据获取
  fetchCats: (params?: API.CatListReq) => Promise<void>;
  fetchCatDetail: (id: string) => Promise<void>;
  fetchCatsByShelter: (shelterId: string) => Promise<void>;
  // 数据设置
  setCats: (cats: API.CatResp[]) => void;
  setSelectedCat: (cat: API.CatResp | null) => void;
  // 筛选方法
  setFilterShelterId: (shelterId: string | null) => void;
  clearFilterShelterId: () => void;
  // UI 类型 getter
  getCatsForUI: () => UI.UICat[];
  getSelectedCatForUI: () => UI.UICat | null;
  // 导航方法
  setCurrentTargetId: (id: string) => void;
  clearCurrentTargetId: () => void;
  navigateToCatDetail: (catId: string) => Promise<void>;
  navigateToCatComments: (catId: string) => Promise<void>;
  // 重置
  reset: () => void;
}

type CatStore = CatState & CatActions;

const initialState: CatState = {
  cats: [],
  selectedCat: null,
  loading: false,
  error: null,
  lastUpdated: null,
  currentTargetId: null,
  navigationLoading: false,
  filterShelterId: null,
};

export const useCatStore = create<CatStore>((set, get) => ({
  ...initialState,

  fetchCats: async (params) => {
    set({ loading: true, error: null });
    try {
      const result = await catDataSource.getCats(params);
      set({ 
        cats: result.records, 
        loading: false, 
        lastUpdated: Date.now() 
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchCatDetail: async (id) => {
    set({ loading: true, error: null });
    try {
      const cat = await catDataSource.getCatDetail(id);
      set({ selectedCat: cat, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchCatsByShelter: async (shelterId) => {
    set({ loading: true, error: null, filterShelterId: shelterId });
    try {
      const result = await catDataSource.getCats({ shelterId });
      set({ 
        cats: result.records, 
        loading: false, 
        lastUpdated: Date.now() 
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  setCats: (cats) => set({ cats }),
  setSelectedCat: (cat) => set({ selectedCat: cat }),

  // UI 类型转换 getter
  getCatsForUI: () => {
    const { cats } = get();
    return cats.map(mapToUICat);
  },

  getSelectedCatForUI: () => {
    const { selectedCat } = get();
    return selectedCat ? mapToUICat(selectedCat) : null;
  },

  // 筛选方法
  setFilterShelterId: (shelterId) => {
    set({ filterShelterId: shelterId });
  },

  clearFilterShelterId: () => {
    set({ filterShelterId: null });
  },

  // 导航状态管理
  setCurrentTargetId: (id) => {
    set({ currentTargetId: id });
  },

  clearCurrentTargetId: () => {
    set({ currentTargetId: null });
  },

  // 导航方法
  navigateToCatDetail: async (catId) => {
    try {
      // 1. 设置导航状态
      set({ currentTargetId: catId, navigationLoading: true });
      
      // 2. 执行页面跳转
      await NavigationHelper.navigateTo({
        url: ROUTES.CAT_DETAILS,
        showError: true,
        errorText: '页面跳转失败'
      });
      
      // 3. 更新导航状态
      set({ navigationLoading: false });
    } catch (error) {
      // 4. 错误处理
      set({ 
        error: (error as Error).message, 
        navigationLoading: false,
        currentTargetId: null  // 回滚状态
      });
    }
  },

  navigateToCatComments: async (catId) => {
    try {
      // 1. 设置导航状态
      set({ currentTargetId: catId, navigationLoading: true });
      
      // 2. 执行页面跳转
      await NavigationHelper.navigateTo({
        url: ROUTES.CAT_COMMENTS,
        showError: true,
        errorText: '页面跳转失败'
      });
      
      // 3. 更新导航状态
      set({ navigationLoading: false });
    } catch (error) {
      // 4. 错误处理
      set({ 
        error: (error as Error).message, 
        navigationLoading: false,
        currentTargetId: null  // 回滚状态
      });
    }
  },

  reset: () => set(initialState),
}));
