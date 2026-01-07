"use client";

import React, { useState, useEffect } from "react";
// Removed ThemeContext dependency for now as it wasn't requested/verified to exist in this context,
// and we want to enforce brand colors.

const DataTable = ({ title, columns, data = [], onAddClick, showAddButton = true, loading = false }: any) => {
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState<any[]>(data);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (Array.isArray(data)) {
            const filtered = data.filter((item) =>
                Object.values(item).some((val) =>
                    String(val).toLowerCase().includes(search.toLowerCase())
                )
            );
            setFilteredData(filtered);
            setCurrentPage(1);
        } else {
            setFilteredData([]);
        }
    }, [search, data]);

    const startIdx = (currentPage - 1) * entriesPerPage;
    const endIdx = startIdx + entriesPerPage;
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 max-w-full mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="header">
                    <h2 className="text-xl font-bold text-[#651313]">{title}</h2>
                </div>
                {showAddButton && onAddClick && (
                    <button
                        onClick={onAddClick}
                        className="bg-[#EB4724] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New
                    </button>
                )}
            </div>

            <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <div className="flex items-center">
                    <label className="text-sm text-gray-600">Show&nbsp;</label>
                    <select
                        value={entriesPerPage}
                        onChange={(e) => {
                            setEntriesPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 bg-white text-gray-900 rounded-md px-2 py-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                    >
                        {[5, 10, 25, 50, 100].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-600 ml-1"> entries</span>
                </div>
                <div className="relative w-full sm:w-64">
                    {/* Search Icon */}
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search details..."
                        className="border border-gray-200 pl-9 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#EB4724] focus:border-transparent transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#651313] text-white">
                        <tr>
                            {columns.map((col: any, i: number) => (
                                <th
                                    key={col.key || i}
                                    className="px-5 py-4 uppercase text-xs font-semibold tracking-wide"
                                    style={col.width ? { width: col.width, minWidth: col.width } : {}}
                                >
                                    {col.label ?? ""}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            [1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="animate-pulse">
                                    {columns.map((_: any, j: number) => (
                                        <td key={j} className="px-5 py-4">
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : filteredData.length > 0 ? (
                            filteredData.slice(startIdx, endIdx).map((row: any, idx: number) => (
                                <tr
                                    key={row._id || row.id || idx}
                                    className={`group transition-colors ${idx % 2 === 0
                                        ? "bg-white"
                                        : "bg-gray-50/50"
                                        }`}
                                >
                                    {columns.map((col: any, i: number) => {
                                        const rawValue = col.render
                                            ? col.render(row, idx)
                                            : col.key
                                                ? col.key.split(".").reduce((obj: any, key: any) => obj?.[key], row)
                                                : undefined;

                                        let cellContent = rawValue;

                                        if (rawValue === undefined || rawValue === null || rawValue === "") {
                                            cellContent = <span className="text-gray-400">-</span>;
                                        } else if (Array.isArray(rawValue)) {
                                            cellContent = rawValue.join(", ");
                                        }

                                        return (
                                            <td
                                                key={col.key || i}
                                                className="px-5 py-4 text-gray-600 font-medium"
                                                style={col.width ? { width: col.width, minWidth: col.width } : {}}
                                            >
                                                {cellContent}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-10 text-center text-gray-400"
                                >
                                    <p>No data found matching your search.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4 text-sm text-gray-500 flex-wrap gap-4">
                <span>
                    {filteredData.length === 0
                        ? "Showing 0 entries"
                        : `Showing ${startIdx + 1} to ${Math.min(endIdx, filteredData.length)} of ${filteredData.length} entries`}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Previous
                    </button>

                    <div className="bg-[#651313] text-white px-3 py-1.5 rounded-md text-xs font-bold">
                        {currentPage}
                    </div>

                    <button
                        className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
