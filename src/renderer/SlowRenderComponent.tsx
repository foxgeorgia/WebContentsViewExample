import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function SlowRenderComponent({
  onFocus,
  onBlur,
}: {
  onFocus: () => void;
  onBlur: () => void;
}) {
  const [searchParams] = useSearchParams();

  const cost = parseInt(searchParams.get('cost') || '100', 10);
  const [counter, setCounter] = useState(1000);
  const [text, setText] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      let x = 0;
      for (let i = 0; i < cost; i += 1) {
        x += Math.random();
      }

      setCounter(counter + 1);
    }, 1000);

    return () => clearInterval(intervalId as unknown as number);
  }, [counter, cost]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* {counter} */}
      <textarea
        value={text}
        onChange={handleTextChange}
        onFocus={onFocus
        onBlur={onBlur}
        style={{
          marginRight: '10px',
          padding: '10px',
          height: '40px',
        }}
        placeholder="Start typing here..."
      />
      <img
        src="/assets/dancing-bear.gif"
        alt="Loading animation"
        style={{
          width: '200px',
          height: '200px',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}

export default SlowRenderComponent;
