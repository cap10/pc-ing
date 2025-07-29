import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface KekeAsset {
    id: string;
    registrationNumber: string;
    aggregator: string;
    driver: string;
    location: string;
    status: string;
    weeklyRevenue: number;
    cardPaymentRatio: number;
    rebatesIssued: number;
    deploymentDate: string;
}

export interface Aggregator {
    id: string;
    name: string;
    kekesAssigned: number;
    kekesDeployed: number;
    avgWeeklyCollection: number;
    cardPaymentRatio: number;
}

export interface Driver {
    id: string;
    name: string;
    phone: string;
    kekeId: string;
    licenseExpiry: string;
    kycStatus: string;
    appUsage: string;
}

interface DataState {
    kekeAssets: KekeAsset[];
    aggregators: Aggregator[];
    drivers: Driver[];
    isLoaded: boolean;
    activeTab: string;
}

// Initial data
const initialKekeAssets: KekeAsset[] = [
    {
        id: 'KK001',
        registrationNumber: 'ABC-123-XY',
        aggregator: 'City Riders Coop',
        driver: 'Ahmed Ibrahim',
        location: 'Victoria Island',
        status: 'Active',
        weeklyRevenue: 8500,
        cardPaymentRatio: 0.75,
        rebatesIssued: 425,
        deploymentDate: '2025-06-15'
    },
    {
        id: 'KK002',
        registrationNumber: 'DEF-456-ZW',
        aggregator: 'Metro Transport',
        driver: 'Chidi Okafor',
        location: 'Ikeja',
        status: 'Active',
        weeklyRevenue: 12000,
        cardPaymentRatio: 0.82,
        rebatesIssued: 600,
        deploymentDate: '2025-06-10'
    },
    {
        id: 'KK003',
        registrationNumber: 'GHI-789-UV',
        aggregator: 'City Riders Coop',
        driver: 'Fatima Hassan',
        location: 'Surulere',
        status: 'Maintenance',
        weeklyRevenue: 0,
        cardPaymentRatio: 0,
        rebatesIssued: 0,
        deploymentDate: '2025-06-20'
    }
];

const initialAggregators: Aggregator[] = [
    {
        id: 'AGG001',
        name: 'City Riders Coop',
        kekesAssigned: 15,
        kekesDeployed: 12,
        avgWeeklyCollection: 180000,
        cardPaymentRatio: 0.78
    },
    {
        id: 'AGG002',
        name: 'Metro Transport',
        kekesAssigned: 20,
        kekesDeployed: 18,
        avgWeeklyCollection: 240000,
        cardPaymentRatio: 0.85
    }
];

const initialDrivers: Driver[] = [
    {
        id: 'DRV001',
        name: 'Ahmed Ibrahim',
        phone: '+234-801-234-5678',
        kekeId: 'KK001',
        licenseExpiry: '2025-12-31',
        kycStatus: 'Complete',
        appUsage: 'Active'
    },
    {
        id: 'DRV002',
        name: 'Chidi Okafor',
        phone: '+234-802-345-6789',
        kekeId: 'KK002',
        licenseExpiry: '2025-11-15',
        kycStatus: 'Complete',
        appUsage: 'Active'
    }
];

