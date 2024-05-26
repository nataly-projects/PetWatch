const PetSpecies = Object.freeze({
    MALE: 'MALE',
    FEMALE: 'FEMALE',
});

const ActivityType = Object.freeze({
    VACCINE_RECORD:'Vaccine Record',
    ROUTINE_CARE:'Routine Care',
    EXPENSE:'Expense',
    ALLERGY:'Allergy',
    MEDICATION:'Medication',
    VET_VISIT:'Vet Visit',
    NOTE:'Note',
    WEIGHT: 'Weight',
    MEAL_PLANNER: 'Meal Planner'
  });

const VaccineRecordType = Object.freeze({
    DHPP: 'DHPP',
    RABIES: 'Rabies',
    VACCINATION_AGAINST_ESOPHAGUS_WORMS: 'Vaccination against Esophagus Worms',
    FLEA_AND_TICK: 'Flea and Tick Treatment',
    DEWORMING: 'Deworming',

    FVRCP: 'FVRCP',
    FELV: 'FeLV',
    OTHER: 'Other'
});

const ExpenseCategory = Object.freeze({
    FOOD: 'Food',
    MEDICATION: 'Medication',
    VACCINATION: 'vaccinations',
    VET_VISIT: 'VetVisit',
    INSURANCE: 'Insurance',
    ROUTINE_CARE: 'Routine Care',
    TOYS: 'Toyes',
    RELATED_PRODUCTS: 'Related Products',
    HOME_PROUSUCTS: 'Home Products',
    TRAINING: 'Training',
    OTHER: 'Other'
});

const RoutineCareActivity = Object.freeze({
    FEEDING: 'Feeding',
    TRAINING: 'Training',
    BRUSHING: 'Brushing',
    BATHING: 'Bathing',
    NAIL_TRIMMING: 'Nail trimming',
    EAR_CLEANING: 'Ear cleaning',
    TEETH_BRUSING: 'Teeth brushing',
    WEIGHING: 'Weighing',
    OTHER: 'Other'
});

const ActivityLogType = Object.freeze({
    VACCINE_RECORD_ADDED: 'vaccine record added',
    ROUTINE_CARE_ADDED: 'routine care added',
    EXPENSE_ADDED: 'expense added',
    ALLERGY_ADDED: 'allergy added',
    ALLERGY_EDIT: 'allergy edit',
    ALLERGY_DELETE: 'allergy delete',
    MEDICATION_ADDED: 'medication added',
    MEDICATION_EDIT: 'medication edit',
    MEDICATION_DELETE: 'medication delete',
    VET_VISIT_ADDED: 'vet visit added',
    VET_VISIT_EDIT: 'vet visit edit',
    VET_VISIT_DELETE: 'vet visit delete',
    NOTE_ADDED: 'note added',
    PET_ADDED: 'pet added',
    PET_EDIT: 'pet edit',
    PET_WEIGHT_UPDATE: 'pet weight update',
    PET_DELETE: 'pet delete',
    NOTE_EDIT: 'note edit' ,
    NOTE_DELETE: 'note delete' ,
    PROFILE_EDIT: 'profile edit',
    MEAL_PLANNER_ADDED: 'meal planner added',
    MEAL_PLANNER_EDIT: 'meal planner edit',
    MEAL_PLANNER_DELETE: 'meal planner delete',
    EMERGENCT_CONTACT_ADDED: 'emergency contact added',
    EMERGENCT_CONTACT_EDIT: 'emergency contact edit',
    EMERGENCT_CONTACT_DELETE: 'emergency contact delete'
});

const Currency = Object.freeze({
    USD: 'USD',
    EUR: 'EUR',
    GBP: 'GBP',
    JPY: 'JPY',
    CAD: 'CAD',
    AUD: 'AUD',
    CHF: 'CHF',
    CNY: 'CNY',
    SEK: 'SEK',
    NZD: 'NZD',
    SGD: 'SGD',
    HKD: 'HKD',
    NOK: 'NOK',
    KRW: 'KRW',
    INR: 'INR',
    RUB: 'RUB',
    BRL: 'BRL',
    ZAR: 'ZAR',
    MXN: 'MXN',
    TRY: 'TRY',
    AED: 'AED',
    SAR: 'SAR',
    PLN: 'PLN',
    THB: 'THB',
    DKK: 'DKK',
    IDR: 'IDR',
    MYR: 'MYR',
    HUF: 'HUF',
    CZK: 'CZK',
    CLP: 'CLP',
    PHP: 'PHP',
    ILS: 'ILS',
    PKR: 'PKR',
    EGP: 'EGP',
    KWD: 'KWD',
    QAR: 'QAR',
    VND: 'VND',
});

const muletrImageOptions = Object.freeze({
    PET_PROFILE_IMAGE: 'image',
    PET_ADIITIONAL_IMAGE: 'additionalImages',
});
  
  
module.exports = {
    PetSpecies, 
    ActivityType,
    VaccineRecordType,
    ExpenseCategory,
    RoutineCareActivity,
    ActivityLogType,
    Currency 

};

