// Utility function to refresh dashboard statistics after import operations
export const refreshDashboard = () => {
  // Dispatch custom event to refresh dashboard
  window.dispatchEvent(new CustomEvent('dashboardRefresh'));
};

// Optional: Add delay for better UX
export const refreshDashboardWithDelay = (delay: number = 1000) => {
  setTimeout(() => {
    refreshDashboard();
  }, delay);
};