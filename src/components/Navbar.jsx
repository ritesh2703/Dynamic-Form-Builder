import React from 'react';

const Navbar = ({ searchTerm, setSearchTerm }) => {
    return (
        <nav className="bg-purple-600 text-white p-4 shadow-md">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">📋 Form Builder</h1>
            
                {/* Search Bar */}
                <div className="relative w-72">
                    <input
                        type="text"
                        placeholder="Search forms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 w-full rounded-md border border-gray-300 bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <span className="absolute top-2 right-3 text-gray-400">🔍</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;