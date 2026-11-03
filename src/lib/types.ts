export interface NutritionTargets {
  calories: number; // in kcal, e.g. 2600
  protein: number;  // in g, e.g. 160
  water: number;    // in L, e.g. 3.0
}

export interface TodayNutrition {
  calories: number; // in kcal, e.g. 1640
  protein: number;  // in g, e.g. 98
  water: number;    // in L, e.g. 1.2
}

export interface QuickAddOption {
  id: string;
  label: string;
  calories: number;
  protein: number;
}

export interface WorkoutOverview {
  name: string;
  subtitle: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  iconName: 'today' | 'log' | 'train' | 'progress' | 'more';
}
