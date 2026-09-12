// src/utils/helpers.js

/**
 * Format a date into "Jan 7, 2026"
 */
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const filterTripsForSender = (trips, filters = {}) => {
  let filtered = [...trips];

  // Smart routing: show trips going FROM my origin OR TO my destination
  if (filters.myOrigin || filters.myDestination) {
    filtered = filtered.filter((trip) => {
      const matchesOrigin = filters.myOrigin ? trip.from === filters.myOrigin : false;
      const matchesDestination = filters.myDestination ? trip.to === filters.myDestination : false;
      return matchesOrigin || matchesDestination;
    });
  }

  // Date range
  if (filters.startDate) {
    filtered = filtered.filter((trip) => new Date(trip.travelDate) >= new Date(filters.startDate));
  }
  if (filters.endDate) {
    filtered = filtered.filter((trip) => new Date(trip.travelDate) <= new Date(filters.endDate));
  }

  // Accepted item type
  if (filters.itemType) {
    filtered = filtered.filter((trip) => (trip.acceptedItems || []).includes(filters.itemType));
  }

  // Available space
  if (filters.size) {
    const sizeOrder = { small: 1, medium: 2, large: 3 };
    filtered = filtered.filter(
      (trip) => sizeOrder[trip.availableSpace] >= sizeOrder[filters.size]
    );
  }

  // Specific route
  if (filters.from) filtered = filtered.filter((trip) => trip.from === filters.from);
  if (filters.to) filtered = filtered.filter((trip) => trip.to === filters.to);

  return filtered;
};

/**
 * Filter requests for a traveler
 * show requests FROM my origin OR TO my destination
 */
export const filterRequestsForTraveler = (requests, filters = {}) => {
  let filtered = [...requests];

  if (filters.myOrigin || filters.myDestination) {
    filtered = filtered.filter((request) => {
      const matchesOrigin = filters.myOrigin ? request.from === filters.myOrigin : false;
      const matchesDestination = filters.myDestination ? request.to === filters.myDestination : false;
      return matchesOrigin || matchesDestination;
    });
  }

  if (filters.itemType) filtered = filtered.filter((r) => r.itemType === filters.itemType);
  if (filters.size) filtered = filtered.filter((r) => r.size === filters.size);

  if (filters.startDate) {
    filtered = filtered.filter((r) => new Date(r.neededBy) >= new Date(filters.startDate));
  }
  if (filters.endDate) {
    filtered = filtered.filter((r) => new Date(r.neededBy) <= new Date(filters.endDate));
  }

  if (filters.from) filtered = filtered.filter((r) => r.from === filters.from);
  if (filters.to) filtered = filtered.filter((r) => r.to === filters.to);

  return filtered;
};

export const routesMatch = (route1, route2) => {
  if (!route1 || !route2) return false;
  return (
    route1.from === route2.from ||
    route1.to === route2.to ||
    route1.from === route2.to ||
    route1.to === route2.from
  );
};

export const sortItems = (items, sortBy = "date") => {
  const sorted = [...items];

  switch (sortBy) {
    case "date":
      return sorted.sort((a, b) => {
        const dateA = new Date(a.travelDate || a.neededBy);
        const dateB = new Date(b.travelDate || b.neededBy);
        return dateA - dateB;
      });

    case "newest":
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    case "oldest":
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    default:
      return sorted;
  }
};

export const getUniqueCities = (items, field) => {
  const cities = new Set();
  items.forEach((item) => {
    if (item?.[field]) cities.add(item[field]);
  });
  return Array.from(cities).sort();
};

export const isDateInFuture = (date) => {
  if (!date) return false;
  return new Date(date) > new Date();
};
