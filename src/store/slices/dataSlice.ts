import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
export interface KekeAsset {
  id: string;
  chassisNumber: string;
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
  totalRevenue?: number;
  marchRevenue?: number;
  aprilRevenue?: number;
  mayRevenue?: number;
  juneRevenue?: number;
  julyRevenue?: number;
  augustRevenue?: number;
}

export interface Driver {
  id: string;
  name: string;
  chassisNumber: string;
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
    id: "KK001",
    chassisNumber: "LBFKDMXC2R1327763",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK002",
    chassisNumber: "LBFKDMXC0R1327633",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-28",
  },
  {
    id: "KK003",
    chassisNumber: "LBFKDMXC3R1328064",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK004",
    chassisNumber: "LBFKDMXC9R1327744",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK005",
    chassisNumber: "LBFKDMXC8R1328514",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK006",
    chassisNumber: "LBFKDMXCXR1328076",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-14",
  },
  {
    id: "KK007",
    chassisNumber: "LBFKDMXC7R1328214",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-14",
  },
  {
    id: "KK008",
    chassisNumber: "LBFKDMXC4R1327795",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK009",
    chassisNumber: "LBFKDMXC9R1327632",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-14",
  },
  {
    id: "KK010",
    chassisNumber: "LBFKDMXC2R1327617",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-14",
  },
  {
    id: "KK011",
    chassisNumber: "LBFKDMXC6R1327622",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-14",
  },
  {
    id: "KK012",
    chassisNumber: "LBFKDMXC6R1327636",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-14",
  },
  {
    id: "KK013",
    chassisNumber: "LBFKDMXC9R1327792",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-14",
  },
  {
    id: "KK014",
    chassisNumber: "LBFKDMXC0R1327616",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-14",
  },
  {
    id: "KK015",
    chassisNumber: "LBFKDMXC3R1327772",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-28",
  },
  {
    id: "KK016",
    chassisNumber: "LBFKDMXC2R1327634",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-28",
  },
  {
    id: "KK017",
    chassisNumber: "LBFKDMXC2R1328217",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-28",
  },
  {
    id: "KK018",
    chassisNumber: "LBFKDMXC8R1327623",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-28",
  },
  {
    id: "KK019",
    chassisNumber: "LBFKDMXCOR1327684",
    aggregator: "Coorporate Vision Multi-purpose Cooperative Society",
    driver: "NA",
    location: "Lagos Mushin",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-02-09",
  },
  {
    id: "KK020",
    chassisNumber: "LBFKDMXCOR1328328",
    aggregator: "Coorporate Vision Multi-purpose Cooperative Society",
    driver: "NA",
    location: "Lagos Mushin",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-02-09",
  },
  {
    id: "KK021",
    chassisNumber: "LBFKDMXC9R1328103",
    aggregator: "Coorporate Vision Multi-purpose Cooperative Society",
    driver: "NA",
    location: "Lagos Mushin",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-02-09",
  },
  {
    id: "KK022",
    chassisNumber: "LBFKDMXCOR1327745",
    aggregator: "Coorporate Vision Multi-purpose Cooperative Society",
    driver: "NA",
    location: "Lagos Mushin",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-02-09",
  },
  {
    id: "KK023",
    chassisNumber: "LBFKDMXC1R1328127",
    aggregator: "Coorporate Vision Multi-purpose Cooperative Society",
    driver: "NA",
    location: "Lagos Mushin",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-02-09",
  },
  {
    id: "KK024",
    chassisNumber: "LBFKDMXC8R1327749",
    aggregator: "Coorporate Vision Multi-purpose Cooperative Society",
    driver: "NA",
    location: "Lagos Mushin",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-02-09",
  },
  {
    id: "KK025",
    chassisNumber: "LBFKDMXC6R1327748",
    aggregator: "Coorporate Vision Multi-purpose Cooperative Society",
    driver: "NA",
    location: "Lagos Mushin",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-02-09",
  },
  {
    id: "KK026",
    chassisNumber: "LBFKDMXC1R1328063",
    aggregator: "Coorporate Vision Multi-purpose Cooperative Society",
    driver: "NA",
    location: "Lagos Mushin",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-02-09",
  },
  {
    id: "KK027",
    chassisNumber: "LBFKDMXC4R1328543",
    aggregator: "Coorporate Vision Multi-purpose Cooperative Society",
    driver: "NA",
    location: "Lagos Mushin",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-02-09",
  },
  {
    id: "KK028",
    chassisNumber: "LBFKDMXC2R1329674",
    aggregator: "Coorporate Vision Multi-purpose Cooperative Society",
    driver: "NA",
    location: "Lagos Ikeja",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-05-05",
  },
  {
    id: "KK029",
    chassisNumber: "LBFKDMXC9R1328201",
    aggregator: "Coorporate Vision Multi-purpose Cooperative Society",
    driver: "NA",
    location: "Lagos Ikeja",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-05-05",
  },
  {
    id: "KK030",
    chassisNumber: "LBFKDMXC6R1327636",
    aggregator: "Coorporate Vision Multi-purpose Cooperative Society",
    driver: "NA",
    location: "Lagos Ikeja",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-05-05",
  },
  {
    id: "KK031",
    chassisNumber: "LBFKDMXC4R1328199",
    aggregator: "Coorporate Vision Multi-purpose Cooperative Society",
    driver: "NA",
    location: "Lagos Ikeja",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-05-05",
  },
  {
    id: "KK032",
    chassisNumber: "LBFKDMXC8R1328514",
    aggregator: "Coorporate Vision Multi-purpose Cooperative Society",
    driver: "NA",
    location: "Lagos Ikeja",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-05-05",
  },
  {
    id: "KK033",
    chassisNumber: "LBFKDMXC9R1327632",
    aggregator: "Coorporate Vision Multi-purpose Cooperative Society",
    driver: "NA",
    location: "Lagos Ikeja",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-05-05",
  },
  {
    id: "KK034",
    chassisNumber: "LBFKDMXC8R1328514",
    aggregator: "Ayomide Mushin Cooperative",
    driver: "NA",
    location: "Lagos Ikeja",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-05-05",
  },
  {
    id: "KK035",
    chassisNumber: "LBFKDMXC6R1327619",
    aggregator: "Ayomide Mushin Cooperative",
    driver: "NA",
    location: "Lagos Ikeja",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-05-05",
  },
  {
    id: "KK036",
    chassisNumber: "LBFKDMXC5R1328065",
    aggregator: "Ayomide Mushin Cooperative",
    driver: "NA",
    location: "Lagos Ikeja",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-05-05",
  },
  {
    id: "KK037",
    chassisNumber: "LBFKDMXC0R1328216",
    aggregator: "Ayomide Mushin Cooperative",
    driver: "NA",
    location: "Lagos Ikeja",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-05-05",
  },
  {
    id: "KK038",
    chassisNumber: "LBFKDMXC6R1327619",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-14",
  },
  {
    id: "KK039",
    chassisNumber: "LBFKDMXC5R1328065",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK040",
    chassisNumber: "LBFKDMXC2R1329674",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-14",
  },
  {
    id: "KK041",
    chassisNumber: "LBFKDMXC0R1328216",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-14",
  },
  {
    id: "KK042",
    chassisNumber: "LBFKDMXC4R1328199",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-14",
  },
  {
    id: "KK043",
    chassisNumber: "LBFKDMXC9R1328067",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-14",
  },
  {
    id: "KK044",
    chassisNumber: "LBFKDMXCXR1328448",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-28",
  },
  {
    id: "KK045",
    chassisNumber: "LBFKDMXC9R1327789",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-28",
  },
  {
    id: "KK046",
    chassisNumber: "LBFKDMXC2R1330002",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-28",
  },
  {
    id: "KK047",
    chassisNumber: "LBFKDMXC2R1327467",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-28",
  },
  {
    id: "KK048",
    chassisNumber: "LBFKDMXC5R1327644",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-28",
  },
  {
    id: "KK049",
    chassisNumber: "LBFKDMXC0R1327647",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-28",
  },
  {
    id: "KK050",
    chassisNumber: "LBFKDMXC9R1328215",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-28",
  },
  {
    id: "KK051",
    chassisNumber: "LBFKDMXCXR1327641",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-28",
  },
  {
    id: "KK052",
    chassisNumber: "LBFKDMXC9R1328070",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-28",
  },
  {
    id: "KK053",
    chassisNumber: "LBFKDMXC5R1328468",
    aggregator: "Ayomide Mushin Cooperative",
    driver: "Hita Felix Ayomide",
    location: "Ogun Abeokuta",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-28",
  },
  {
    id: "KK054",
    chassisNumber: "LBFKDMXC8R1327640",
    aggregator: "Ayomide Mushin Cooperative",
    driver: "Etta Sunday Theophilus",
    location: "Ogun Abeokuta",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK055",
    chassisNumber: "LBFKDMXC3R1327884",
    aggregator: "Ayomide Mushin Cooperative",
    driver: "Olaoye Moses Adeolu",
    location: "Ogun Abeokuta",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK056",
    chassisNumber: "LBFKDMXC6R1327703",
    aggregator: "Ayomide Mushin Cooperative",
    driver: "Oloyede Ola Oluomo",
    location: "Ogun Abeokuta",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK057",
    chassisNumber: "LBFKDMXC2R1327794",
    aggregator: "Ayomide Mushin Cooperative",
    driver: "Omotosho Sunday Eniafe",
    location: "Ogun Abeokuta",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK058",
    chassisNumber: "LBFKDMXC7R1328312",
    aggregator: "Ayomide Mushin Cooperative",
    driver: "Rasheed Alaba Kamil",
    location: "Ogun Abeokuta",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK059",
    chassisNumber: "LBFKDMXC5R1327790",
    aggregator: "Ayomide Mushin Cooperative",
    driver: "Ajayi Afolabi Julius",
    location: "Ogun Abeokuta",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK060",
    chassisNumber: "LBFKDMXC4R1327747",
    aggregator: "Ayomide Mushin Cooperative",
    driver: "Ajileye Emmanuel",
    location: "Ogun Abeokuta",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK061",
    chassisNumber: "LBFKDMXC5R1328518",
    aggregator: "Ayomide Mushin Cooperative",
    driver: "Oladipupo Oluwakayode Joseph",
    location: "Ogun Abeokuta",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK062",
    chassisNumber: "LBFKDMXC0R1327888",
    aggregator: "Ayomide Mushin Cooperative",
    driver: "NA",
    location: "Ogun Abeokuta",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK063",
    chassisNumber: "LBFKDMXC3R1328212",
    aggregator: "Ayomide Mushin Cooperative",
    driver: "NA",
    location: "Ogun Abeokuta",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK065",
    chassisNumber: "LBFKDMXC6R1328107",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK066",
    chassisNumber: "LBFKDMXC7R1327791",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK070",
    chassisNumber: "LBFKDMXC9R1327887",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-30",
  },
  {
    id: "KK072",
    chassisNumber: "LBFKDMXC1R1327589",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-08-01",
  },
  {
    id: "KK064",
    chassisNumber: "LBFKDMXC9R1328456",
    aggregator: "Cooperative Investment and Credit Society",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK067",
    chassisNumber: "LBFKDMXC5R1328213",
    aggregator: "AKU",
    driver: "NA",
    location: "Ogun KJ",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK068",
    chassisNumber: "LBFKDMXC8R1328075",
    aggregator: "AKU",
    driver: "NA",
    location: "Ogun KJ",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK069",
    chassisNumber: "LBFKDMXC3R1328467",
    aggregator: "AKU",
    driver: "NA",
    location: "Ogun KJ",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-29",
  },
  {
    id: "KK071",
    chassisNumber: "LBFKDMXC1R1327639",
    aggregator: "AKU",
    driver: "NA",
    location: "Ogun KJ",
    status: "Maintenance",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-07-31",
  },
  {
    id: "KK073",
    chassisNumber: "LBFKDMXC2R1327746",
    aggregator: "Odo-oro youth empowerment program",
    driver: "NA",
    location: "Oyo Ibadan",
    status: "Active",
    weeklyRevenue: 0,
    cardPaymentRatio: 0,
    rebatesIssued: 0,
    deploymentDate: "2025-08-02",
  },
];

