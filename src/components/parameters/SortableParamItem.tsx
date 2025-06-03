import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Parameter } from '../../types/models';

interface SortableParamItemProps {
  param: Parameter;
  onUpdate: (param: Parameter) => void;
  onDelete: (id: string) => void;
}

export const SortableParamItem: React.FC<SortableParamItemProps> = ({
  param,
  onUpdate,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: param.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '0.25rem',
    boxShadow: isDragging ? '0 4px 8px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
    border: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="param-item"
      {...attributes}
      {...listeners}
    >
      <div className="param-item-content flex-grow mr-4">
        <div className="param-item-header flex items-center mb-2">
          <h3 className="text-lg font-semibold mr-2">{param.name}</h3>
          <span className="text-sm text-gray-500">({param.type})</span>
        </div>
        <div className="param-item-body">
          {param.description && (
            <p className="text-sm text-gray-700 mb-2">{param.description}</p>
          )}
          <div className="param-item-value">
            <input
              type={param.type === 'number' ? 'number' : param.type === 'color' ? 'color' : 'text'}
              value={param.value}
              onChange={(e) => {
                let newValue: any = e.target.value;
                
                if (param.type === 'number') {
                  newValue = Number(e.target.value);
                  if (isNaN(newValue)) {
                    newValue = 0;
                  }
                } else if (param.type === 'boolean') {
                   newValue = e.target.checked;
                } else if (param.type === 'enum') {
                   // Обработка для select
                } else if (param.type === 'color') {
                   newValue = e.target.value; // Для цвета значение уже в нужном формате (hex string)
                }

                onUpdate({
                  ...param,
                  value: newValue,
                });
              }}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        </div>
      </div>
      <button
        onClick={() => onDelete(param.id)}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
      >
        Delete
      </button>
    </div>
  );
}; 