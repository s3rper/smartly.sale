import React, { useState } from 'react';
import { X, Wallet, AlertCircle } from 'lucide-react';

interface GCashConversionFormProps {
  userPoints: number;
  onClose: () => void;
  darkMode: boolean;
}

export default function GCashConversionForm({ userPoints, onClose, darkMode }: GCashConversionFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gcashNumber, setGcashNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate GCash value (example: 100 points = ₱10)
  const pointsToGCash = (points: number) => {
    return (points / 10).toFixed(2);
  };

  const minimumPoints = 100; // Minimum points required to convert

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userPoints < minimumPoints) {
      setErrorMessage(`You need at least ${minimumPoints} points to convert to GCash.`);
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/gcash-conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          gcashNumber,
          points: userPoints,
          gcashAmount: pointsToGCash(userPoints),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        // Reset form
        setFullName('');
        setEmail('');
        setGcashNumber('');

        // Close modal after 3 seconds
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting GCash conversion:', error);
      setSubmitStatus('error');
      setErrorMessage('Failed to submit request. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = fullName.trim() && email.trim() && gcashNumber.trim() && userPoints >= minimumPoints;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Convert to GCash</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Points Info */}
          <div
            className={`mb-6 p-4 rounded-xl border-2 ${
              darkMode
                ? 'bg-blue-900/30 border-blue-700'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                Your Points
              </span>
              <span className={`text-2xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                {userPoints}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                GCash Value
              </span>
              <span className={`text-2xl font-bold ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                ₱{pointsToGCash(userPoints)}
              </span>
            </div>
            <div className={`mt-3 text-xs ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              Rate: 100 points = ₱10 | Minimum: {minimumPoints} points
            </div>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mb-4 p-4 bg-green-100 border-2 border-green-400 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-green-800">Request Submitted!</div>
                  <div className="text-sm text-green-700 mt-1">
                    Your GCash conversion request has been sent. We'll process it within 24-48 hours.
                  </div>
                </div>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-4 p-4 bg-red-100 border-2 border-red-400 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-red-800">Error</div>
                  <div className="text-sm text-red-700 mt-1">{errorMessage}</div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Juan Dela Cruz"
                required
                className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-blue-500 transition-all ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@example.com"
                required
                className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-blue-500 transition-all ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                GCash Mobile Number *
              </label>
              <input
                type="tel"
                value={gcashNumber}
                onChange={(e) => setGcashNumber(e.target.value)}
                placeholder="09XXXXXXXXX"
                pattern="[0-9]{11}"
                required
                className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-blue-500 transition-all ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                11 digits (e.g., 09171234567)
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              style={{ color: '#ffffff' }}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                !isFormValid || isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Conversion Request'}
            </button>
          </form>

          {/* Info Text */}
          <div className={`mt-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>
              * Processing time: 24-48 hours. You will receive the GCash amount to your registered mobile
              number. Points will be deducted after verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
