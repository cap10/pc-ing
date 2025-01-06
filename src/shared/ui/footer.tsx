
export default function Footer() {
    
    const year = new Date().getFullYear();

    return (
        <footer className="absolute bottom-0 left-0 right-0 px-5 py-5 bg-white border-t footer border-gray-200 mr-6 ml-6">
            <div className="grid grid-cols-2 text-gray-700">
                <div className="grow col-start-2 text-right">
                    &copy; {year} IBanking.
                </div>
            </div>
        </footer>
    );
}