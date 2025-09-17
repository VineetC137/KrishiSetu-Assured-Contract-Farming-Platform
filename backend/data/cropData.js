const maharashtraCrops = {
  crops: {
    cereals: [
      'Rice (Basmati)', 'Rice (Non-Basmati)', 'Wheat', 'Jowar (Sorghum)', 
      'Bajra (Pearl Millet)', 'Maize (Corn)', 'Ragi (Finger Millet)'
    ],
    pulses: [
      'Tur (Arhar)', 'Moong (Green Gram)', 'Urad (Black Gram)', 
      'Chana (Chickpea)', 'Masoor (Lentil)', 'Kulith (Horse Gram)'
    ],
    oilseeds: [
      'Soybean', 'Sunflower', 'Groundnut', 'Safflower', 'Sesame', 'Niger'
    ],
    cash_crops: [
      'Sugarcane', 'Cotton', 'Tobacco', 'Turmeric', 'Ginger'
    ],
    vegetables: [
      'Onion', 'Potato', 'Tomato', 'Brinjal', 'Okra (Bhindi)', 
      'Cabbage', 'Cauliflower', 'Carrot', 'Radish', 'Beetroot',
      'Cucumber', 'Bottle Gourd', 'Ridge Gourd', 'Bitter Gourd',
      'Pumpkin', 'Green Chilli', 'Capsicum', 'Spinach', 'Fenugreek'
    ],
    fruits: [
      'Mango', 'Banana', 'Orange', 'Sweet Lime', 'Pomegranate', 
      'Grapes', 'Papaya', 'Guava', 'Custard Apple', 'Fig',
      'Watermelon', 'Muskmelon', 'Coconut', 'Jackfruit'
    ],
    spices: [
      'Chilli', 'Coriander', 'Cumin', 'Fenugreek', 'Mustard',
      'Turmeric', 'Ginger', 'Garlic', 'Black Pepper'
    ]
  },
  livestock: {
    cattle: [
      'Gir Cow', 'Sahiwal Cow', 'Red Sindhi Cow', 'Deoni Cow',
      'Khillari Bull', 'Murrah Buffalo', 'Mehsana Buffalo'
    ],
    goat_sheep: [
      'Osmanabadi Goat', 'Sangamneri Goat', 'Berari Goat',
      'Deccani Sheep', 'Madgyal Sheep'
    ],
    other: [
      'Rabbit', 'Fish (Rohu)', 'Fish (Catla)', 'Prawns'
    ]
  },
  poultry: {
    chicken: [
      'Broiler Chicken', 'Layer Chicken', 'Desi Chicken', 'Kadaknath Chicken'
    ],
    other_birds: [
      'Duck', 'Turkey', 'Quail', 'Guinea Fowl', 'Emu', 'Ostrich'
    ],
    eggs: [
      'Chicken Eggs', 'Duck Eggs', 'Quail Eggs', 'Turkey Eggs'
    ]
  },
  dairy: [
    'Cow Milk', 'Buffalo Milk', 'Goat Milk', 'Paneer', 'Ghee', 'Curd'
  ]
};

const milestoneStages = {
  crops: [
    'Land Preparation',
    'Sowing/Planting', 
    'Germination',
    'Vegetative Growth',
    'Flowering',
    'Fruit Development',
    'Maturation',
    'Harvesting',
    'Post-Harvest Processing'
  ],
  livestock: [
    'Breeding/Procurement',
    'Early Growth',
    'Feeding & Care',
    'Health Monitoring',
    'Weight Gain',
    'Pre-Market Preparation',
    'Market Ready',
    'Delivery'
  ],
  poultry: [
    'Chick Procurement',
    'Brooding Stage',
    'Growing Stage',
    'Feeding Management',
    'Health Monitoring',
    'Weight Monitoring',
    'Pre-Market Preparation',
    'Market Ready'
  ],
  dairy: [
    'Animal Selection',
    'Feeding Management',
    'Milking Schedule',
    'Quality Testing',
    'Processing',
    'Packaging',
    'Quality Assurance',
    'Delivery'
  ]
};

module.exports = { maharashtraCrops, milestoneStages };