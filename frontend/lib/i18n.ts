// Internationalization configuration
export type Language = 'en' | 'hi' | 'mr';

export interface TranslationKeys {
  // Common
  common: {
    loading: string;
    save: string;
    cancel: string;
    submit: string;
    edit: string;
    delete: string;
    confirm: string;
    yes: string;
    no: string;
    search: string;
    filter: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    select: string;
    upload: string;
    download: string;
    view: string;
    create: string;
    update: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    all: string;
    actions: string;
  };

  // Navigation
  nav: {
    dashboard: string;
    contracts: string;
    wallet: string;
    profile: string;
    logout: string;
    login: string;
    register: string;
  };

  // Authentication
  auth: {
    loginTitle: string;
    registerTitle: string;
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
    role: string;
    farmer: string;
    buyer: string;
    loginButton: string;
    registerButton: string;
    loginSuccess: string;
    registerSuccess: string;
    loginFailed: string;
    registerFailed: string;
    logoutSuccess: string;
    forgotPassword: string;
    rememberMe: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    login: string;
    register: string;
  };

  // Dashboard
  dashboard: {
    welcome: string;
    totalContracts: string;
    activeContracts: string;
    completedContracts: string;
    totalEarnings: string;
    walletBalance: string;
    recentContracts: string;
    quickActions: string;
    createContract: string;
    viewContracts: string;
    manageWallet: string;
    statistics: string;
    noContracts: string;
  };

  // Contracts
  contracts: {
    title: string;
    createNew: string;
    myContracts: string;
    contractDetails: string;
    cropType: string;
    quantity: string;
    price: string;
    totalValue: string;
    deliveryDate: string;
    status: string;
    farmer: string;
    buyer: string;
    terms: string;
    milestones: string;
    addMilestone: string;
    description: string;
    photo: string;
    signContract: string;
    completeContract: string;
    pending: string;
    signed: string;
    inProgress: string;
    completed: string;
    cancelled: string;
    contractProposal: string;
    proposalCreated: string;
    contractSigned: string;
    paymentReleased: string;
    viewPDF: string;
    downloadPDF: string;
  };

  // Profile
  profile: {
    title: string;
    settings: string;
    personalInfo: string;
    fullName: string;
    phone: string;
    address: string;
    state: string;
    district: string;
    pincode: string;
    farmSize: string;
    businessType: string;
    profilePhoto: string;
    uploadPhoto: string;
    updateProfile: string;
    profileUpdated: string;
    photoUploaded: string;
  };

  // Wallet
  wallet: {
    title: string;
    balance: string;
    addFunds: string;
    withdraw: string;
    transactions: string;
    recentTransactions: string;
    transactionHistory: string;
    amount: string;
    date: string;
    type: string;
    credit: string;
    debit: string;
    pending: string;
    completed: string;
    failed: string;
    noTransactions: string;
  };

  // Forms
  forms: {
    required: string;
    invalidEmail: string;
    passwordTooShort: string;
    passwordMismatch: string;
    invalidPhone: string;
    invalidPincode: string;
    selectOption: string;
    enterValue: string;
    chooseFile: string;
    maxFileSize: string;
    allowedFormats: string;
  };

  // Messages
  messages: {
    contractCreated: string;
    contractSigned: string;
    contractCompleted: string;
    milestoneAdded: string;
    profileUpdated: string;
    photoUploaded: string;
    paymentProcessed: string;
    operationFailed: string;
    networkError: string;
    unauthorized: string;
    notFound: string;
    serverError: string;
  };

  // Crops and Categories
  crops: {
    rice: string;
    wheat: string;
    corn: string;
    barley: string;
    tomato: string;
    potato: string;
    onion: string;
    cotton: string;
    sugarcane: string;
    soybean: string;
  };

  // Units
  units: {
    kg: string;
    quintal: string;
    ton: string;
    pieces: string;
    liters: string;
  };

  // States
  states: {
    maharashtra: string;
    karnataka: string;
    tamilNadu: string;
    gujarat: string;
    rajasthan: string;
    punjab: string;
    haryana: string;
    uttarPradesh: string;
    madhyaPradesh: string;
    westBengal: string;
  };

  // Chatbot
  chatbot: {
    title: string;
    subtitle: string;
    placeholder: string;
    welcome: string;
    welcomeDesc: string;
    chat: string;
    advice: string;
    market: string;
    contract: string;
    farmingAdvice: string;
    marketInsights: string;
    contractAdvice: string;
    cropType: string;
    location: string;
    season: string;
    quantity: string;
    currentSeason: string;
    kharif: string;
    rabi: string;
    zaid: string;
    getFarmingAdvice: string;
    getMarketInsights: string;
    getContractAdvice: string;
    gettingAdvice: string;
    gettingInsights: string;
    clearChat: string;
    clearChatConfirm: string;
    chatCleared: string;
    failedToClear: string;
    failedToSend: string;
    failedToGetAdvice: string;
    failedToGetInsights: string;
    failedToGetContractAdvice: string;
  };
}

// Default language
export const DEFAULT_LANGUAGE: Language = 'en';

// Get browser language
export const getBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const browserLang = navigator.language.split('-')[0];
  return ['en', 'hi', 'mr'].includes(browserLang) ? browserLang as Language : DEFAULT_LANGUAGE;
};

// Language storage key
export const LANGUAGE_STORAGE_KEY = 'krishisetu-language';