import React, { useEffect, useState } from 'react';
// import './App.css';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { ZoomTransform } from 'd3-zoom';
import DraggableCard from './DraggableCard';

export type Card = {
  id: string;
  coordinates: { x: number; y: number };
  type: 'card';
};

export type WebViewCard = {
  id: string;
  coordinates: { x: number; y: number };
  type: 'webview';
  cost: number;
};

type Props = {
  transform: ZoomTransform;
};
function MainCanvas({ transform }: Props) {
  const [cards, setCards] = useState<Card[]>([
    { id: 'card1', coordinates: { x: 50, y: 50 }, type: 'card' },
  ]);

  // const [webViewCards, setWebViewCards] = useState<WebViewCard[]>([
  //   { id: 'webview1', coordinates: { x: 0, y: 0 }, type: 'webview', cost: 100 },
  // ]);

  useEffect(() => {
    const initializeWebViews = async () => {
      // Create WebContentsView in Electron main process
      await window.electron.ipcRenderer.invoke('show-webviews', 1000000000);
    };

    initializeWebViews();
  }, []);

  const updateDraggedItemPosition = ({ delta, active }: DragEndEvent) => {
    if (!delta || !active.id) return;

    const activeId = String(active.id);

    setCards((prev) =>
      prev.map((item) =>
        item.id === activeId
          ? {
              ...item,
              coordinates: {
                x: item.coordinates.x + delta.x,
                y: item.coordinates.y + delta.y,
              },
            }
          : item,
      ),
    );
  };

  return (
    <DndContext onDragEnd={updateDraggedItemPosition}>
      <div
        id="canvas"
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
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

export default MainCanvas;

// import React, { useEffect, useState } from 'react';
// import { DndContext, DragEndEvent } from '@dnd-kit/core';
// import DraggableCard from './DraggableCard';

// export type Card = {
//   id: string;
//   coordinates: { x: number; y: number };
//   type: 'card' | 'webview'; // Added a type to distinguish cards
// };

// function MainCanvas() {
//   const [elements, setElements] = useState<Card[]>([
//     { id: 'card1', coordinates: { x: 50, y: 50 }, type: 'card' },
//   ]);

//   useEffect(() => {
//     const handleShowWebViews = async () => {
//       window.electron.ipcRenderer.invoke('show-webviews', 100000000);
//     };
//     handleShowWebViews();
//   }, []);

//   const updateDraggedElementPosition = ({ delta, active }: DragEndEvent) => {
//     if (!delta || !active.id) return;

//     setElements((prevElements) =>
//       prevElements.map((element) =>
//         element.id === active.id
//           ? {
//               ...element,
//               coordinates: {
//                 x: element.coordinates.x + delta.x,
//                 y: element.coordinates.y + delta.y,
//               },
//             }
//           : element,
//       ),
//     );
//   };

//   return (
//     <DndContext onDragEnd={updateDraggedElementPosition}>
//       <div
//         style={{
//           position: 'relative',
//           width: '100%',
//           height: '100vh',
//         }}
//       >
//         {elements.map((element) => (
//           <DraggableCard key={element.id} card={element} />
//         ))}
//       </div>
//     </DndContext>
//   );
// }

// export default MainCanvas;
// import React, { useState } from 'react';
// import SlowRenderComponent from './SlowRenderComponent';
// import WebviewToggle from './WebViewToggle';

// function MainCanvas() {
//   const [isBusy, setIsBusy] = useState(false);
//   const cost = 100;

//   return (
//     <div style={{ display: 'flex', alignItems: 'left' }}>
//       {/* <textarea
//         value={text}
//         onChange={handleTextChange}
//         style={{
//           marginRight: '10px',
//           padding: '10px',
//           height: '40px',
//         }}
//         placeholder="Start typing here..."
//       /> */}

//       <button
//         type="button"
//         onClick={() => setIsBusy((prevState) => !prevState)}
//         style={{
//           marginRight: '10px',
//           padding: '10px',
//           backgroundColor: '#4CAF50',
//           color: 'white',
//           height: '50px',
//           border: 'none',
//           borderRadius: '4px',
//         }}
//       >
//         {isBusy ? 'Stop Slow Render' : 'Start Slow Render'}
//       </button>
//       <WebviewToggle />
//       {isBusy && (
//         <div>
//           <div style={{ marginBottom: '10px' }}>
//             <SlowRenderComponent cost={cost} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MainCanvas;
