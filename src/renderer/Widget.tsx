import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface WidgetProps {
  webview: boolean;
}

function Widget({ webview = true }: WidgetProps) {
  const [searchParams] = useSearchParams();

  const cost = parseInt(searchParams.get('cost') || '100', 10);
  const webviewId = searchParams.get('webviewId') || 'nativeId';

  const [dimensions, setDimensions] = useState({ width: '205', height: '200' });

  const [counter, setCounter] = useState(1000);
  const frameCount = 31;
  const currentFrame = counter % frameCount;

  useEffect(() => {
    if (!window.electron) return undefined;

    // Listen for dimensions update from the main process
    const handleDimensionsUpdate = (...args: unknown[]) => {
      const [data] = args as [{ width: number; height: number }];

      // Update state with new dimensions
      setDimensions({
        width: data.width.toString(),
        height: data.height.toString(),
      });
    };

    const unsubscribe = window.electron.ipcRenderer.on(
      'update-webview-dimensions',
      handleDimensionsUpdate,
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      let x = 0;
      for (let i = 0; i < cost; i += 1) {
        x += Math.random();
      }

      setCounter(counter + 1);
    }, 100);

    return () => clearInterval(intervalId as unknown as number);
  }, [counter, cost]);
  return (
    <div
      style={{
        position: 'absolute',
        // display: 'flex',
        // flexDirection: 'column',
        // alignItems: 'center',
        // justifyContent: 'center',
        overflow: 'hidden',
        height: '100%',
        width: '100%',
      }}
    >
      <img
        id={webviewId}
        key={webviewId}
        src={`/assets/dancing-bear-${currentFrame + 1}.png`}
        alt={`Frame ${currentFrame + 1}`}
        style={{
          ...(webview
            ? {
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
              }
            : {}),
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

export default Widget;
