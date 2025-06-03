import * as React from 'react';
import { format } from 'date-fns';
import { HistoryEntry } from '../../types/models';

interface HistoryPanelProps {
  history: HistoryEntry[];
  currentIndex: number;
  onUndo: () => void;
  onRedo: () => void;
  onSelectVersion: (index: number) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  currentIndex,
  onUndo,
  onRedo,
  onSelectVersion,
}) => {
  return (
    <div className="history-panel space-y-4">
      <div className="history-controls flex space-x-2">
        <button
          onClick={onUndo}
          disabled={currentIndex <= 0}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Undo
        </button>
        <button
          onClick={onRedo}
          disabled={currentIndex >= history.length - 1}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Redo
        </button>
      </div>
      <div className="history-list space-y-2 max-h-96 overflow-y-auto">
        {history.map((entry, index) => (
          <div
            key={entry.id}
            className={`history-item p-3 border rounded cursor-pointer transition-colors ${index === currentIndex ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-50'}`}
            onClick={() => onSelectVersion(index)}
          >
            <div className="history-item-header flex justify-between text-sm text-gray-600 mb-1">
              <span className="history-item-type font-semibold">{entry.type}</span>
              <span className="history-item-time">
                {format(entry.timestamp, 'HH:mm:ss')}
              </span>
            </div>
            <div className="history-item-details text-gray-800">
              <p className="text-sm">{entry.description}</p>
              {entry.changes && (
                <pre className="history-item-changes mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                  {JSON.stringify(entry.changes, null, 2)}
                </pre>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 