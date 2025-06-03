import { create } from 'zustand'
// import { produce } from 'immer'
import { v4 as uuidv4 } from 'uuid'
import { EditorStore, Model, Parameter, HistoryEntry, Notification, HistoryActionType } from '../types/models'

const MAX_HISTORY_LENGTH = 50

const createHistoryEntry = (
  modelId: string,
  type: HistoryActionType,
  changes: HistoryEntry['changes'],
  description: string
): HistoryEntry => ({
  id: uuidv4(),
  modelId,
  type,
  timestamp: Date.now(),
  changes,
  description
})

const useParamsStore = create<EditorStore>((set, get) => ({
  models: [
    {
      id: 'model-1',
      name: 'Model A',
      parameters: [
        { id: 'param-1', name: 'Param 1', value: 10, type: 'number' },
        { id: 'param-2', name: 'Param 2', value: 'test', type: 'string' },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    },
    {
      id: 'model-2',
      name: 'Model B',
      parameters: [
        { id: 'param-3', name: 'Param 3', value: true, type: 'boolean' },
        { id: 'param-4', name: 'Param 4', value: '#ff0000', type: 'color' },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    },
  ],
  selectedModel: null,
  history: [],
  currentHistoryIndex: -1,
  theme: 'light',
  notifications: [],

  setSelectedModel: (model: Model) => {
    set({ selectedModel: model })
  },

  updateParameter: (modelId: string, paramId: string, value: any) => {
    set(state => {
      const targetModel = state.models.find(m => m.id === modelId);
      if (!targetModel) return state;

      const targetParam = targetModel.parameters.find(p => p.id === paramId);
      if (!targetParam) return state;

      const oldValue = targetParam.value;

      if (oldValue === value) return state;

      const updatedParameters = targetModel.parameters.map(param =>
        param.id === paramId ? { ...param, value: value } : param
      );

      const updatedModel = {
        ...targetModel,
        parameters: updatedParameters,
        updatedAt: Date.now(),
        version: targetModel.version + 1,
      };

      const historyEntry = createHistoryEntry(modelId, 'update', {
        before: { [paramId]: oldValue },
        after: { [paramId]: value }
      }, `Updated parameter ${targetParam.name}`);

      const newModels = state.models.map(model =>
        model.id === modelId ? updatedModel : model
      );

      const newHistory = [
        ...state.history.slice(0, state.currentHistoryIndex + 1),
        historyEntry
      ];

      const finalHistory = newHistory.slice(-MAX_HISTORY_LENGTH);
      const newHistoryIndex = finalHistory.length - 1;

      return {
        ...state,
        models: newModels,
        history: finalHistory,
        currentHistoryIndex: newHistoryIndex,
      };
    });
  },

  addParameter: (modelId: string, parameter: Omit<Parameter, 'id'>) => {
    set(state => {
      const targetModel = state.models.find(m => m.id === modelId);
      if (!targetModel) return state;

      const newParam: Parameter = { ...parameter, id: uuidv4() };

      const updatedParameters = [...targetModel.parameters, newParam];

      const updatedModel = {
        ...targetModel,
        parameters: updatedParameters,
        updatedAt: Date.now(),
        version: targetModel.version + 1,
      };

      const historyEntry = createHistoryEntry(modelId, 'create', {
        after: newParam
      }, `Added new parameter ${newParam.name}`);

      const newModels = state.models.map(model =>
        model.id === modelId ? updatedModel : model
      );

      const newHistory = [...state.history.slice(0, state.currentHistoryIndex + 1), historyEntry];
      const finalHistory = newHistory.slice(-MAX_HISTORY_LENGTH);
      const newHistoryIndex = finalHistory.length - 1;

      return {
        ...state,
        models: newModels,
        history: finalHistory,
        currentHistoryIndex: newHistoryIndex,
      };
    });
  },

  deleteParameter: (modelId: string, paramId: string) => {
    set(state => {
      const targetModel = state.models.find(m => m.id === modelId);
      if (!targetModel) return state;

      const paramToDelete = targetModel.parameters.find(p => p.id === paramId);
      if (!paramToDelete) return state;

      const updatedParameters = targetModel.parameters.filter(p => p.id !== paramId);

      const updatedModel = {
        ...targetModel,
        parameters: updatedParameters,
        updatedAt: Date.now(),
        version: targetModel.version + 1,
      };

      const historyEntry = createHistoryEntry(modelId, 'delete', {
        before: paramToDelete
      }, `Deleted parameter ${paramToDelete.name}`);

      const newModels = state.models.map(model =>
        model.id === modelId ? updatedModel : model
      );

      const newHistory = [...state.history.slice(0, state.currentHistoryIndex + 1), historyEntry];
      const finalHistory = newHistory.slice(-MAX_HISTORY_LENGTH);
      const newHistoryIndex = finalHistory.length - 1;

      return {
        ...state,
        models: newModels,
        history: finalHistory,
        currentHistoryIndex: newHistoryIndex,
      };
    });
  },

  undo: () => {
    set(state => {
      if (state.currentHistoryIndex < 0) return state;

      const historyEntry = state.history[state.currentHistoryIndex];
      const targetModel = state.models.find(m => m.id === historyEntry.modelId);
      if (!targetModel) return state;

      const updatedModel = { ...targetModel };

      switch (historyEntry.type) {
        case 'update':
          if (historyEntry.changes?.before) {
            updatedModel.parameters = updatedModel.parameters.map(param => {
              if (historyEntry.changes?.before?.[param.id] !== undefined) {
                return { ...param, value: historyEntry.changes.before[param.id] };
              }
              return param;
            });
            updatedModel.updatedAt = Date.now();
          }
          break;
        case 'create':
          if (historyEntry.changes) {
            const changes = historyEntry.changes;
            if (changes.before?.id) {
              updatedModel.parameters = [...updatedModel.parameters, changes.before];
              updatedModel.updatedAt = Date.now();
            }
          }
          break;
        case 'delete':
          if (historyEntry.changes) {
            const changes = historyEntry.changes;
            if (changes.before) {
              updatedModel.parameters = [...updatedModel.parameters, changes.before];
              updatedModel.updatedAt = Date.now();
            }
          }
          break;
        case 'move':
          if (historyEntry.changes?.before) {
            const oldOrderIds: string[] = historyEntry.changes.before;
            const paramsMap = new Map(updatedModel.parameters.map(p => [p.id, p]));
            updatedModel.parameters = oldOrderIds.map(id => paramsMap.get(id)).filter((p): p is Parameter => p !== undefined);
            updatedModel.updatedAt = Date.now();
          } else {
            console.warn('Undo for move requires changes.before to contain old parameter order.');
          }
          break;
      }

      const newModels = state.models.map(model =>
        model.id === updatedModel.id ? updatedModel : model
      );

      const newHistoryIndex = state.currentHistoryIndex - 1;

      return {
        ...state,
        models: newModels,
        currentHistoryIndex: newHistoryIndex,
      };
    });
  },

  redo: () => {
    set(state => {
      if (state.currentHistoryIndex >= state.history.length - 1) return state;

      const historyEntry = state.history[state.currentHistoryIndex + 1];
      const targetModel = state.models.find(m => m.id === historyEntry.modelId);
      if (!targetModel) return state;

      const updatedModel = { ...targetModel };

      switch (historyEntry.type) {
        case 'update':
          if (historyEntry.changes?.after) {
            updatedModel.parameters = updatedModel.parameters.map(param => {
              if (historyEntry.changes?.after?.[param.id] !== undefined) {
                return { ...param, value: historyEntry.changes.after[param.id] };
              }
              return param;
            });
            updatedModel.updatedAt = Date.now();
          }
          break;
        case 'create':
          if (historyEntry.changes) {
            const changes = historyEntry.changes;
            if (changes.after) {
              const newParam: Parameter = changes.after;
              if (!updatedModel.parameters.some(p => p.id === newParam.id)) {
                updatedModel.parameters = [...updatedModel.parameters, newParam];
                updatedModel.updatedAt = Date.now();
              }
            }
          }
          break;
        case 'delete':
          if (historyEntry.changes?.before?.id) {
            const deletedParamId = historyEntry.changes.before.id;
            updatedModel.parameters = updatedModel.parameters.filter(p => p.id !== deletedParamId);
            updatedModel.updatedAt = Date.now();
          }
          break;
        case 'move':
          if (historyEntry.changes?.after) {
            const newOrderIds: string[] = historyEntry.changes.after;
            const paramsMap = new Map(updatedModel.parameters.map(p => [p.id, p]));
            updatedModel.parameters = newOrderIds.map(id => paramsMap.get(id)).filter((p): p is Parameter => p !== undefined);
            updatedModel.updatedAt = Date.now();
          } else {
            console.warn('Redo for move requires changes.after to contain new parameter order.');
          }
          break;
      }

      const newModels = state.models.map(model =>
        model.id === updatedModel.id ? updatedModel : model
      );

      const newHistoryIndex = state.currentHistoryIndex + 1;

      return {
        ...state,
        models: newModels,
        currentHistoryIndex: newHistoryIndex,
      };
    });
  },

  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      timestamp: Date.now()
    };

    set(state => ({
      ...state,
      notifications: [...state.notifications, newNotification]
    }));

    setTimeout(() => {
      get().removeNotification(newNotification.id);
    }, 5000);
  },

  removeNotification: (id: string) => {
    set(state => ({
      ...state,
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  setTheme: (theme: 'light' | 'dark') => {
    set(state => ({
      ...state,
      theme: theme
    }));
  },

  reorderParameters: (modelId: string, newOrder: Parameter[]) => {
    set(state => {
      const targetModel = state.models.find(m => m.id === modelId);
      if (!targetModel) return state;

      if (targetModel.parameters.map(p => p.id).join(',') === newOrder.map(p => p.id).join(',')) {
        return state;
      }

      const oldOrder = targetModel.parameters;

      const updatedModel = {
        ...targetModel,
        parameters: newOrder,
        updatedAt: Date.now(),
        version: targetModel.version + 1,
      };

      const historyEntry = createHistoryEntry(modelId, 'move', { before: oldOrder.map(p => p.id), after: newOrder.map(p => p.id) }, 'Reordered parameters');

      const newModels = state.models.map(model =>
        model.id === modelId ? updatedModel : model
      );

      const newHistory = [...state.history.slice(0, state.currentHistoryIndex + 1), historyEntry];
      const finalHistory = newHistory.slice(-MAX_HISTORY_LENGTH);
      const newHistoryIndex = finalHistory.length - 1;

      return {
        ...state,
        models: newModels,
        history: finalHistory,
        currentHistoryIndex: newHistoryIndex,
      };
    });
  }
}));

export default useParamsStore 