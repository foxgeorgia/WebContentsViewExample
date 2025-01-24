import { useDraggable } from '@dnd-kit/core';
import { ZoomTransform } from 'd3-zoom';
import Widget from './Widget';

interface DraggableCardProps {
  card: {
    showImage: any;
    id: string;
    coordinates: { x: number; y: number };
    type: 'draggableCard';
  };
  canvasTransform: ZoomTransform;
}

function DraggableCard({ card, canvasTransform }: DraggableCardProps) {
  // attributes, listeners,
  const { setNodeRef, listeners, transform } = useDraggable({
    id: card.id,
  });

  return (
    <div
      id={card.id}
      ref={setNodeRef}
      style={{
        position: 'absolute',
        top: `${card.coordinates.y * canvasTransform.k}px`,
        left: `${card.coordinates.x * canvasTransform.k}px`,
        transformOrigin: 'top left',
        ...(transform
          ? {
              // drag
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0px) scale(${canvasTransform.k})`,
            }
          : {
              // zoom
              transform: `scale(${canvasTransform.k})`,
            }),
      }}
      // {...attributes}
      // {...listeners}
      onPointerDown={(e) => {
        listeners?.onPointerDown?.(e);
        e.stopPropagation();
      }}
    >
      <div
        style={{
          // backgroundColor: 'orange',
          backgroundColor: '#00000000',
          width: '205px',
          height: '200px',
        }}
      >
        {card.showImage && <Widget />}
      </div>
    </div>
  );
}

export default DraggableCard;
