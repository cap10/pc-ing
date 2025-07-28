'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, AlertCircle, CheckCircle } from 'lucide-react';

const JournalEntryUI = () => {
    const [accounts, setAccounts] = useState([]);
    const [currencies] = useState([
        { id: '840', symbol: 'USD', name: 'US Dollars' },
        { id: '924', symbol: 'ZWG', name: 'Zim Gold' }
    ]);

    const [journalEntry, setJournalEntry] = useState({
        date: new Date().toISOString().split('T')[0],
        description: '',
        reference: '',
        currency: '840', // Default to USD
        lines: [
            { id: 1, accountCode: '', accountName: '', debit: '', credit: '', description: '' },
            { id: 2, accountCode: '', accountName: '', debit: '', credit: '', description: '' }
        ]
    });

    // Parse chart of accounts from the provided XML structure
    useEffect(() => {
        const chartAccounts = [
            // Assets
            { code: '1100', name: 'System Bank Account USD', type: 'debit', category: 'Assets' },
            { code: '1101', name: 'System Bank Account ZWG', type: 'debit', category: 'Assets' },
            { code: '1200', name: 'Bank Settlement Receivable USD', type: 'debit', category: 'Assets' },
            { code: '1201', name: 'Bank Settlement Receivable ZWG', type: 'debit', category: 'Assets' },
            { code: '1210', name: 'Payment Processor Receivable USD', type: 'debit', category: 'Assets' },
            { code: '1211', name: 'Payment Processor Receivable ZWG', type: 'debit', category: 'Assets' },
            { code: '1220', name: 'PTSP Receivable USD', type: 'debit', category: 'Assets' },
            { code: '1221', name: 'PTSP Receivable ZWG', type: 'debit', category: 'Assets' },
            { code: '1400', name: 'Biller Prefunded USD', type: 'debit', category: 'Assets' },
            { code: '1401', name: 'Biller Prefunded ZWG', type: 'debit', category: 'Assets' },
            { code: '1410', name: 'Processor Prefunded USD', type: 'debit', category: 'Assets' },
            { code: '1411', name: 'Processor Prefunded ZWG', type: 'debit', category: 'Assets' },

            // Liabilities
            { code: '2100', name: 'Agent Liability USD', type: 'credit', category: 'Liabilities' },
            { code: '2101', name: 'Agent Liability ZWG', type: 'credit', category: 'Liabilities' },
            { code: '2120', name: 'Customer Liability USD', type: 'credit', category: 'Liabilities' },
            { code: '2121', name: 'Customer Liability ZWG', type: 'credit', category: 'Liabilities' },
            { code: '2130', name: 'POS Liability USD', type: 'credit', category: 'Liabilities' },
            { code: '2131', name: 'POS Liability ZWG', type: 'credit', category: 'Liabilities' },
            { code: '2140', name: 'Business Liability USD', type: 'credit', category: 'Liabilities' },
            { code: '2141', name: 'Business Liability ZWG', type: 'credit', category: 'Liabilities' },
            { code: '2300', name: 'Commission Payable USD', type: 'credit', category: 'Liabilities' },
            { code: '2301', name: 'Commission Payable ZWG', type: 'credit', category: 'Liabilities' },
            { code: '2310', name: 'Rewards Liability USD', type: 'credit', category: 'Liabilities' },
            { code: '2311', name: 'Rewards Liability ZWG', type: 'credit', category: 'Liabilities' },
            { code: '2600', name: 'Lien Liability USD', type: 'credit', category: 'Liabilities' },
            { code: '2601', name: 'Lien Liability ZWG', type: 'credit', category: 'Liabilities' },
            { code: '2610', name: 'Lock Liability USD', type: 'credit', category: 'Liabilities' },
            { code: '2611', name: 'Lock Liability ZWG', type: 'credit', category: 'Liabilities' },
            { code: '2700', name: 'IMT Tax Payable USD', type: 'credit', category: 'Liabilities' },
            { code: '2701', name: 'IMT Tax Payable ZWG', type: 'credit', category: 'Liabilities' },
            { code: '2800', name: 'Biller Overdraft USD', type: 'credit', category: 'Liabilities' },
            { code: '2801', name: 'Biller Overdraft ZWG', type: 'credit', category: 'Liabilities' },
            { code: '2810', name: 'Biller Payable USD', type: 'credit', category: 'Liabilities' },
            { code: '2811', name: 'Biller Payable ZWG', type: 'credit', category: 'Liabilities' },

            // Equity
            { code: '3100', name: 'Capital USD', type: 'credit', category: 'Equity' },
            { code: '3101', name: 'Capital ZWG', type: 'credit', category: 'Equity' },
            { code: '3110', name: 'General Reserve USD', type: 'credit', category: 'Equity' },
            { code: '3111', name: 'General Reserve ZWG', type: 'credit', category: 'Equity' },
            { code: '3120', name: 'Net Income USD', type: 'credit', category: 'Equity' },
            { code: '3121', name: 'Net Income ZWG', type: 'credit', category: 'Equity' },

            // Income
            { code: '4100', name: 'Fee Income USD', type: 'credit', category: 'Income' },
            { code: '4101', name: 'Fee Income ZWG', type: 'credit', category: 'Income' },
            { code: '4110', name: 'Biller Commission Income USD', type: 'credit', category: 'Income' },
            { code: '4111', name: 'Biller Commission Income ZWG', type: 'credit', category: 'Income' },
            { code: '4120', name: 'Biller Discount Income USD', type: 'credit', category: 'Income' },
            { code: '4121', name: 'Biller Discount Income ZWG', type: 'credit', category: 'Income' },
            { code: '4300', name: 'Payment Processor Revenue USD', type: 'credit', category: 'Income' },
            { code: '4301', name: 'Payment Processor Revenue ZWG', type: 'credit', category: 'Income' },
            { code: '4310', name: 'PTSP Revenue USD', type: 'credit', category: 'Income' },
            { code: '4311', name: 'PTSP Revenue ZWG', type: 'credit', category: 'Income' },

            // Expenses
            { code: '5100', name: 'Discount Expense USD', type: 'debit', category: 'Expenses' },
            { code: '5101', name: 'Discount Expense ZWG', type: 'debit', category: 'Expenses' },
            { code: '5200', name: 'Payment Processor Fee Expense USD', type: 'debit', category: 'Expenses' },
            { code: '5201', name: 'Payment Processor Fee Expense ZWG', type: 'debit', category: 'Expenses' },
            { code: '5210', name: 'Payment Processor VAT Expense USD', type: 'debit', category: 'Expenses' },
            { code: '5211', name: 'Payment Processor VAT Expense ZWG', type: 'debit', category: 'Expenses' }
        ];

        setAccounts(chartAccounts);
    }, []);

    const addLine = () => {
        const newLine = {
            id: Date.now(),
            accountCode: '',
            accountName: '',
            debit: '',
            credit: '',
            description: ''
        };
        setJournalEntry(prev => ({
            ...prev,
            lines: [...prev.lines, newLine]
        }));
    };

    const removeLine = (id) => {
        if (journalEntry.lines.length > 2) {
            setJournalEntry(prev => ({
                ...prev,
                lines: prev.lines.filter(line => line.id !== id)
            }));
        }
    };

    const updateLine = (id, field, value) => {
        setJournalEntry(prev => ({
            ...prev,
            lines: prev.lines.map(line => {
                if (line.id === id) {
                    const updatedLine = { ...line, [field]: value };

                    // Auto-populate account name when code is selected
                    if (field === 'accountCode') {
                        const account = accounts.find(acc => acc.code === value);
                        updatedLine.accountName = account ? account.name : '';
                    }

                    // Clear opposite field when entering debit/credit
                    if (field === 'debit' && value) {
                        updatedLine.credit = '';
                    } else if (field === 'credit' && value) {
                        updatedLine.debit = '';
                    }

                    return updatedLine;
                }
                return line;
            })
        }));
    };

    const updateJournalEntry = (field, value) => {
        setJournalEntry(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const calculateTotals = () => {
        const totalDebits = journalEntry.lines.reduce((sum, line) => {
            return sum + (parseFloat(line.debit) || 0);
        }, 0);

        const totalCredits = journalEntry.lines.reduce((sum, line) => {
            return sum + (parseFloat(line.credit) || 0);
        }, 0);

        return { totalDebits, totalCredits };
    };

    const { totalDebits, totalCredits } = calculateTotals();
    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;
    const hasValidLines = journalEntry.lines.some(line =>
        line.accountCode && (line.debit || line.credit)
    );

    const handlePost = () => {
        if (!isBalanced) {
            alert('Journal entry must be balanced (debits = credits)');
            return;
        }

        if (!hasValidLines) {
            alert('Please add at least one valid journal line');
            return;
        }

        if (!journalEntry.description.trim()) {
            alert('Please enter a description for the journal entry');
            return;
        }

        // Here you would typically send the data to your backend
        console.log('Posting journal entry:', journalEntry);
        alert('Journal entry posted successfully!');

        // Reset form
        setJournalEntry({
            date: new Date().toISOString().split('T')[0],
            description: '',
            reference: '',
            currency: '840',
            lines: [
                { id: Date.now(), accountCode: '', accountName: '', debit: '', credit: '', description: '' },
                { id: Date.now() + 1, accountCode: '', accountName: '', debit: '', credit: '', description: '' }
            ]
        });
    };

    const selectedCurrency = currencies.find(c => c.id === journalEntry.currency);

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Journal Entry</h1>
                <p className="text-gray-600">Post journal entries to the Financial Services ledger</p>
            </div>

            {/* Header Information */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            value={journalEntry.date}
                            onChange={(e) => updateJournalEntry('date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                        <select
                            value={journalEntry.currency}
                            onChange={(e) => updateJournalEntry('currency', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {currencies.map(currency => (
                                <option key={currency.id} value={currency.id}>
                                    {currency.symbol} - {currency.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                        <input
                            type="text"
                            value={journalEntry.reference}
                            onChange={(e) => updateJournalEntry('reference', e.target.value)}
                            placeholder="Optional reference number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <input
                        type="text"
                        value={journalEntry.description}
                        onChange={(e) => updateJournalEntry('description', e.target.value)}
                        placeholder="Enter journal entry description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
            </div>

            {/* Journal Lines */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Journal Lines</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Debit ({selectedCurrency.symbol})
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Credit ({selectedCurrency.symbol})
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {journalEntry.lines.map((line, index) => (
                            <tr key={line.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-3">
                                    <select
                                        value={line.accountCode}
                                        onChange={(e) => updateLine(line.id, 'accountCode', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Account</option>
                                        {accounts.map(account => (
                                            <option key={account.code} value={account.code}>
                                                {account.code} - {account.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                <td className="px-4 py-3">
                                    <input
                                        type="text"
                                        value={line.description}
                                        onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                                        placeholder="Line description"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>

                                <td className="px-4 py-3">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={line.debit}
                                        onChange={(e) => updateLine(line.id, 'debit', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 text-sm text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>

                                <td className="px-4 py-3">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={line.credit}
                                        onChange={(e) => updateLine(line.id, 'credit', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 text-sm text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>

                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => removeLine(line.id)}
                                        disabled={journalEntry.lines.length <= 2}
                                        className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <button
                        onClick={addLine}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        <Plus size={16} className="mr-1" />
                        Add Line
                    </button>
                </div>
            </div>

            {/* Totals and Validation */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-8">
                        <div>
                            <span className="text-sm font-medium text-gray-600">Total Debits:</span>
                            <span className="ml-2 text-lg font-bold text-gray-900">
                {selectedCurrency.symbol} {totalDebits.toFixed(2)}
              </span>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-600">Total Credits:</span>
                            <span className="ml-2 text-lg font-bold text-gray-900">
                {selectedCurrency.symbol} {totalCredits.toFixed(2)}
              </span>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-600">Difference:</span>
                            <span className={`ml-2 text-lg font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                {selectedCurrency.symbol} {Math.abs(totalDebits - totalCredits).toFixed(2)}
              </span>
                        </div>
                    </div>

                    <div className="flex items-center">
                        {isBalanced ? (
                            <div className="flex items-center text-green-600">
                                <CheckCircle size={20} className="mr-2" />
                                <span className="font-medium">Balanced</span>
                            </div>
                        ) : (
                            <div className="flex items-center text-red-600">
                                <AlertCircle size={20} className="mr-2" />
                                <span className="font-medium">Out of Balance</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
                <button
                    onClick={handlePost}
                    disabled={!isBalanced || !hasValidLines || !journalEntry.description.trim()}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Save size={20} className="mr-2" />
                    Post Journal Entry
                </button>
            </div>
        </div>
    );
};

export default JournalEntryUI;
