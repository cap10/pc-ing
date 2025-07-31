/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { toast } from 'sonner';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';

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
                {editingItem ? 'Edit Driver' : 'Add New Driver'}
            </ModalHeader>
            
            <form onSubmit={handleSubmit}>
                <ModalBody>
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Driver Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="Enter driver name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    placeholder="+234-XXX-XXX-XXXX"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assigned Keke
                            </label>
                            <select
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                value={formData.kekeId}
                                onChange={(e) => setFormData({...formData, kekeId: e.target.value})}
                            >
                                <option value="">Select Keke</option>
                                {kekeAssets.map(keke => (
                                    <option key={keke.id} value={keke.id}>
                                        {keke.id} - {keke.registrationNumber}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    License Expiry Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    value={formData.licenseExpiry}
                                    onChange={(e) => setFormData({...formData, licenseExpiry: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    KYC Status
                                </label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    value={formData.kycStatus}
                                    onChange={(e) => setFormData({...formData, kycStatus: e.target.value})}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Complete">Complete</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                App Usage Status
                            </label>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="appUsage"
                                        value="Active"
                                        checked={formData.appUsage === 'Active'}
                                        onChange={(e) => setFormData({...formData, appUsage: e.target.value})}
                                        className="mr-2 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-sm">Active</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="appUsage"
                                        value="Inactive"
                                        checked={formData.appUsage === 'Inactive'}
                                        onChange={(e) => setFormData({...formData, appUsage: e.target.value})}
                                        className="mr-2 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-sm">Inactive</span>
                                </label>
                            </div>
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
                                editingItem ? 'Update Driver' : 'Create Driver'
                            )}
                        </button>
                    </div>
                </ModalFooter>
            </form>
        </Modal>
    );
};

export default DriverForm;