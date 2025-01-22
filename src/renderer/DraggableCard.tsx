import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ZoomTransform } from 'd3-zoom';
import SlowRenderComponent from './SlowRenderComponent';

interface DraggableCardProps {
  card: {
    id: string;
    coordinates: { x: number; y: number };
    type: 'card' | 'webview';
  };
  canvasTransform: ZoomTransform;
}

function DraggableCard({ card, canvasTransform }: DraggableCardProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
    disabled: isFocused,
  });

  const style = {
    position: 'absolute',
    top: `${card.coordinates.y}px`,
    left: `${card.coordinates.x}px`,
    transformOrigin: 'top left',
    ...(transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${canvasTransform.k})`,
        }
      : {
          transform: `scale(${canvasTransform.k})`,
        }),
    //zIndex: 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* <h4>{card.text}</h4> */}
      <SlowRenderComponent
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}

export default DraggableCard;
