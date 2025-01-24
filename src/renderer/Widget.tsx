import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function Widget() {
  const [searchParams] = useSearchParams();

  const cost = parseInt(searchParams.get('cost') || '100', 10);
  // const webViewId = searchParams.get('id');

  const [counter, setCounter] = useState(1000);
  const frameCount = 31;
  const currentFrame = counter % frameCount;

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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        height: '100%',
        width: '100%',
      }}
    >
      <img
        src={`/assets/dancing-bear-${currentFrame + 1}.png`}
        alt={`Frame ${currentFrame + 1}`}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

export default Widget;
