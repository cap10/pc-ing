import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../ui/Modal';

interface KekeFormProps {
    editingItem: any;
    aggregators: any[];
    onClose: () => void;
    onSave: (formData: any) => void | Promise<void>;
}

const KekeForm: React.FC<KekeFormProps> = ({ editingItem, aggregators, onClose, onSave }) => {
    const [formData, setFormData] = useState(editingItem || {
        registrationNumber: '',
        aggregator: '',
        driver: '',
        location: '',
        status: 'Active',
        deploymentDate: new Date().toISOString().split('T')[0]
    });

    return (
        <Modal>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                    {editingItem ? 'Edit Keke Asset' : 'Add New Keke Asset'}
                </h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Number
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aggregator
                    </label>
                    <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.aggregator}
                        onChange={(e) => setFormData({...formData, aggregator: e.target.value})}
                    >
                        <option value="">Select Aggregator</option>
                        {aggregators.map(agg => (
                            <option key={agg.id} value={agg.name}>{agg.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Driver Name
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.driver}
                        onChange={(e) => setFormData({...formData, driver: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                        <option value="Active">Active</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    onClick={async () => {
                        try {
                            await onSave(formData);
                        } catch (error) {
                            console.error('Form submission failed:', error);
                            toast.error('Form submission failed', {
                                description: 'Please check your input and try again.'
                            });
                        }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    {editingItem ? 'Update' : 'Create'}
                </button>
            </div>
        </Modal>
    );
};

export default KekeForm;