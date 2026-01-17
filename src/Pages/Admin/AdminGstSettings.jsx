import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import theme from '../../lib/theme';
import { getGstPercentage, updateGstPercentage, getGstHistory } from '../../apiCalls/tax';

function AdminGstSettings() {
  const [gstPercentage, setGstPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchGstData();
  }, []);

  const fetchGstData = async () => {
    try {
      setLoading(true);
      const response = await getGstPercentage();
      if (response.success) {
        setGstPercentage(response.percentage || 0);
      }
    } catch (error) {
      console.error('Error fetching GST:', error);
      toast.error('Failed to fetch GST percentage');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGst = async (e) => {
    e.preventDefault();
    
    const newPercentage = parseFloat(gstPercentage);
    
    // Validate
    if (isNaN(newPercentage) || newPercentage < 0 || newPercentage > 100) {
      toast.error('GST percentage must be a number between 0 and 100');
      return;
    }

    try {
      setSaving(true);
      const response = await updateGstPercentage(newPercentage);
      
      if (response.success) {
        toast.success(`GST updated successfully from ${response.oldPercentage}% to ${response.percentage}%`);
        await fetchGstData();
        if (showHistory) {
          await fetchHistory();
        }
      } else {
        toast.error(response.message || 'Failed to update GST');
      }
    } catch (error) {
      console.error('Error updating GST:', error);
      toast.error(error.response?.data?.message || 'Failed to update GST percentage');
    } finally {
      setSaving(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await getGstHistory(20);
      if (response.success) {
        setHistory(response.history || []);
      }
    } catch (error) {
      console.error('Error fetching GST history:', error);
    }
  };

  const toggleHistory = async () => {
    if (!showHistory) {
      await fetchHistory();
    }
    setShowHistory(!showHistory);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.colors.background.main }}
      >
        <p style={{ color: theme.colors.text.primary }}>Loading GST settings...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: theme.colors.background.main }}
    >
      <div className="container mx-auto max-w-4xl">
        <h1
          className="text-3xl font-bold mb-8"
          style={{ color: theme.colors.text.primary }}
        >
          GST Settings
        </h1>

        {/* Current GST Display */}
        <div
          className="p-6 rounded-lg border mb-6"
          style={{
            backgroundColor: theme.colors.background.main,
            borderColor: theme.colors.border.light,
          }}
        >
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: theme.colors.text.primary }}
          >
            Current GST Rate
          </h2>
          <div className="flex items-center gap-4">
            <div
              className="text-4xl font-bold"
              style={{ color: theme.colors.accent.primary }}
            >
              {gstPercentage}%
            </div>
            {gstPercentage === 0 && (
              <div
                className="px-3 py-1 rounded text-sm"
                style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
              >
                ⚠️ No GST configured
              </div>
            )}
          </div>
          <p className="mt-2 text-sm" style={{ color: theme.colors.text.secondary }}>
            This GST rate will be applied to all new orders. Changes only affect future orders, not existing ones.
          </p>
        </div>

        {/* Update GST Form */}
        <div
          className="p-6 rounded-lg border mb-6"
          style={{
            backgroundColor: theme.colors.background.main,
            borderColor: theme.colors.border.light,
          }}
        >
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: theme.colors.text.primary }}
          >
            Update GST Percentage
          </h2>
          <form onSubmit={handleUpdateGst}>
            <div className="mb-4">
              <label
                htmlFor="gstPercentage"
                className="block mb-2 font-semibold"
                style={{ color: theme.colors.text.primary }}
              >
                GST Percentage (0-100)
              </label>
              <input
                type="number"
                id="gstPercentage"
                min="0"
                max="100"
                step="0.01"
                value={gstPercentage}
                onChange={(e) => setGstPercentage(e.target.value)}
                className="w-full px-4 py-2 rounded-md border"
                style={{
                  backgroundColor: theme.colors.background.main,
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
                placeholder="Enter GST percentage (e.g., 18)"
                required
              />
              <p className="mt-1 text-sm" style={{ color: theme.colors.text.secondary }}>
                Enter a value between 0 and 100. Example: 18 for 18% GST
              </p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-md font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme.colors.accent.primary,
                color: theme.colors.background.main,
              }}
            >
              {saving ? 'Saving...' : 'Update GST'}
            </button>
          </form>
        </div>

        {/* History Toggle */}
        <div className="mb-4">
          <button
            onClick={toggleHistory}
            className="px-4 py-2 rounded-md font-semibold border hover:opacity-90 transition-opacity"
            style={{
              borderColor: theme.colors.border.light,
              color: theme.colors.text.primary,
            }}
          >
            {showHistory ? 'Hide' : 'Show'} Change History
          </button>
        </div>

        {/* History Display */}
        {showHistory && (
          <div
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: theme.colors.background.main,
              borderColor: theme.colors.border.light,
            }}
          >
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: theme.colors.text.primary }}
            >
              GST Change History
            </h2>
            {history.length === 0 ? (
              <p style={{ color: theme.colors.text.secondary }}>No change history available</p>
            ) : (
              <div className="space-y-3">
                {history.map((entry, index) => (
                  <div
                    key={index}
                    className="p-4 rounded border"
                    style={{
                      backgroundColor: theme.colors.background.main,
                      borderColor: theme.colors.border.light,
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold" style={{ color: theme.colors.text.primary }}>
                          {entry.oldPercentage}% → {entry.newPercentage}%
                        </p>
                        <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                          Changed by: {entry.changedBy}
                        </p>
                      </div>
                      <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                        {new Date(entry.changedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminGstSettings;

