import Sidebar from '@/shared/ui/sidebar';
import './../globals.css'
import Navbar from '@/shared/ui/navbar';
import Footer from '@/shared/ui/footer';
import Script from 'next/script';
import IdleTimerContainer from "@/app/idle-timer/page";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
      <section>
          <div
              className="fixed bottom-0 z-10 h-screen vertical-menu top-[70px] bg-slate-50 border-gray-50 print:hidden w-[70px] md:w-[250px] transition-all duration-300 ease-in-out">
              <Sidebar/>
          </div>

          <IdleTimerContainer/>
          <Navbar/>

          <div className="main-content ml-[70px] md:ml-[250px] transition-all duration-300 ease-in-out">
              <div className="min-h-screen page-content">
                  <div className="container-fluid px-[0.625rem]">
                      <div className="grid grid-cols-1 pb-6">
                          {children}
                      </div>
                      <Footer/>
                  </div>
              </div>
          </div>

          <Script type='text/javascript' src='/assets/libs/metismenujs.min.js'/>
          <Script type='text/javascript' src='/assets/libs/popper.min.js'/>
          <Script type='text/javascript' src='/assets/js/app.js'/>
      </section>


  )
}