const initialAggregators: Aggregator[] = [
  {
    id: "AGG001",
    name: "Cooperative Investment and Credit Society",
    kekesAssigned: 30,
    kekesDeployed: 20,
    avgWeeklyCollection: 0,
    cardPaymentRatio: 0.78,
  },
  {
    id: "AGG002",
    name: "Ayomide Mushin Cooperative",
    kekesAssigned: 20,
    kekesDeployed: 20,
    avgWeeklyCollection: 0,
    cardPaymentRatio: 0.85,
    totalRevenue: 770000,
    augustRevenue: 770000,
  },
  {
    id: "AGG003",
    name: "Odo-oro youth empowerment program",
    kekesAssigned: 20,
    kekesDeployed: 13,
    avgWeeklyCollection: 36054,
    cardPaymentRatio: 0,
    totalRevenue: 468700,
    augustRevenue: 468700,
  },
  {
    id: "AGG004",
    name: "Ado – Ekiti Heritage Cooperative Society",
    kekesAssigned: 10,
    kekesDeployed: 0,
    avgWeeklyCollection: 0,
    cardPaymentRatio: 0,
  },
  {
    id: "AGG005",
    name: "Convenant Partners Cooperative Limited",
    kekesAssigned: 10,
    kekesDeployed: 0,
    avgWeeklyCollection: 0,
    cardPaymentRatio: 0,
  },
  {
    id: "AGG006",
    name: "Coorporate Vision Multi-purpose Cooperative Society",
    kekesAssigned: 15,
    kekesDeployed: 15,
    avgWeeklyCollection: 52500,
    cardPaymentRatio: 0,
    totalRevenue: 2094000,
    marchRevenue: 180000,
    aprilRevenue: 720000,
    mayRevenue: 652000,
    juneRevenue: 542000,
    julyRevenue: 0,
  },
//   {
//     id: "AGG007",
//     name: "AKU",
//     kekesAssigned: 5,
//     kekesDeployed: 0,
//     avgWeeklyCollection: 0,
//     cardPaymentRatio: 0,
//   },
];

