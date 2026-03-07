import Sidebar from "./Sidebar";

export default function Layout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Sidebar — fixed on left */}
            <Sidebar />

            {/* Main content — offset by sidebar width */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                {children}
            </main>

        </div>
    );
}