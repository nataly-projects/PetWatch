import { useState, useEffect } from 'react';

const useFetch = (fetchFunction, params, dependencies = []) => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fetchFunction) {
        return;
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetchFunction(...params);
            console.log(params, ' use fetch hook res: ', response);
            setData(response);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [dependencies]);

  return { data, loading, error };
};

export default useFetch;

