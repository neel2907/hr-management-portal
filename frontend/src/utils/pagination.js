/**
 * Utility functions for handling Spring Boot Page<T> pagination.
 */

/**
 * Normalizes a Spring Page<T> object into a standard frontend pagination model.
 * @param {Object} springPage - The raw JSON page from Spring Boot.
 * @returns {Object} - Normalized pagination data model.
 */
export const normalizePageTemplate = (springPage) => {
    if (!springPage) {
        return {
            rows: [],
            page: 0,
            pageSize: 10,
            total: 0,
            totalPages: 0,
            isFirst: true,
            isLast: true
        };
    }

    return {
        rows: springPage.content || [],
        page: springPage.number || 0,
        pageSize: springPage.size || 10,
        total: springPage.totalElements || 0,
        totalPages: springPage.totalPages || 0,
        isFirst: springPage.first ?? true,
        isLast: springPage.last ?? true
    };
};

/**
 * Builds standard pagination query parameters for Spring Boot services.
 * @param {number} page - Current page (0-indexed).
 * @param {number} size - Items per page.
 * @param {Array<string>} sortConfig - Array of sort parameters, e.g., ["createdAt,desc", "status,asc"].
 * @returns {string} - Computed URL query string (starts with `?`).
 */
export const buildPaginationParams = (page = 0, size = 10, sortConfig = []) => {
    const params = new URLSearchParams();
    
    params.append('page', page);
    params.append('size', size);
    
    if (sortConfig && sortConfig.length > 0) {
        sortConfig.forEach(sortItem => {
            params.append('sort', sortItem);
        });
    }
    
    return `?${params.toString()}`;
};
