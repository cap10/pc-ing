/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { toast } from 'sonner';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';

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
                {editingItem ? 'Edit Keke Asset' : 'Add New Keke Asset'}
            </ModalHeader>
            
            <form onSubmit={handleSubmit}>
                <ModalBody>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Registration Number
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                value={formData.registrationNumber}
                                onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                                placeholder="e.g., ABC-123-XY"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Aggregator
                            </label>
                            <select
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Driver Name
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                value={formData.driver}
                                onChange={(e) => setFormData({...formData, driver: e.target.value})}
                                placeholder="Enter driver name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                placeholder="Enter location"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="Active">Active</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deployment Date
                            </label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                value={formData.deploymentDate}
                                onChange={(e) => setFormData({...formData, deploymentDate: e.target.value})}
                            />
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
                                editingItem ? 'Update Asset' : 'Create Asset'
                            )}
                        </button>
                    </div>
                </ModalFooter>
            </form>
        </Modal>
    );
};

export default KekeForm;