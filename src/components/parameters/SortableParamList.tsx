import * as React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Parameter } from '../../types/models';
import { SortableParamItem } from './SortableParamItem';

interface SortableParamListProps {
  parameters: Parameter[];
  onReorder: (newOrder: Parameter[]) => void;
  onUpdate: (param: Parameter) => void;
  onDelete: (id: string) => void;
}

export const SortableParamList: React.FC<SortableParamListProps> = ({
  parameters,
  onReorder,
  onUpdate,
  onDelete,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = parameters.findIndex((p) => p.id === active.id);
      const newIndex = parameters.findIndex((p) => p.id === over.id);

      onReorder(arrayMove(parameters, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={parameters.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {parameters.map((param) => (
            <SortableParamItem
              key={param.id}
              param={param}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}; 