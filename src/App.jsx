import React, { useState, useMemo } from 'react';
import fundsData from './data/funds.json';
import { rankFunds } from './utils/scoring';
import Header from './components/Header';
import StepFundSelection from './components/StepFundSelection';
import StepRiskSelector from './components/StepRiskSelector';
import StepResults from './components/StepResults';
import Footer from './components/Footer';

/**
 * INVESTIQ Main Application Component
 */
export default function App() {
  // Pre-select 3 Large Cap funds by default so the user immediately sees interactive data
  const [selectedFundIds, setSelectedFundIds] = useState([
    'fund-lc-1',
    'fund-lc-2',
    'fund-lc-3',
  ]);
  const [riskPreference, setRiskPreference] = useState('Moderate');
  const [currentStep, setCurrentStep] = useState(1);

  // Derive full fund objects from IDs
  const selectedFunds = useMemo(() => {
    return fundsData.filter((f) => selectedFundIds.includes(f.id));
  }, [selectedFundIds]);

  // Compute normalized scores and rankings whenever selected funds or risk preference changes
  const scoredFunds = useMemo(() => {
    return rankFunds(selectedFunds, riskPreference);
  }, [selectedFunds, riskPreference]);

  return (
    <div className="app-layout">
      <Header
        currentStep={currentStep}
        setStep={setCurrentStep}
        selectedCount={selectedFundIds.length}
      />

      <main className="main-content">
        {currentStep === 1 && (
          <StepFundSelection
            allFunds={fundsData}
            selectedFundIds={selectedFundIds}
            setSelectedFundIds={setSelectedFundIds}
            onProceed={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <StepRiskSelector
            riskPreference={riskPreference}
            setRiskPreference={setRiskPreference}
            selectedFunds={selectedFunds}
            onBack={() => setCurrentStep(1)}
            onProceed={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <StepResults
            scoredFunds={scoredFunds}
            riskPreference={riskPreference}
            setRiskPreference={setRiskPreference}
            onBackToFunds={() => setCurrentStep(1)}
            onBackToRisk={() => setCurrentStep(2)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
