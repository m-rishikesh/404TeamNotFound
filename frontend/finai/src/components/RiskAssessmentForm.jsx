import React, { useState } from 'react';

const RiskAssessmentForm = () => {
  const [formData, setFormData] = useState({
    riskapt: '',
    potentiallosses: '',
    totaltime: '',
    growthtime: '',
    investmentrisk: '',
    selectedCompanies: [],
  });

  const [submitted, setSubmitted] = useState(false);
  const [backendResponse, setBackendResponse] = useState(null);

  const companies = [
    { name: 'Apple', value: 'AAPL' },
    { name: 'Microsoft', value: 'MSFT' },
    { name: 'Tesla', value: 'TSLA' },
    { name: 'Amazon', value: 'AMZN' },
    { name: 'Google', value: 'GOOGL' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCompanySelect = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      selectedCompanies: prev.selectedCompanies.includes(value)
        ? prev.selectedCompanies.filter((c) => c !== value)
        : [...prev.selectedCompanies, value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); // Disable form
    try {
      const res = await fetch('http://localhost:8080/getProduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      setBackendResponse(result.data);
    } catch (err) {
      console.error("Error:", err);
      setBackendResponse({ error: "Something went wrong." });
    }
  };

  // Output view after form is submitted
  if (submitted && backendResponse) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2>Recommended Products</h2>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            maxWidth: "100%",
            padding: "1rem",
            background: "#f4f4f4",
            borderRadius: "8px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(backendResponse, null, 2)}
        </pre>
      </div>
    );
  }

  // Form view
  return (
    <form onSubmit={handleSubmit} className="risk-form" style={{ padding: "1rem" }}>
      <h2>Risk Assessment</h2>

      <label>Risk Appetite</label>
      <input name="riskapt" value={formData.riskapt} onChange={handleChange} required />

      <label>Potential Losses You're Willing to Take</label>
      <input name="potentiallosses" value={formData.potentiallosses} onChange={handleChange} required />

      <label>Total Time You Can Spend Researching</label>
      <input name="totaltime" value={formData.totaltime} onChange={handleChange} required />

      <label>Time You’re Willing to Let Your Money Grow</label>
      <input name="growthtime" value={formData.growthtime} onChange={handleChange} required />

      <label>Preferred Investment Risk Level</label>
      <input name="investmentrisk" value={formData.investmentrisk} onChange={handleChange} required />

      <label>Select Companies You’re Interested In</label>
      <div style={{ marginBottom: "1rem" }}>
        {companies.map((company) => (
          <label key={company.value} style={{ display: "block" }}>
            <input
              type="checkbox"
              value={company.value}
              checked={formData.selectedCompanies.includes(company.value)}
              onChange={handleCompanySelect}
              disabled={submitted}
            />
            {company.name}
          </label>
        ))}
      </div>

      <button type="submit" disabled={submitted}>Submit</button>
    </form>
  );
};

export default RiskAssessmentForm;
