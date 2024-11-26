import { useState } from 'react';

const useApiActions = (func, params, ) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (!func) {
          return;
      }
  
      const useAction = async () => {
          setLoading(true);
          try {
              const response = await func(...params);
              console.log(params, 'use action hook res: ', response);
              setData(response);
          } catch (err) {
              setError(err);
          } finally {
              setLoading(false);
          }
      };
  
      useAction();
    }, [dependencies]);
  
    return { data, loading, error };
};

export default useApiActions;
