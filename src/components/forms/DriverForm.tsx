import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../ui/Modal';

interface DriverFormProps {
    editingItem: any;
    kekeAssets: any[];
    onClose: () => void;
    onSave: (formData: any) => void | Promise<void>;
}

const DriverForm: React.FC<DriverFormProps> = ({ editingItem, kekeAssets, onClose, onSave }) => {
    const [formData, setFormData] = useState(editingItem || {
        name: '',
        phone: '',
        kekeId: '',
        licenseExpiry: '',
        kycStatus: 'Pending',
        appUsage: 'Inactive'
    });

    return (
        <Modal>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                    {editingItem ? 'Edit Driver' : 'Add New Driver'}
                </h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Driver Name
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned Keke ID
                    </label>
                    <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.kekeId}
                        onChange={(e) => setFormData({...formData, kekeId: e.target.value})}
                    >
                        <option value="">Select Keke</option>
                        {kekeAssets.map(keke => (
                            <option key={keke.id} value={keke.id}>{keke.id} - {keke.registrationNumber}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        License Expiry Date
                    </label>
                    <input
                        type="date"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.licenseExpiry}
                        onChange={(e) => setFormData({...formData, licenseExpiry: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        KYC Status
                    </label>
                    <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.kycStatus}
                        onChange={(e) => setFormData({...formData, kycStatus: e.target.value})}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Complete">Complete</option>
                        <option value="Rejected">Rejected</option>
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

export default DriverForm;