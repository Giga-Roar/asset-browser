import React from 'react';

function Pagination({
    currentPage,
    totalPages,
    onNextPage,
    onPreviousPage
}) {
    return (
        <div className="pagination">
            <button
                onClick={onPreviousPage}
                disabled={currentPage === 0}
            >
                Previous
            </button>
            <span>Page {currentPage + 1} of {totalPages}</span>
            <button
                onClick={onNextPage}
                disabled={currentPage === totalPages - 1}
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;