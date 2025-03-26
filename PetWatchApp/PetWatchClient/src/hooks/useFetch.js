import { useState, useEffect } from 'react';

const useFetch = (fetchFunction, params, dependencies = []) => {
    console.log('in useFetch');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!fetchFunction) return;
    setLoading(true);
    try {
      const response = await fetchFunction(...params);
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, Array.isArray(dependencies) ? dependencies : []); 

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
