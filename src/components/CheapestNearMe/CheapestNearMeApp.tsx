import React, { useState, useEffect } from 'react';
import PriceSearch from './PriceSearch';
import PriceReportForm from './PriceReportForm';

export default function CheapestNearMeApp() {
  const [showReportForm, setShowReportForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cheapest-near-me-dark-mode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cheapest-near-me-dark-mode', JSON.stringify(darkMode));
    }
  }, [darkMode]);

  return (
    <>
      <PriceSearch
        key={refreshKey}
        onReportClick={() => setShowReportForm(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
      {showReportForm && (
        <PriceReportForm
          onClose={() => setShowReportForm(false)}
          onSuccess={() => {
            setShowReportForm(false);
            setRefreshKey((prev) => prev + 1);
          }}
          darkMode={darkMode}
        />
      )}
    </>
  );
}
