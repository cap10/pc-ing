import { getUserClerks } from "@/shared/repositories/main-repository";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Users',
};

export default async function Users() {
    const users = await getUserClerks();
    console.log(users.content);
    
    return (
        <main>
            <div className="md:flex items-center justify-between px-[2px] mb-5">
                <h4 className="text-[18px] font-medium text-gray-800 mb-sm-0 grow mb-2 md:mb-0">Users</h4>
                <button type="button" className="p-1 text-white bg-color-secondary rounded-md">
                    <i className="fa-regular fa-plus mr-2"></i>
                    New User
                </button>
            </div>
            <hr />
            <section className="mt-5 pt-4">
                <h4 className="font-bold">Registered Users</h4>
                <div className="mt-5">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-sm text-gray-700 bg-gray-200">
                            <tr className="">
                                <th scope="col" className="px-6 py-3">
                                    Username
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Phone
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    National ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.content.map((u) => (
                                <tr className="bg-white border border-gray-200" key={u.id}>
                                    <th scope="row" className="px-6 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                                        {u.username}
                                    </th>
                                    <td className="px-6 py-3.5">
                                        {u.name}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        {u.email}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        {u.phoneNumber}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        {u.nationalId}    
                                    </td>
                                    <td className="px-6 py-3.5">
                                        {u.group?.name}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        {u.enabled ? 'enabled' : 'disabled'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

        </main>
    );
}