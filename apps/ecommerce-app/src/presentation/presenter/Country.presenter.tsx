import { useState, useEffect } from "react";
import { useCountryStore } from "../../stores/useCountryStore";

export const useCountryPresenter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    countries,
    loading: storeLoading,
    error: storeError,
    fetchAmericanCountries,
    isValidAmericanCountry,
  } = useCountryStore();

  useEffect(() => {
    setLoading(storeLoading);
    if (storeError) {
      setError(storeError);
    }
  }, [storeLoading, storeError]);

  useEffect(() => {
    if (countries.length === 0 && !loading) {
      fetchAmericanCountries();
    }
  }, [countries.length, loading, fetchAmericanCountries]);

  return {
    countries,
    loading,
    error,
    fetchAmericanCountries,
    isValidAmericanCountry,
  };
};
