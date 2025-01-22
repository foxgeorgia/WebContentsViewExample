import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { zoom, zoomIdentity, ZoomTransform } from 'd3-zoom';
import { select } from 'd3-selection';
import MainCanvas from './MainCanvas';
import SlowRenderComponent from './SlowRenderComponent';

export type WebViewCard = {
  id: string;
  coordinates: { x: number; y: number };
  type: 'webview';
  cost: number;
};

export default function App() {
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity);
  const zoomBehavior = useMemo(() => zoom<HTMLDivElement, unknown>(), []);

  const updateTransform = useCallback(
    ({ transform: newTransform }: { transform: ZoomTransform }) => {
      setTransform(newTransform);
    },
    [setTransform],
  );

  useEffect(() => {
    const canvasElement = document.getElementById('canvas') as HTMLDivElement;
    if (canvasElement) {
      zoomBehavior.on('zoom', updateTransform);
      select(canvasElement).call(zoomBehavior);
    }
  }, [zoomBehavior, updateTransform]);

  // const webViewCards: WebViewCard[] = [
  //   { id: 'webview1', coordinates: { x: 0, y: 0 }, type: 'webview', cost: 100 },
  //   {
  //     id: 'webview2',
  //     coordinates: { x: 700, y: 0 },
  //     type: 'webview',
  //     cost: 200,
  //   },
  //   {
  //     id: 'webview3',
  //     coordinates: { x: 0, y: 400 },
  //     type: 'webview',
  //     cost: 300,
  //   },
  // ];

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainCanvas transform={transform} />} />
        {/* <Route
          path="/webViewCards"
          element={
            <div>
              {webViewCards.map((webViewCard) => (
                <DraggableCard key={webViewCard.id} card={webViewCard} />
              ))}
            </div>
          }
        /> */}
        <Route
          path="/slowrender"
          element={
            <SlowRenderComponent onFocus={() => true} onBlur={() => false} />
          }
        />
      </Routes>
    </HashRouter>
  );
}
