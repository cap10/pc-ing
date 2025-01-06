import Sidebar from '@/shared/ui/sidebar';
import './../globals.css'
import Navbar from '@/shared/ui/navbar';
import Footer from '@/shared/ui/footer';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <section>
            <div className="fixed bottom-0 z-10 h-screen ltr:border-r rtl:border-l vertical-menu rtl:right-0 ltr:left-0 top-[70px] bg-slate-50 border-gray-50 print:hidden">
        
                <Sidebar />
                
            </div>
            

            <Navbar />

            <div className="main-content group-data-[sidebar-size=sm]:ml-[70px]">
                <div className="min-h-screen page-content">

                    <div className="container-fluid px-[0.625rem]">

                        <div className="grid grid-cols-1 pb-6">
                            {children}
                        </div>
                        
                        <Footer />

                    </div>
                </div>
            </div>

        </section>
  )
}