import React, { useState } from 'react';
import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { zoomIdentity, ZoomTransform } from 'd3-zoom';
import MainCanvas from './MainCanvas';
import Widget from './Widget';

export type Card = {
  id: string;
  coordinates: { x: number; y: number };
  type: 'draggableCard';
  showImage: boolean;
};

export default function App() {
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity);

  const [cards, setCards] = useState<Card[]>([
    {
      id: 'card1',
      coordinates: { x: 0, y: 0 },
      type: 'draggableCard',
      showImage: false,
    },
    {
      id: 'card2',
      coordinates: { x: 0, y: 200 },
      type: 'draggableCard',
      showImage: false,
    },
    {
      id: 'card3',
      coordinates: { x: 0, y: 400 },
      type: 'draggableCard',
      showImage: true,
    },
  ]);

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainCanvas
              cards={cards}
              setCards={setCards}
              transform={transform}
              setTransform={setTransform}
            />
          }
        />
        <Route path="/widget" element={<Widget />} />
      </Routes>
    </HashRouter>
  );
}