const initialState: DataState = {
    kekeAssets: initialKekeAssets,
    aggregators: initialAggregators,
    drivers: initialDrivers,
    isLoaded: false,
    activeTab: 'overview',
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        // Load data from localStorage
        loadDataFromStorage: (state) => {
            if (typeof window !== 'undefined') {
                const savedKekeAssets = localStorage.getItem('kekeAssets');
                const savedAggregators = localStorage.getItem('aggregators');
                const savedDrivers = localStorage.getItem('drivers');
                const savedActiveTab = localStorage.getItem('activeTab');

                if (savedKekeAssets) {
                    state.kekeAssets = JSON.parse(savedKekeAssets);
                }
                if (savedAggregators) {
                    state.aggregators = JSON.parse(savedAggregators);
                }
                if (savedDrivers) {
                    state.drivers = JSON.parse(savedDrivers);
                }
                if (savedActiveTab) {
                    state.activeTab = savedActiveTab;
                }
                state.isLoaded = true;
            }
        },

        // UI State actions
        setActiveTab: (state, action: PayloadAction<string>) => {
            state.activeTab = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('activeTab', action.payload);
            }
        },

        // Keke Asset actions
        addKekeAsset: (state, action: PayloadAction<Omit<KekeAsset, 'id'>>) => {
            const newKeke: KekeAsset = {
                id: `KK${String(state.kekeAssets.length + 1).padStart(3, '0')}`,
                ...action.payload,
                weeklyRevenue: 0,
                cardPaymentRatio: 0,
                rebatesIssued: 0
            };
            state.kekeAssets.push(newKeke);
            if (typeof window !== 'undefined') {
                localStorage.setItem('kekeAssets', JSON.stringify(state.kekeAssets));
            }
        },

        updateKekeAsset: (state, action: PayloadAction<KekeAsset>) => {
            const index = state.kekeAssets.findIndex(keke => keke.id === action.payload.id);
            if (index !== -1) {
                state.kekeAssets[index] = action.payload;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('kekeAssets', JSON.stringify(state.kekeAssets));
                }
            }
        },

        deleteKekeAsset: (state, action: PayloadAction<string>) => {
            state.kekeAssets = state.kekeAssets.filter(keke => keke.id !== action.payload);
            if (typeof window !== 'undefined') {
                localStorage.setItem('kekeAssets', JSON.stringify(state.kekeAssets));
            }
        },

        // Aggregator actions
        addAggregator: (state, action: PayloadAction<Omit<Aggregator, 'id'>>) => {
            const newAggregator: Aggregator = {
                id: `AGG${String(state.aggregators.length + 1).padStart(3, '0')}`,
                ...action.payload,
                kekesDeployed: 0,
                avgWeeklyCollection: 0,
                cardPaymentRatio: 0
            };
            state.aggregators.push(newAggregator);
            if (typeof window !== 'undefined') {
                localStorage.setItem('aggregators', JSON.stringify(state.aggregators));
            }
        },

        updateAggregator: (state, action: PayloadAction<Aggregator>) => {
            const index = state.aggregators.findIndex(agg => agg.id === action.payload.id);
            if (index !== -1) {
                state.aggregators[index] = action.payload;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('aggregators', JSON.stringify(state.aggregators));
                }
            }
        },

        deleteAggregator: (state, action: PayloadAction<string>) => {
            state.aggregators = state.aggregators.filter(agg => agg.id !== action.payload);
            if (typeof window !== 'undefined') {
                localStorage.setItem('aggregators', JSON.stringify(state.aggregators));
            }
        },

        // Driver actions
        addDriver: (state, action: PayloadAction<Omit<Driver, 'id'>>) => {
            const newDriver: Driver = {
                id: `DRV${String(state.drivers.length + 1).padStart(3, '0')}`,
                ...action.payload
            };
            state.drivers.push(newDriver);
            if (typeof window !== 'undefined') {
                localStorage.setItem('drivers', JSON.stringify(state.drivers));
            }
        },

        updateDriver: (state, action: PayloadAction<Driver>) => {
            const index = state.drivers.findIndex(driver => driver.id === action.payload.id);
            if (index !== -1) {
                state.drivers[index] = action.payload;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('drivers', JSON.stringify(state.drivers));
                }
            }
        },

        deleteDriver: (state, action: PayloadAction<string>) => {
            state.drivers = state.drivers.filter(driver => driver.id !== action.payload);
            if (typeof window !== 'undefined') {
                localStorage.setItem('drivers', JSON.stringify(state.drivers));
            }
        },
    },
});

export const {
    loadDataFromStorage,
    setActiveTab,
    addKekeAsset,
    updateKekeAsset,
    deleteKekeAsset,
    addAggregator,
    updateAggregator,
    deleteAggregator,
    addDriver,
    updateDriver,
    deleteDriver,
} = dataSlice.actions;

export default dataSlice.reducer;