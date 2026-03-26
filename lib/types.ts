// Label types for storefront annotation

export type Step1AVisibility = "NOT_A_STOREFRONT" | "OBSTRUCTED_VIEW" | "STOREFRONT_VISIBLE" | null;

export type GasStationOverride = "YES" | "NO" | null;

export type ObstructionType =
  | "VEHICLE"
  | "TREE_POLE"
  | "CROPPING_OUT_OF_FRAME"
  | "GLARE_REFLECTION"
  | "DARKNESS"
  | "BLUR"
  | "WEATHER"
  | "LOW_RESOLUTION"
  | "CROWD"
  | "OTHER"
  | "NONE"
  | null;

export type Step1BRouting =
  | "G52_BUILDING_HARDWARE_GARDEN_MOBILEHOME"
  | "G53_GENERAL_MERCH_DEPARTMENT"
  | "G54_FOOD_STORES"
  | "G55_AUTO_DEALERS_GAS"
  | "G56_APPAREL_SHOES_ACCESSORIES"
  | "G57_FURNITURE_FURNISHINGS_ELECTRONICS_MUSIC"
  | "G58_EATING_DRINKING"
  | "G59_OTHER_SPECIALTY_RETAIL"
  | "G70_LODGING"
  | "G72_PERSONAL_SERVICES"
  | "G75_AUTO_REPAIR_RENTAL_PARKING"
  | "G76_MISC_REPAIR_SERVICES"
  | "G78_MOTION_PICTURES"
  | "G79_AMUSEMENT_RECREATION"
  | "G84_MUSEUMS_GALLERIES_GARDENS"
  | "G86_MEMBERSHIP_ORGANIZATIONS"
  | "UNCERTAIN_INSUFFICIENT_EVIDENCE"
  | "OTHER_OUTSIDE_SCHEMA"
  | null;

// Subcategory types for detailed business classification
export type BusinessSubcategory = string | null;

