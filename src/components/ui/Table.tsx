import React, { useState, useMemo } from 'react';
import Pagination from './Pagination';

interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
    className?: string;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    itemsPerPage?: number;
    searchable?: boolean;
    searchPlaceholder?: string;
    className?: string;
    emptyMessage?: string;
}

function Table<T extends Record<string, any>>({
    data,
    columns,
    itemsPerPage = 10,
    searchable = false,
    searchPlaceholder = "Search...",
    className = "",
    emptyMessage = "No data available"
}: TableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: 'asc' | 'desc';
    } | null>(null);

    // Filter data based on search query
    const filteredData = useMemo(() => {
        if (!searchable || !searchQuery.trim()) return data;
        
        return data.filter(item =>
            columns.some(column => {
                const value = item[column.key];
                return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
            })
        );
    }, [data, searchQuery, columns, searchable]);

    // Sort data
    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [filteredData, sortConfig]);

    // Paginate data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const handleSort = (columnKey: string) => {
        const column = columns.find(col => col.key === columnKey);
        if (!column?.sortable) return;

        setSortConfig(current => ({
            key: columnKey,
            direction: current?.key === columnKey && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getSortIcon = (columnKey: string) => {
        const column = columns.find(col => col.key === columnKey);
        if (!column?.sortable) return null;

        if (sortConfig?.key !== columnKey) {
            return <span className="text-gray-400 ml-1">⇅</span>;
        }

        return sortConfig.direction === 'asc' ? 
            <span className="text-blue-600 ml-1">↑</span> : 
            <span className="text-blue-600 ml-1">↓</span>;
    };

    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
            {searchable && (
                <div className="p-4 border-b border-gray-100">
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset to first page when searching
                        }}
                        className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                                        column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''
                                    } ${column.className || ''}`}
                                    onClick={() => handleSort(column.key)}
                                >
                                    <div className="flex items-center">
                                        {column.header}
                                        {getSortIcon(column.key)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td 
                                    colSpan={columns.length} 
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item, index) => (
                                <tr 
                                    key={index} 
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td 
                                            key={column.key} 
                                            className={`px-6 py-4 text-sm text-gray-900 ${column.className || ''}`}
                                        >
                                            {column.render ? 
                                                column.render(item) : 
                                                item[column.key]
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={sortedData.length}
                />
            )}
        </div>
    );
}

export default Table;