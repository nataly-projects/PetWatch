import { useState, useEffect, useCallback } from 'react';

const useApiActions = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (func, params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await func(...params);
      setData(response);
      return response; // Return the response to allow further chaining in the component.
    } catch (err) {
      setError(err);
      throw err; // Re-throw the error for error handling in the component.
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
};

export default useApiActions;
