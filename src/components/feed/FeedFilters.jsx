// src/components/feed/FeedFilters.jsx
import React, { useState } from 'react';
import { ITEM_TYPE_LABELS, SIZE_LABELS, ALL_CITIES } from '../../utils/constants';

const FeedFilters = ({ isSender, onFilterChange, theme }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    itemType: '',
    size: '',
    startDate: '',
    endDate: '',
    sortBy: 'date'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      from: '',
      to: '',
      itemType: '',
      size: '',
      startDate: '',
      endDate: '',
      sortBy: 'date'
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(v => v && v !== 'date');

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      padding: '20px',
      marginBottom: '20px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: showFilters ? '20px' : 0
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827'
    },
    toggleButton: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '600',
      backgroundColor: theme.primary,
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    filterGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '16px'
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    label: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#374151'
    },
    select: {
      padding: '10px',
      fontSize: '14px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    input: {
      padding: '10px',
      fontSize: '14px',
      border: '1px solid #d1d5db',
      borderRadius: '6px'
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    badge: {
      display: 'inline-block',
      padding: '4px 10px',
      fontSize: '13px',
      fontWeight: '600',
      backgroundColor: theme.light,
      color: theme.primary,
      borderRadius: '12px'
    },
    clearButton: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '600',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          🔍 Filter {isSender ? 'Travelers' : 'Requests'}
          {hasActiveFilters && (
            <span style={{...styles.badge, marginLeft: '12px'}}>
              {Object.values(filters).filter(v => v && v !== 'date').length} active
            </span>
          )}
        </h3>
        <button 
          onClick={() => setShowFilters(!showFilters)} 
          style={styles.toggleButton}
        >
          {showFilters ? '▲ Hide' : '▼ Show'} Filters
        </button>
      </div>

      {showFilters && (
        <>
          <div style={styles.filterGrid}>
            {/* Route Filters */}
            <div style={styles.filterGroup}>
              <label style={styles.label}>From</label>
              <select
                style={styles.select}
                value={filters.from}
                onChange={(e) => handleFilterChange('from', e.target.value)}
              >
                <option value="">Any city</option>
                {ALL_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>To</label>
              <select
                style={styles.select}
                value={filters.to}
                onChange={(e) => handleFilterChange('to', e.target.value)}
              >
                <option value="">Any city</option>
                {ALL_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Item Type */}
            <div style={styles.filterGroup}>
              <label style={styles.label}>Item Type</label>
              <select
                style={styles.select}
                value={filters.itemType}
                onChange={(e) => handleFilterChange('itemType', e.target.value)}
              >
                <option value="">Any item</option>
                {Object.keys(ITEM_TYPE_LABELS).map(key => (
                  <option key={key} value={key}>{ITEM_TYPE_LABELS[key]}</option>
                ))}
              </select>
            </div>

            {/* Size */}
            <div style={styles.filterGroup}>
              <label style={styles.label}>Size</label>
              <select
                style={styles.select}
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
              >
                <option value="">Any size</option>
                {Object.keys(SIZE_LABELS).map(key => (
                  <option key={key} value={key}>{SIZE_LABELS[key]}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div style={styles.filterGroup}>
              <label style={styles.label}>From Date</label>
              <input
                type="date"
                style={styles.input}
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>To Date</label>
              <input
                type="date"
                style={styles.input}
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                min={filters.startDate || new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Sort By */}
            <div style={styles.filterGroup}>
              <label style={styles.label}>Sort By</label>
              <select
                style={styles.select}
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="date">Date (Earliest First)</option>
                <option value="newest">Newest Posts</option>
                <option value="oldest">Oldest Posts</option>
                <option value="rating">Rating (Highest First)</option>
              </select>
            </div>
          </div>

          <div style={styles.actions}>
            <div style={{fontSize: '14px', color: '#6b7280'}}>
              Showing filtered results
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} style={styles.clearButton}>
                Clear All Filters
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FeedFilters;