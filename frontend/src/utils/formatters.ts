export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0.00';
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
};

export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
};

export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  return `${(value * 100).toFixed(1)}%`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const formatMonth = (monthString: string): string => {
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  });
};

export const getRegionFullName = (code: string): string => {
  const regions: Record<string, string> = {
    'US': 'United States',
    'EU': 'Europe',
    'CA': 'Canada',
    'JP': 'Japan',
    'AU': 'Australia',
    'IN': 'India',
  };
  return regions[code] || code;
};

export const getModelColor = (model: string): string => {
  const colors: Record<string, string> = {
    'gpt-4-turbo': '#10b981',
    'gpt-3.5-turbo': '#06b6d4',
    'claude-3-opus': '#8b5cf6',
    'mistral-large': '#f59e0b',
  };
  return colors[model] || '#64748b';
};

export const getRegionColor = (region: string): string => {
  const colors: Record<string, string> = {
    'US': '#338cff',
    'EU': '#8b5cf6',
    'CA': '#f43f5e',
    'JP': '#10b981',
    'AU': '#f59e0b',
    'IN': '#06b6d4',
  };
  return colors[region] || '#64748b';
};

export const getDepartmentColor = (department: string): string => {
  const colors: Record<string, string> = {
    'R&D AI Lab': '#8b5cf6',
    'Data Science': '#338cff',
    'Marketing': '#f43f5e',
    'Support Automation': '#10b981',
    'Internal Tools': '#f59e0b',
  };
  return colors[department] || '#64748b';
};

