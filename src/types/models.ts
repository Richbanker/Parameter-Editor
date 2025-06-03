export type ParamType = 'number' | 'string' | 'boolean' | 'enum' | 'color';

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  enum?: string[];
  custom?: (value: any) => boolean;
}

export interface Parameter {
  id: string;
  name: string;
  value: any;
  type: ParamType;
  description?: string;
  category?: string;
  validation?: ValidationRule;
  metadata?: Record<string, any>;
}

export interface Model {
  id: string;
  name: string;
  parameters: Parameter[];
  createdAt: number;
  updatedAt: number;
  version: number;
}

export type HistoryActionType = 'create' | 'update' | 'delete' | 'move';

export interface HistoryEntry {
  id: string;
  type: HistoryActionType;
  timestamp: number;
  description: string;
  changes?: Record<string, any>;
  modelId: string;
}

export interface EditorState {
  models: Model[];
  selectedModel: Model | null;
  history: HistoryEntry[];
  currentHistoryIndex: number;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: number;
}

export interface EditorStore extends EditorState {
  setSelectedModel: (model: Model) => void;
  updateParameter: (modelId: string, paramId: string, value: any) => void;
  addParameter: (modelId: string, parameter: Omit<Parameter, 'id'>) => void;
  deleteParameter: (modelId: string, paramId: string) => void;
  undo: () => void;
  redo: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  reorderParameters: (modelId: string, newOrder: Parameter[]) => void;
}

export interface ParameterStore {
  models: Model[];
  selectedModel: Model | null;
  setSelectedModel: (model: Model) => void;
  updateParameter: (modelId: string, paramId: string, value: string | number) => void;
}