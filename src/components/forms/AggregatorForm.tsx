/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { toast } from 'sonner';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';

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

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Form submission failed:', error);
            toast.error('Form submission failed', {
                description: 'Please check your input and try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalHeader onClose={onClose}>
                {editingItem ? 'Edit Aggregator' : 'Add New Aggregator'}
            </ModalHeader>
            
            <form onSubmit={handleSubmit}>
                <ModalBody>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Aggregator Name
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Enter aggregator name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Keke Assets Assigned
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                value={formData.kekesAssigned}
                                onChange={(e) => setFormData({...formData, kekesAssigned: parseInt(e.target.value) || 0})}
                                placeholder="0"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Number of Keke assets managed by this aggregator
                            </p>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all font-medium"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            style={{ backgroundColor: 'rgb(11, 79, 38)' }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    Processing...
                                </>
                            ) : (
                                editingItem ? 'Update Aggregator' : 'Create Aggregator'
                            )}
                        </button>
                    </div>
                </ModalFooter>
            </form>
        </Modal>
    );
};

export default AggregatorForm;