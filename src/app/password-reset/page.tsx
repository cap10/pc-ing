import Image from "next/image"; 
import Link from "next/link";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <section className="group">
        <div className="container-fluid">
            <div className="h-screen md:overflow-hidden">
                <div className="relative z-50 col-span-12">
                    <div className="w-full bg-white md:p-12 place-content-center">
                        <div className="flex h-[100vh] flex-col w-80 lg:w-96 m-auto">
                            <div className="mx-auto">
                                <a href="#" className="">
                                    <Image width={828} height={315} src="/images/logo.png" alt="" className="" /> <span className="text-xl font-medium align-middle ltr:ml-1.5 rtl:mr-1.5 dark:text-white">Minia</span>
                                </a>
                            </div>

                            <div className="mb-3">
                                <div className="text-center">
                                    <h5 className="font-medium text-gray-700">Password Reset</h5>
                                    <p className="mt-2 mb-4 text-gray-500">Enter username to continue.</p>
                                </div>

                                <form className="pt-2" action="#">
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-700">Username</label>
                                        <input type="text" className="w-full py-1.5 border border-gray-300 rounded-md pl-3 text-gray-800 font-semibold placeholder:font-normal" id="username" placeholder="Enter username" />
                                    </div>
                                    <div className="mb-6 row">
                                       

                                    </div>
                                    <div className="mb-3">
                                        <button className="w-full py-2 text-white border-transparent shadow-md btn w-100 waves-effect waves-light shadow-violet-200 bg-color-primary rounded-md font-bold hover:bg-blue-100" type="submit">Reset Password</button>
                                    </div>
                                </form>

                                <div className="pt-2 mt-5 text-center">
                                    <div>
                                    </div>

                                    <div className="flex justify-center gap-3">
                                    </div>
                                </div>

                                <div className="mt-12 text-center">
                                    <p className="text-gray-500">Remember password ? <Link href="/" className="font-semibold text-color-secondary"> Login now </Link> </p>
                                </div>
                            </div>


                            <div className="text-center mt-8">
                                <p className="relative text-gray-500">
                                  © {year} IBanking.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </section>
  );
}
