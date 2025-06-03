// src/App.tsx

import * as React from 'react';
import useParamsStore from './store/useParamsStore';
import { SortableParamList } from './components/parameters/SortableParamList';
import { Notifications } from './components/ui/Notifications';
import { HistoryPanel } from './components/history/HistoryPanel';

const App: React.FC = () => {
  const { models, selectedModel, setSelectedModel, updateParameter, deleteParameter, notifications, removeNotification, history, currentHistoryIndex, undo, redo, reorderParameters } = useParamsStore();

  return (
    <div className="min-h-screen text-gray-900 flex flex-col items-center py-8">
      <header className="w-full max-w-4xl mx-auto px-4 mb-4 pb-4 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-center">Parameter Editor</h1>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Левая панель: Выбор модели и параметры */}
          <div className="lg:w-2/3">
            <div className="mb-6">
              <label htmlFor="model" className="block text-lg font-medium text-gray-700 mb-2">Выберите модель:</label>
              <select
                id="model"
                value={selectedModel?.id || ''}
                onChange={(e) => {
                  const model = models.find(m => m.id === e.target.value);
                  if (model) setSelectedModel(model);
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
              >
                <option value="">-- Не выбрано --</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedModel ? (
              <div className="p-6 border rounded-lg bg-white shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Редактирование параметров модели: {selectedModel.name}</h2>
                <SortableParamList
                  parameters={selectedModel.parameters}
                  onReorder={(newOrder) => {
                    if (selectedModel) {
                      reorderParameters(selectedModel.id, newOrder);
                    }
                  }}
                  onUpdate={(param) => {
                    updateParameter(selectedModel.id, param.id, param.value);
                  }}
                  onDelete={(paramId) => {
                    deleteParameter(selectedModel.id, paramId);
                  }}
                />
              </div>
            ) : (
              <p className="text-xl text-gray-500 text-center mt-8">Выберите модель для редактирования.</p>
            )}
          </div>

          {/* Правая панель: История изменений */}
          {selectedModel && (
            <div className="lg:w-1/3 mt-8 lg:mt-0 p-6 border rounded-lg bg-white shadow-lg">
              <h2 className="text-2xl font-bold mb-4">History</h2>
              <HistoryPanel
                history={history.filter(entry => entry.modelId === selectedModel.id)}
                currentIndex={history.filter(entry => entry.modelId === selectedModel.id).length - history.slice(currentHistoryIndex + 1).filter(entry => entry.modelId === selectedModel.id).length -1}
                onUndo={undo}
                onRedo={redo}
                onSelectVersion={(index) => console.log('Select version:', index)} // TODO: Implement version selection
              />
            </div>
          )}
        </div>
      </main>

      <Notifications notifications={notifications} onRemove={removeNotification} />
    </div>
  );
};

export default App;
