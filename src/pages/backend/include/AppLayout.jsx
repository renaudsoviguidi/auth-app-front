import React, { useState } from "react";
import AppHeader from "./AppHeader";
import AppSideBar from "./AppSideBar";


const AppLayout = ({ children }) => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <React.Fragment>
            <div className="min-h-screen bg-gray-50">
                {/* SideBar */}
                    <AppSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                {/* End SideBar */}

                {/* Main Content */}
                <main className="lg:ml-64 min-h-screen">
                    {/* Header */}
                        <AppHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    {/* End Header */}

                    {/* Dashboard Content */}
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                    {/* End Dashboard Content */}
                </main>
                {/* End Main Content */}
            </div>
        </React.Fragment>
    );


}
export default AppLayout