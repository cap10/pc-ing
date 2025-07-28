import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../ui/Modal';

interface AggregatorFormProps {
    editingItem: any;
    onClose: () => void;
    onSave: (formData: any) => void | Promise<void>;
}

const AggregatorForm: React.FC<AggregatorFormProps> = ({ editingItem, onClose, onSave }) => {
    const [formData, setFormData] = useState(editingItem || {
        name: '',
        kekesAssigned: 0
    });

    return (
        <Modal>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                    {editingItem ? 'Edit Aggregator' : 'Add New Aggregator'}
                </h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aggregator Name
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
                        Keke Assets Assigned
                    </label>
                    <input
                        type="number"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.kekesAssigned}
                        onChange={(e) => setFormData({...formData, kekesAssigned: parseInt(e.target.value) || 0})}
                    />
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

export default AggregatorForm;