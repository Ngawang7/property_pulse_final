'use client';

import { useState } from 'react';
import { FaHome, FaMoneyBillWave, FaPercent, FaCalendarAlt, FaCalculator } from 'react-icons/fa';

const MortgageCalculator = () => {
  const [formData, setFormData] = useState({
    homePrice: '',
    downPayment: '',
    interestRate: '',
    loanTerm: '30',
  });

  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateMortgage = (e) => {
    e.preventDefault();
    setIsCalculating(true);

    // Simulate calculation delay for better UX
    setTimeout(() => {
      // Convert inputs to numbers
      const principal = parseFloat(formData.homePrice) - parseFloat(formData.downPayment);
      const rate = parseFloat(formData.interestRate) / 100 / 12; // Monthly interest rate
      const term = parseFloat(formData.loanTerm) * 12; // Total number of payments

      // Calculate monthly payment
      const monthlyPayment = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
      const totalPayment = monthlyPayment * term;
      const totalInterest = totalPayment - principal;

      setMonthlyPayment(monthlyPayment.toFixed(2));
      setTotalPayment(totalPayment.toFixed(2));
      setTotalInterest(totalInterest.toFixed(2));
      setIsCalculating(false);
    }, 800);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">Mortgage Calculator</h1>
            <p className="text-gray-600 text-lg">
              Calculate your monthly mortgage payments and total costs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
              <form onSubmit={calculateMortgage} className="space-y-6">
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    <FaHome className="inline-block mr-2 text-blue-500" />
                    Home Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Nu.</span>
                    <input
                      type="number"
                      name="homePrice"
                      value={formData.homePrice}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      placeholder="Enter home price"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    <FaMoneyBillWave className="inline-block mr-2 text-blue-500" />
                    Down Payment
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Nu.</span>
                    <input
                      type="number"
                      name="downPayment"
                      value={formData.downPayment}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      placeholder="Enter down payment"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    <FaPercent className="inline-block mr-2 text-blue-500" />
                    Interest Rate
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="interestRate"
                      value={formData.interestRate}
                      onChange={handleChange}
                      required
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      placeholder="Enter interest rate"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    <FaCalendarAlt className="inline-block mr-2 text-blue-500" />
                    Loan Term
                  </label>
                  <select
                    name="loanTerm"
                    value={formData.loanTerm}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  >
                    <option value="15">15 years</option>
                    <option value="20">20 years</option>
                    <option value="30">30 years</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isCalculating}
                  className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 ${
                    isCalculating ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  <FaCalculator className="text-lg" />
                  <span>{isCalculating ? 'Calculating...' : 'Calculate'}</span>
                </button>
              </form>
            </div>

            {/* Results */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
              <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Results</h2>
              
              {monthlyPayment ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-600">Monthly Payment</h3>
                      <p className="text-3xl font-bold text-blue-600 mt-2">Nu. {monthlyPayment}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="text-sm font-semibold text-gray-600">Total Payment</h4>
                      <p className="text-xl font-bold text-blue-600 mt-1">Nu. {totalPayment}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="text-sm font-semibold text-gray-600">Total Interest</h4>
                      <p className="text-xl font-bold text-blue-600 mt-1">Nu. {totalInterest}</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Loan Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Amount:</span>
                        <span className="font-semibold">Nu. {(parseFloat(formData.homePrice) - parseFloat(formData.downPayment)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Down Payment:</span>
                        <span className="font-semibold">Nu. {formData.downPayment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest Rate:</span>
                        <span className="font-semibold">{formData.interestRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Term:</span>
                        <span className="font-semibold">{formData.loanTerm} years</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaCalculator className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Enter your details to calculate your mortgage</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MortgageCalculator; 