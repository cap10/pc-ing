/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { getUserRoles } from "../repositories/main-repository";
import { createUser } from "../utilities/utils";

export default async function UserForm() {

    const groups = await getUserRoles();
    // console.log(groups);

    return (
        <div className="relative z-50 hidden modal" id="modal-userform" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                <div className="p-4 mx-auto animate-translate sm:max-w-xl">
                    <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl">
                        <form action={createUser}>
                            <div className="bg-white">
                                <div className="flex items-center p-4 border-b rounded-t border-gray-50">
                                    <h3 className="text-xl font-semibold text-gray-900 ">
                                        Add User
                                    </h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input1">Username</label>
                                        <input name="username" className="w-full placeholder:text-xs border rounded border-gray-100 p-2" type="text" id="input1" placeholder="username" required/>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input2">Full Name</label>
                                        <input name="name" className="w-full placeholder:text-xs border rounded border-gray-100 p-2" type="text" id="input2" placeholder="fullname" required/>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input3">National ID</label>
                                        <input name="national" className="w-full placeholder:text-xs border rounded border-gray-100 p-2" type="text" id="input3" placeholder="national id" required/>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input4">Phone Number</label>
                                        <input name="phone" className="w-full placeholder:text-xs border rounded border-gray-100 p-2" type="text" id="input4" placeholder="0700xxxxx" required/>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input5">Email</label>
                                        <input name="email" className="w-full placeholder:text-xs border rounded border-gray-100 p-2" type="email" id="input5" placeholder="email" required/>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-600" htmlFor="input6">Role</label>
                                        <select name="role" className="w-full disabled:text-gray-600 border rounded border-gray-100 p-2" id="input6" required>
                                            <option value="" defaultValue={""}>select...</option>
                                            {groups?.map((g: any) => (
                                                <option value={g.id} key={g.id}>{g.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="inline-block text-center gap-3 p-3 w-full space-x-2 border-t rounded-b border-gray-50">
                                    <button type="button" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm btn hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 sm:mt-0 sm:w-auto sm:text-sm " data-tw-dismiss="modal">
                                        <i className="fa-regular fa-xmark-circle mr-2 mt-1"></i>
                                        Cancel
                                    </button>
                                    <button type="submit" className="inline-flex justify-center w-full px-3 py-1 text-base font-medium text-white bg-color-secondary border border-transparent rounded-md shadow-sm btn focus:outline-none focus:ring-2 sm:w-auto sm:text-sm">
                                        Submit
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