const initialDrivers: Driver[] = [
    {
      id: "DRV001",
      name: "Hita Felix Ayomide",
      chassisNumber: "LBFKDMXC5R1328468",
      kekeId: "KK053",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV002",
      name: "Etta Sunday Theophilus",
      chassisNumber: "LBFKDMXC8R1327640",
      kekeId: "KK054",
      licenseExpiry: "2025-11-15",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV003",
      name: "Olaoye Moses Adeolu",
      chassisNumber: "LBFKDMXC3R1327884",
      kekeId: "KK055",
      licenseExpiry: "2025-11-11",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV004",
      name: "Oloyede Ola Oluomo",
      chassisNumber: "LBFKDMXC6R1327703",
      kekeId: "KK056",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV005",
      name: "Omotosho Sunday Eniafe",
      chassisNumber: "LBFKDMXC2R1327794",
      kekeId: "KK057",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV006",
      name: "Rasheed Alaba Kamil",
      chassisNumber: "LBFKDMXC7R1328312",
      kekeId: "KK058",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV007",
      name: "Ajayi Afolabi Julius",
      chassisNumber: "LBFKDMXC5R1327790",
      kekeId: "KK059",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV008",
      name: "Ajileye Emmanuel",
      chassisNumber: "LBFKDMXC4R1327747",
      kekeId: "KK060",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV009",
      name: "Oladipupo Oluwakayode Joseph",
      chassisNumber: "LBFKDMXC5R1328518",
      kekeId: "KK061",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV018",
      name: "Olajide Sunday Olawale",
      chassisNumber: "LBFKDMXC2R1327763",
      kekeId: "KK001",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV020",
      name: "Asomuyide Nathaniel Ade",
      chassisNumber: "LBFKDMXC0R1327633",
      kekeId: "KK002",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV021",
      name: "Ridwan Femi Olukotun",
      chassisNumber: "LBFKDMXC3R1328064",
      kekeId: "KK003",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV022",
      name: "Lukman Taofeek Opeyemi",
      chassisNumber: "LBFKDMXC3R1327772",
      kekeId: "KK015",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV023",
      name: "Hameed Sunday Adewole",
      chassisNumber: "LBFKDMXC2R1327634",
      kekeId: "KK016",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV024",
      name: "Adeosun Quadir",
      chassisNumber: "LBFKDMXC2R1328217",
      kekeId: "KK017",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV025",
      name: "Jimoh Muritala Olalere",
      chassisNumber: "LBFKDMXC8R1327623",
      kekeId: "KK018",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV026",
      name: "Popoola Kazeem Adekunle",
      chassisNumber: "LBFKDMXCXR1328448",
      kekeId: "KK044",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV027",
      name: "Adeniji Ibraheem Ademola",
      chassisNumber: "LBFKDMXC9R1327789",
      kekeId: "KK045",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV028",
      name: "Adepaju Sunbo",
      chassisNumber: "LBFKDMXC2R1330002",
      kekeId: "KK046",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV029",
      name: "Adeyemo Mudeen Alamu",
      chassisNumber: "LBFKDMXC2R1327467",
      kekeId: "KK047",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV030",
      name: "Etannibi Olufemi",
      chassisNumber: "LBFKDMXC5R1327644",
      kekeId: "KK048",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV031",
      name: "Ogunmodede Samson Olanrewaju",
      chassisNumber: "LBFKDMXC0R1327647",
      kekeId: "KK049",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV032",
      name: "Taiwo Issa Ayomide",
      chassisNumber: "LBFKDMXC9R1328215",
      kekeId: "KK050",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV033",
      name: "Oyedepo Abraji Sarafadeen",
      chassisNumber: "LBFKDMXCXR1327641",
      kekeId: "KK051",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV034",
      name: "Olanrewaju Oluwafemi Anuoluwapo",
      chassisNumber: "LBFKDMXC9R1328070",
      kekeId: "KK052",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV035",
      name: "Nurudeen Akansi Tajudeen",
      chassisNumber: "LBFKDMXC6R1328107",
      kekeId: "KK065",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV036",
      name: "Adeniran Samuel Adedayo",
      chassisNumber: "LBFKDMXC7R1327791",
      kekeId: "KK066",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV037",
      name: "Adedoyin Kabir Adesina",
      chassisNumber: "LBFKDMXC9R1327887",
      kekeId: "KK070",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV038",
      name: "Sabitu Tamiyu Agbomeji",
      chassisNumber: "LBFKDMXC1R1327589",
      kekeId: "KK072",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV039",
      name: "Akinola Abiodun Caleb",
      chassisNumber: "",
      kekeId: "",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
    {
      id: "DRV040",
      name: "Hammed Kamilu Abiodun",
      chassisNumber: "",
      kekeId: "",
      licenseExpiry: "2025-12-31",
      kycStatus: "Complete",
      appUsage: "Active",
    },
];

// Initial state
const initialState: DataState = {
  kekeAssets: initialKekeAssets,
  aggregators: initialAggregators,
  drivers: initialDrivers,
  isLoaded: false,
  activeTab: "overview",
};

// Slice
const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    // Data loading actions
    loadDataFromStorage: (state) => {
      try {
        // Try to load from localStorage
        const storedKekeAssets = localStorage.getItem("kekeAssets");
        const storedAggregators = localStorage.getItem("aggregators");
        const storedDrivers = localStorage.getItem("drivers");

        if (storedKekeAssets) {
          state.kekeAssets = JSON.parse(storedKekeAssets);
        }
        if (storedAggregators) {
          state.aggregators = JSON.parse(storedAggregators);
        }
        if (storedDrivers) {
          state.drivers = JSON.parse(storedDrivers);
        }

        state.isLoaded = true;
      } catch (error) {
        console.error("Failed to load data from storage:", error);
        // Fallback to initial data
        state.kekeAssets = initialKekeAssets;
        state.aggregators = initialAggregators;
        state.drivers = initialDrivers;
        state.isLoaded = true;
      }
    },

    // Navigation actions
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },

    // Keke Asset actions
    addKekeAsset: (state, action: PayloadAction<Omit<KekeAsset, "id">>) => {
      const newId = `KK${String(state.kekeAssets.length + 1).padStart(3, "0")}`;
      const newAsset = { ...action.payload, id: newId };
      state.kekeAssets.push(newAsset);
      
      // Update localStorage
      try {
        localStorage.setItem("kekeAssets", JSON.stringify(state.kekeAssets));
      } catch (error) {
        console.error("Failed to save keke assets to storage:", error);
      }
    },

    updateKekeAsset: (state, action: PayloadAction<KekeAsset>) => {
      const index = state.kekeAssets.findIndex(
        (asset) => asset.id === action.payload.id
      );
      if (index !== -1) {
        state.kekeAssets[index] = action.payload;
        
        // Update localStorage
        try {
          localStorage.setItem("kekeAssets", JSON.stringify(state.kekeAssets));
        } catch (error) {
          console.error("Failed to save keke assets to storage:", error);
        }
      }
    },

    deleteKekeAsset: (state, action: PayloadAction<string>) => {
      state.kekeAssets = state.kekeAssets.filter(
        (asset) => asset.id !== action.payload
      );
      
      // Update localStorage
      try {
        localStorage.setItem("kekeAssets", JSON.stringify(state.kekeAssets));
      } catch (error) {
        console.error("Failed to save keke assets to storage:", error);
      }
    },

    // Aggregator actions
    addAggregator: (state, action: PayloadAction<Omit<Aggregator, "id">>) => {
      const newId = `AGG${String(state.aggregators.length + 1).padStart(3, "0")}`;
      const newAggregator = { ...action.payload, id: newId };
      state.aggregators.push(newAggregator);
      
      // Update localStorage
      try {
        localStorage.setItem("aggregators", JSON.stringify(state.aggregators));
      } catch (error) {
        console.error("Failed to save aggregators to storage:", error);
      }
    },

    updateAggregator: (state, action: PayloadAction<Aggregator>) => {
      const index = state.aggregators.findIndex(
        (agg) => agg.id === action.payload.id
      );
      if (index !== -1) {
        state.aggregators[index] = action.payload;
        
        // Update localStorage
        try {
          localStorage.setItem("aggregators", JSON.stringify(state.aggregators));
        } catch (error) {
          console.error("Failed to save aggregators to storage:", error);
        }
      }
    },

    deleteAggregator: (state, action: PayloadAction<string>) => {
      state.aggregators = state.aggregators.filter(
        (agg) => agg.id !== action.payload
      );
      
      // Update localStorage
      try {
        localStorage.setItem("aggregators", JSON.stringify(state.aggregators));
      } catch (error) {
        console.error("Failed to save aggregators to storage:", error);
      }
    },

    // Driver actions
    addDriver: (state, action: PayloadAction<Omit<Driver, "id">>) => {
      const newId = `DRV${String(state.drivers.length + 1).padStart(3, "0")}`;
      const newDriver = { ...action.payload, id: newId };
      state.drivers.push(newDriver);
      
      // Update localStorage
      try {
        localStorage.setItem("drivers", JSON.stringify(state.drivers));
      } catch (error) {
        console.error("Failed to save drivers to storage:", error);
      }
    },

    updateDriver: (state, action: PayloadAction<Driver>) => {
      const index = state.drivers.findIndex(
        (driver) => driver.id === action.payload.id
      );
      if (index !== -1) {
        state.drivers[index] = action.payload;
        
        // Update localStorage
        try {
          localStorage.setItem("drivers", JSON.stringify(state.drivers));
        } catch (error) {
          console.error("Failed to save drivers to storage:", error);
        }
      }
    },

    deleteDriver: (state, action: PayloadAction<string>) => {
      state.drivers = state.drivers.filter(
        (driver) => driver.id !== action.payload
      );
      
      // Update localStorage
      try {
        localStorage.setItem("drivers", JSON.stringify(state.drivers));
      } catch (error) {
        console.error("Failed to save drivers to storage:", error);
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