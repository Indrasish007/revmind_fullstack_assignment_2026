/**
 * Centralized API Service for NovaBite Analytics Dashboard
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Helper to handle fetch requests and standardized error throwing
 * @param {string} endpoint - The API endpoint path
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<any>}
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // Attempt to extract detail from FastAPI error response
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errData = await response.json();
        if (errData && errData.detail) {
          errorMessage = typeof errData.detail === 'string' 
            ? errData.detail 
            : JSON.stringify(errData.detail);
        }
      } catch {
        // Fallback to text or default statusText if response is not JSON
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for [${url}]:`, error);
    throw error;
  }
}

export const apiService = {
  /**
   * Fetch top-level KPIs summary
   * @returns {Promise<{
   *   total_net_revenue: number,
   *   total_units_sold: number,
   *   gross_profit_margin_pct: number,
   *   top_region: string,
   *   top_channel: string,
   *   top_product: string
   * }>}
   */
  async fetchSummary() {
    return apiFetch('/api/summary');
  },

  /**
   * Fetch sales breakdown by region
   * @returns {Promise<Array<{
   *   region: string,
   *   net_revenue: number,
   *   units_sold: number,
   *   gross_profit: number,
   *   gross_profit_margin_pct: number
   * }>>}
   */
  async fetchSalesByRegion() {
    return apiFetch('/api/sales-by-region');
  },

  /**
   * Fetch sales breakdown by product category
   * @returns {Promise<Array<{
   *   category: string,
   *   net_revenue: number,
   *   units_sold: number,
   *   gross_profit: number,
   *   gross_profit_margin_pct: number
   * }>>}
   */
  async fetchSalesByCategory() {
    return apiFetch('/api/sales-by-category');
  },

  /**
   * Fetch top performing products
   * @param {number} limit - Max number of items to return (default: 10)
   * @returns {Promise<Array<{
   *   product_name: string,
   *   sku: string,
   *   category: string,
   *   net_revenue: number,
   *   units_sold: number
   * }>>}
   */
  async fetchTopProducts(limit = 10) {
    return apiFetch(`/api/top-products?limit=${limit}`);
  },

  /**
   * Fetch profit metrics by category, subcategory, and channel
   * @returns {Promise<{
   *   by_category: Array<{ name: string, net_revenue: number, cogs: number, gross_profit: number, gross_profit_margin_pct: number }>,
   *   by_subcategory: Array<{ name: string, net_revenue: number, cogs: number, gross_profit: number, gross_profit_margin_pct: number }>,
   *   by_channel: Array<{ name: string, net_revenue: number, cogs: number, gross_profit: number, gross_profit_margin_pct: number }>
   * }>}
   */
  async fetchProfitAnalysis() {
    return apiFetch('/api/profit-analysis');
  },

  /**
   * Fetch monthly sales and profit trends
   * @returns {Promise<Array<{
   *   month: string,
   *   net_revenue: number,
   *   units_sold: number,
   *   gross_profit: number
   * }>>}
   */
  async fetchMonthlyTrend() {
    return apiFetch('/api/monthly-trend');
  },
};
