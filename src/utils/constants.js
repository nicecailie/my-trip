export const ROLES = {
    SENDER: 'sender',
    TRAVELER: 'traveler',
    RECIPIENT: 'recipient',
}; 

//Item categories 
export const ITEM_TYPES ={
    DOCUMENTS: 'documents',
    ELECTRONICS: 'electronics',
    CLOTHES: 'clothes',
    GIFTS: 'gifts',
};

export const ITEM_TYPE_LABELS = {
    [ITEM_TYPES.DOCUMENTS]: 'Documents',
    [ITEM_TYPES.ELECTRONICS]: 'Electronics',
    [ITEM_TYPES.CLOTHES]: 'Clothes',
    [ITEM_TYPES.GIFTS]: 'Gifts',
}; 

export const SIZES = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}; 

export const SIZE_LABELS = {
    [SIZES.SMALL]: 'Small (<1 kg)',
    [SIZES.MEDIUM]: 'Medium (1-3 kg)',
    [SIZES.LARGE]: 'Large (3-5 kg)',
};

export const AFRICAN_CITIES = [
    'Nairobi, Kenya',
    'Lagos, Nigeria',
    'Cairo, Egypt',
    'Johannesburg, South Africa',
    'Cape Town, South Africa',
    'Accra, Ghana',
    'Kampala, Uganda',
    'Dakar, Senegal',
    'Addis Ababa, Ethiopia',
    'Tunis, Tunisia',
    'Casablanca, Morocco',
    'Dar es Salaam, Tanzania', 
    'Abuja, Nigeria',
    'Kigali, Rwanda',
    'Bujumbura, Burundi',
];

export const EUROPEAN_CITIES = [
    'London, UK',
    'Cambridge, UK',
    'Edinburgh, UK',
    'Dublin, Ireland',
    'Lisbon, Portugal',
    'Madrid, Spain',
    'Berlin, Germany',
    'Rome, Italy',
    'Brussels, Belgium',
    'Paris, France',
    'Berlin, Germany',
    'Madrid, Spain',
    'Rome, Italy',
    'Amsterdam, Netherlands',
    'Stockholm, Sweden',
    'Oslo, Norway',
    'Copenhagen, Denmark',
    'Helsinki, Finland'
];

export const ALL_CITIES = [
    ...AFRICAN_CITIES,
    ...EUROPEAN_CITIES,
];

export const CORRIDORS = {
    AFRICA_AFRICA : 'Africa_Africa',
    AFRICA_EUROPE : 'Africa_Europe',
    EUROPE_AFRICA : 'Europe_Africa'
}; 

export const TRANSACTION_STATUS = {
    CREATED: 'created',
    DROPPED_OFF: 'dropped_off',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    ARRIVED: 'arrived',
    RATED : 'rated',
    CLOSED : 'closed',
};

export const STATUS_LABELS = {
    [TRANSACTION_STATUS.CREATED]: 'Created',
    [TRANSACTION_STATUS.DROPPED_OFF]: 'Item Dropped Off',
    [TRANSACTION_STATUS.IN_TRANSIT]: 'In Transit',
    [TRANSACTION_STATUS.DELIVERED]: 'Delivered',
    [TRANSACTION_STATUS.ARRIVED]: 'Arrived',
    [TRANSACTION_STATUS.RATED]: 'Rated',
    [TRANSACTION_STATUS.CLOSED]: 'Completed',
};

export const REQUEST_STATUS = {
    PENDING: 'pending',
    MATCHED: 'matched',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired'
};

export const CHAT_PHASES = {
    NEGOTIATION: 'negotiation',
    DELIVERY: 'delivery',
    CLOSED: 'closed'
};


export const THEME_COLORS = {
  sender: {
    primary: "#dc2626",
    primaryHover: "#b91c1c",
    light: "#fee2e2",
    medium: "#fecaca",
    gradient: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
    border: "#fecaca",
  },
  traveler: {
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    light: "#dbeafe",
    medium: "#bfdbfe",
    gradient: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    border: "#bfdbfe",
  },
};


export const getCorridor = (origin, destination) =>{
    const originIsAfrican = AFRICAN_CITIES.includes(origin);
    const destIsAfrican = AFRICAN_CITIES.includes(destination);

    if(originIsAfrican && destIsAfrican){
        return CORRIDORS.AFRICA_AFRICA;
    } else if (originIsAfrican && !destIsAfrican){
        return CORRIDORS.AFRICA_EUROPE;
    } else if (!originIsAfrican && destIsAfrican) { 
        return CORRIDORS.EUROPE_AFRICA;
    }
    return null;
}; 

export const isValidRoute = (origin, destination) => {
    if (origin === destination) return false;
    const corridor = getCorridor(origin, destination);
    return corridor !== null;
}; 

export const formatDate = (date) =>{
    if(!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export const isDateInFuture = (date) => {
    return new Date(date) > new Date();
};
