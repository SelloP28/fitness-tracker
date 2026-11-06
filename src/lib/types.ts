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