// Subcategory options organized by main category
export const SUBCATEGORY_OPTIONS: Record<string, { value: string; label: string }[]> = {
  G54_FOOD_STORES: [
    { value: "MEAT_FISH_MARKET", label: "Meat or fish market" },
    { value: "FRUIT_VEGETABLE_MARKET", label: "Fruit or vegetable market" },
    { value: "BAKERY", label: "Bakery" },
    { value: "CONVENIENCE_STORE", label: "Convenience store" },
    { value: "GROCERY_STORE", label: "Grocery store" },
    { value: "HEALTH_VITAMIN_STORE", label: "Health or vitamin store" },
    { value: "OTHER_FOOD_STORE", label: "Other food store" },
  ],
  G55_AUTO_DEALERS_GAS: [
    { value: "USED_VEHICLE_DEALERS", label: "Motor vehicle dealers with used vehicles only" },
    { value: "NEW_USED_VEHICLE_DEALERS", label: "Motor vehicle dealers (new and used vehicles)" },
    { value: "OTHER_DEALERS_AUTO_PARTS", label: "Other dealers or auto parts" },
  ],
  G56_APPAREL_SHOES_ACCESSORIES: [
    { value: "SHOE_STORES", label: "Shoe stores" },
    { value: "CLOTHING_ACCESSORY_STORES", label: "Clothing or accessory stores" },
  ],
  G57_FURNITURE_FURNISHINGS_ELECTRONICS_MUSIC: [
    { value: "FURNITURE_STORES", label: "Furniture stores" },
    { value: "FURNISHING_STORES", label: "Furnishing stores (floor, curtain, upholstery, other)" },
    { value: "ELECTRONICS_APPLIANCES", label: "Electronics and appliances (household appliances, TV and other electronics, computer/software stores)" },
    { value: "MUSIC_RELATED_STORES", label: "Music related stores (instruments, records, others)" },
  ],
  G58_EATING_DRINKING: [
    // Eating subcategories
    { value: "COFFEE_SHOP", label: "Coffee shop" },
    { value: "PIZZA", label: "Pizza" },
    { value: "FAST_FOOD", label: "Fast food restaurant" },
    { value: "DINER_FAMILY_RESTAURANT", label: "Diner, family restaurant" },
    { value: "RESTAURANT_AMERICAN_STEAK_BBQ", label: "Restaurant - American, steak, barbeque" },
    { value: "RESTAURANT_CHINESE", label: "Restaurant - Chinese" },
    { value: "RESTAURANT_KOREAN_JAPANESE_SUSHI", label: "Restaurant - Korean, Japanese, Sushi" },
    { value: "RESTAURANT_GREEK", label: "Restaurant - Greek" },
    { value: "RESTAURANT_ITALIAN", label: "Restaurant - Italian" },
    { value: "RESTAURANT_FRENCH", label: "Restaurant - French" },
    { value: "RESTAURANT_INDIAN_PAKISTANI", label: "Restaurant - Indian, Pakistani" },
    { value: "RESTAURANT_THAI_VIETNAMESE", label: "Restaurant - Thai, Vietnamese" },
    { value: "RESTAURANT_MEXICAN_LATIN", label: "Restaurant - Mexican, Latin American" },
    { value: "RESTAURANT_LEBANESE_MIDDLE_EASTERN", label: "Restaurant - Lebanese, Middle Eastern" },
    { value: "ICE_CREAM_SHOP", label: "Ice cream shop" },
    { value: "OTHER_EATING", label: "Other eating establishment" },
    // Drinking subcategories
    { value: "BAR", label: "Bar" },
    { value: "BREWERY", label: "Brewery" },
    { value: "WINE_BAR", label: "Wine bar" },
    { value: "NIGHTCLUB", label: "Nightclub" },
    { value: "OTHER_DRINKING", label: "Other drinking establishment" },
  ],
  G59_OTHER_SPECIALTY_RETAIL: [
    { value: "DRUG_STORES_PROPRIETARY", label: "Drug Stores and Proprietary Stores" },
    { value: "LIQUOR_STORES", label: "Liquor Stores" },
    { value: "USED_MERCHANDISE_STORES", label: "Used Merchandise Stores" },
    { value: "SPORTING_GOODS_BICYCLE", label: "Sporting Goods Stores and Bicycle Shops" },
    { value: "BOOK_STORES", label: "Book Stores" },
    { value: "JEWELRY_STORES", label: "Jewelry Stores" },
    { value: "FLORISTS", label: "Florists" },
    { value: "OPTICAL_GOODS_STORES", label: "Optical Goods Stores" },
    { value: "TOBACCO_STORES", label: "Tobacco Stores and Stands" },
    { value: "GIFT_HOBBY_TOY_SOUVENIR_GAME_STATIONARY", label: "Gift, hobby, toy, souvenir, game, stationary" },
    { value: "OTHER_STOREFRONT_RETAIL", label: "Other storefront retail (Camera, Luggage, Sewing, News Dealers)" },
    { value: "OTHER_SPECIALTY_RETAIL", label: "Other specialty retail" },
  ],
  G72_PERSONAL_SERVICES: [
    { value: "LAUNDRY_DRYCLEANING", label: "Laundry, drycleaning, other cleaning services" },
    { value: "HAIR_BARBER_BEAUTY", label: "Hairdressers, barber shop, beauty salon" },
    { value: "OTHER_PERSONAL_SERVICES", label: "Other personal services (funeral, shoe repair, other)" },
  ],
  G79_AMUSEMENT_RECREATION: [
    { value: "FITNESS_GYMS", label: "Physical fitness facilities, gyms" },
    { value: "OTHER_AMUSEMENT_RECREATION", label: "All other amusement and recreation (dance studios, theaters, bowling, golf, amusement parks, etc)" },
  ],
};

export type EvidenceType = "READABLE_TEXT" | "LOGO_BRAND" | "DISTINCTIVE_OBJECTS_LAYOUT";

export type AnnotatorConfidence = "HIGH" | "MEDIUM" | "LOW" | null;

export type MultipleBusiness = "YES" | "NO" | null;

export interface ImageLabel {
  step_1a_visibility: Step1AVisibility;
  gas_station_override: GasStationOverride;
  obstruction_type: ObstructionType;
  step_1b_routing: Step1BRouting;
  business_subcategory: BusinessSubcategory;
  subcategory_other_text: string;
  evidence_type: EvidenceType[];
  brand_name: string;
  notes: string;
  annotator_confidence: AnnotatorConfidence;
  multiple_businesses_visible: MultipleBusiness;
  outside_schema_guess: string;
}

export interface ImageData {
  id: string;
  name: string;
  url: string;
  addressId: string;
}

export interface AddressData {
  id: string;
  name: string;
  displayName: string;
  images: ImageData[];
}

export interface LabelStore {
  [imageId: string]: ImageLabel;
}

export type AddressStatus = "not_started" | "in_progress" | "completed";

// Business metadata from uploaded CSV
export interface BusinessInfo {
  name?: string;
  address?: string;
  type?: string;
  rating?: string;
  status?: string;
  [key: string]: string | undefined; // Allow additional fields
}

