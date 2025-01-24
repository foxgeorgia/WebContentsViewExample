import React, {
  useCallback,
  useEffect,
  useMemo,
  useLayoutEffect,
  useRef,
  // useState,
} from 'react';
import './App.css';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { select } from 'd3-selection';
import { zoom, ZoomTransform } from 'd3-zoom';
import DraggableCard from './DraggableCard';

export type Card = {
  id: string;
  coordinates: { x: number; y: number };
  type: 'draggableCard';
  showImage: boolean;
};

export default function MainCanvas({
  cards,
  setCards,
  transform,
  setTransform,
}: {
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  transform: ZoomTransform;
  setTransform: (transform: ZoomTransform) => void;
}) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const zoomBehavior = useMemo(() => zoom<HTMLDivElement, unknown>(), []);
  const updateAndForwardRef = (div: HTMLDivElement | null) => {
    canvasRef.current = div;
  };

  useEffect(() => {
    const initializeWebViews = async () => {
      // Create WebContentsView in Electron main process
      await window.electron.ipcRenderer.invoke('show-webviews', 100000000);
    };
    initializeWebViews();
  }, []);

  const sendWebViewPosition = async (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const rect = element.getBoundingClientRect();
      const coordinates = { x: rect.x, y: rect.y };
      // Send the updated position to the main process
      window.electron.ipcRenderer.sendMessage('update-webview-position', {
        id,
        coordinates,
      });
    }
  };

  // const sendZoomLevel = useCallback(async (zoomLevel: number) => {
  //   // Send zoom level to main process
  //   window.electron.ipcRenderer.sendMessage('update-zoom-level', { zoomLevel });
  // }, []);

  useEffect(() => {
    const updateWebViewPositions = async () => {
      await Promise.all(
        cards.map(async (card) => {
          await sendWebViewPosition(card.id);
        }),
      );
    };

    updateWebViewPositions();
  }, [transform, cards]);

  const updateTransform = useCallback(
    ({ transform: newTransform }: { transform: ZoomTransform }) => {
      setTransform(newTransform);
      // sendZoomLevel(newTransform.k);
    },
    [setTransform],
  );

  useLayoutEffect(() => {
    if (!canvasRef.current) return;

    // Attach d3-zoom to the canvas
    zoomBehavior.on('zoom', updateTransform);
    select(canvasRef.current).call(zoomBehavior);
  }, [zoomBehavior, updateTransform]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const activeId = active.id;

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === activeId
          ? {
              ...card,
              coordinates: {
                x: card.coordinates.x + delta.x,
                y: card.coordinates.y + delta.y,
              },
            }
          : card,
      ),
    );
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        id="canvas"
        ref={canvasRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        <div
          ref={updateAndForwardRef}
          style={{
            position: 'relative',
            transformOrigin: 'top left',
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.k})`,
            width: '100%',
            height: '100%',
          }}
        >
          {cards.map((card) => (
            <DraggableCard
              key={card.id}
              card={card}
              canvasTransform={transform}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}
