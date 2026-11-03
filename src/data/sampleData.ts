import { NutritionTargets, TodayNutrition, QuickAddOption, WorkoutOverview, NavigationItem } from '../lib/types';

export const initialTargets: NutritionTargets = {
  calories: 2600,
  protein: 160,
  water: 3.0,
};

export const initialNutrition: TodayNutrition = {
  calories: 1640,
  protein: 98,
  water: 1.2,
};

export const quickAddOptions: QuickAddOption[] = [
  {
    id: 'futurelife',
    label: 'Futurelife + milk',
    calories: 390,
    protein: 18,
  },
  {
    id: 'burger',
    label: 'Burger on brown',
    calories: 550,
    protein: 32,
  },
  {
    id: 'eggs',
    label: 'Eggs + toast',
    calories: 320,
    protein: 19,
  },
];

export const sampleWorkout: WorkoutOverview = {
  name: 'Upper A',
  subtitle: 'Dumbbells, 6 exercises',
};

export const pendingPhotosBanner = {
  count: 2,
  message: '2 photos waiting to confirm',
};

export const navigationItems: NavigationItem[] = [
  { id: 'today', label: 'Today', path: '/today', iconName: 'today' },
  { id: 'log', label: 'Log', path: '/log', iconName: 'log' },
  { id: 'train', label: 'Train', path: '/train', iconName: 'train' },
  { id: 'progress', label: 'Progress', path: '/progress', iconName: 'progress' },
  { id: 'more', label: 'More', path: '/more', iconName: 'more' },
];

export const moreMenuItems = [
  { id: 'presets', label: 'Presets', description: 'Quick meal and workout templates' },
  { id: 'targets', label: 'Targets', description: 'Daily calorie, protein, and water targets' },
  { id: 'workouts', label: 'Workouts', description: 'Saved routines and training splits' },
  { id: 'equipment', label: 'Equipment', description: 'Available gym and home equipment' },
  { id: 'reminders', label: 'Reminders', description: 'Hydration and meal check-in prompts' },
  { id: 'telegram', label: 'Telegram', description: 'Sync with Telegram fitness bot' },
  { id: 'data-account', label: 'Data and account', description: 'Export data, preferences, and backups' },
];