export interface BusinessInfoStore {
  [normalizedAddress: string]: BusinessInfo;
}

export interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
  message: string;
}

export const createEmptyLabel = (): ImageLabel => ({
  step_1a_visibility: null,
  gas_station_override: null,
  obstruction_type: null,
  step_1b_routing: null,
  business_subcategory: null,
  subcategory_other_text: "",
  evidence_type: [],
  brand_name: "",
  notes: "",
  annotator_confidence: null,
  multiple_businesses_visible: null,
  outside_schema_guess: "",
});

// Validation logic for determining if an image is fully labeled
export const validateImageLabel = (label: ImageLabel): ValidationResult => {
  const missingFields: string[] = [];
  
  // Step 1A is always required
  if (!label.step_1a_visibility) {
    missingFields.push("Step 1A Visibility");
    return {
      isValid: false,
      missingFields,
      message: "Step 1A Visibility is required"
    };
  }
  
  // If NOT_A_STOREFRONT, gas_station_override is required
  if (label.step_1a_visibility === "NOT_A_STOREFRONT") {
    if (!label.gas_station_override) {
      missingFields.push("Gas Station Override");
    }
    // If gas station YES, Step 1B is required
    if (label.gas_station_override === "YES" && !label.step_1b_routing) {
      missingFields.push("Step 1B Routing");
    }
  }
  
  // If OBSTRUCTED_VIEW, obstruction_type and Step 1B are required
  if (label.step_1a_visibility === "OBSTRUCTED_VIEW") {
    if (!label.obstruction_type || label.obstruction_type === "NONE") {
      missingFields.push("Obstruction Type");
    }
    if (!label.step_1b_routing) {
      missingFields.push("Step 1B Routing");
    }
  }
  
  // If STOREFRONT_VISIBLE, Step 1B is required
  if (label.step_1a_visibility === "STOREFRONT_VISIBLE") {
    if (!label.step_1b_routing) {
      missingFields.push("Step 1B Routing");
    }
  }
  
  // If Step 1B is OTHER_OUTSIDE_SCHEMA, outside_schema_guess is required
  if (label.step_1b_routing === "OTHER_OUTSIDE_SCHEMA" && !label.outside_schema_guess.trim()) {
    missingFields.push("Outside Schema Guess");
  }
  
  // If Step 1B has subcategories available, subcategory is required
  if (label.step_1b_routing && SUBCATEGORY_OPTIONS[label.step_1b_routing]) {
    if (!label.business_subcategory) {
      missingFields.push("Business Subcategory");
    }
    // If subcategory is "Other" type, require text description
    if (label.business_subcategory?.startsWith("OTHER_") && !label.subcategory_other_text.trim()) {
      missingFields.push("Subcategory Description");
    }
  }
  
  // Evidence type is required when Step 1B is shown
  const showStep1B = 
    label.step_1a_visibility === "STOREFRONT_VISIBLE" ||
    label.step_1a_visibility === "OBSTRUCTED_VIEW" ||
    (label.step_1a_visibility === "NOT_A_STOREFRONT" && label.gas_station_override === "YES");
  
  if (showStep1B && label.evidence_type.length === 0) {
    missingFields.push("Evidence Type");
  }
  
  // If LOGO_BRAND evidence is selected, brand_name is required
  if (label.evidence_type.includes("LOGO_BRAND") && !label.brand_name.trim()) {
    missingFields.push("Brand Name");
  }
  
  // Annotator confidence is always required
  if (!label.annotator_confidence) {
    missingFields.push("Annotator Confidence");
  }
  
  // Multiple businesses visible is always required
  if (!label.multiple_businesses_visible) {
    missingFields.push("Multiple Businesses Visible");
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
    message: missingFields.length > 0 
      ? `Missing: ${missingFields.join(", ")}`
      : "Complete"
  };
};

// Check if all images in dataset are fully labeled
export const validateAllLabels = (
  addresses: AddressData[], 
  labels: LabelStore
): { isValid: boolean; incompleteImages: { address: string; image: string; missing: string[] }[] } => {
  const incompleteImages: { address: string; image: string; missing: string[] }[] = [];
  
  for (const address of addresses) {
    for (const image of address.images) {
      const label = labels[image.id] || createEmptyLabel();
      const validation = validateImageLabel(label);
      
      if (!validation.isValid) {
        incompleteImages.push({
          address: address.displayName,
          image: image.name,
          missing: validation.missingFields
        });
      }
    }
  }
  
  return {
    isValid: incompleteImages.length === 0,
    incompleteImages
  };
};
