import { useEffect } from 'react';

function WebviewToggle() {
  // const [loading, setLoading] = useState(false);
  // const [isError, setError] = useState('');

  useEffect(() => {
    const handleShowWebViews = async () => {
      await window.electron.ipcRenderer.invoke('show-webviews', 100000000);
    };
    handleShowWebViews();
  }, []);
  // const handleShowWebViews = async () => {
  //   try {
  //     console.log('invoking.....');
  //     setLoading(true);
  //     const result = await window.electron.ipcRenderer.invoke(
  //       'show-webviews',
  //       200000000000,
  //     );

  //     console.log('RESULT:', result);
  //     if (result.includes('already created')) {
  //       setError('WebViews have already been created.');
  //     }
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error showing webviews:', error);
  //     setError('Error showing webviews.');
  //     setLoading(false);
  //   }
  // };

  return (
    <div>
      {/* <button
        type="button"
        onClick={handleShowWebViews}
        style={{
          marginRight: '10px',
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          height: '50px',
          border: 'none',
          borderRadius: '4px',
        }}
      > */}
      {/* {loading ? 'Loading WebViews...' : 'Show WebViews'}
      </button>
      {isError && <p>{isError}</p>} */}
    </div>
  );
}

export default WebviewToggle;
