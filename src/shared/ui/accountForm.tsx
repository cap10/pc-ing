import { closeModal } from "../utilities/commons";


export default function AccountForm({myFunc}) {

    return (
        <div className="relative z-50 hidden modal" id="modal-addAcc" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                <div className="p-4 mx-auto animate-translate sm:max-w-xl">
                    <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl">
                        <form action={myFunc}>
                            <div className="bg-white">
                                <div className="flex items-center p-4 border-b rounded-t border-gray-50">
                                    <h3 className="text-xl font-semibold text-gray-900 ">
                                        Add Account Detail
                                    </h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input30">Account Type</label>
                                        <select name="typ" className="w-full disabled:text-gray-600 border rounded border-gray-100 p-2" id="input30" required>
                                            <option value="" defaultValue={""}>select...</option>
                                            <option value="CURRENT">Current</option>
                                            <option value="DEPOSIT">Deposit</option>
                                            <option value="SAVINGS">Savings</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input10">Account Name</label>
                                        <input name="name" className="w-full placeholder:text-xs border rounded border-gray-100 p-2" type="text" id="input10" placeholder="name" required/>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input20">Account Number</label>
                                        <input name="number" className="w-full placeholder:text-xs border rounded border-gray-100 p-2" type="text" id="input20" placeholder="number" required/>
                                    </div>
                                </div>
                                <div className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50">
                                    <button onClick={() => closeModal('modal-addAcc')} type="button" className="inline-flex justify-center w-auto px-3 py-1 text-base font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm btn hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 sm:mt-0 sm:text-sm " data-tw-dismiss="modal">
                                        <i className="fa-regular fa-xmark-circle mr-2 mt-1"></i>
                                        Cancel
                                    </button>
                                    <button type="submit" className="inline-flex justify-center w-auto px-3 py-1 text-base font-medium text-white bg-color-secondary border border-transparent rounded-md shadow-sm btn focus:outline-none focus:ring-2 sm:text-sm">
                                        Add
                                        <i className="fa-regular fa-check-circle ml-2 mt-1"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}