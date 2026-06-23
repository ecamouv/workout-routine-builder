export interface WeightComparison {
    minLb: number;
    label: string;
    descriptionLb: string;
    descriptionKg: string;
  }
  
  // Intervals: 0-1000 every 100lb, 1001-9999 every 1000lb, 10000+ every 5000lb. Hard limit 99,999lb.
  export const weightComparisons: WeightComparison[] = [
    {
      minLb: 0,
      label: 'Getting started',
      descriptionLb: "You're just getting started. Every pound counts.",
      descriptionKg: "You're just getting started. Every kilogram counts.",
    },
    {
      minLb: 100,
      label: 'A large dog',
      descriptionLb: "You've lifted the weight of a large Labrador Retriever — about 100 lb.",
      descriptionKg: "You've lifted the weight of a large Labrador Retriever — about 45 kg.",
    },
    {
      minLb: 200,
      label: 'A giant panda',
      descriptionLb: "You've lifted the weight of a giant panda — about 200 lb.",
      descriptionKg: "You've lifted the weight of a giant panda — about 90 kg.",
    },
    {
      minLb: 300,
      label: 'A full-grown male lion',
      descriptionLb: "You've lifted the weight of a full-grown male lion — about 300 lb.",
      descriptionKg: "You've lifted the weight of a full-grown male lion — about 136 kg.",
    },
    {
      minLb: 400,
      label: 'A male grizzly bear',
      descriptionLb: "You've lifted the weight of a male grizzly bear — about 400 lb.",
      descriptionKg: "You've lifted the weight of a male grizzly bear — about 180 kg.",
    },
    {
      minLb: 500,
      label: 'A grand piano',
      descriptionLb: "You've lifted the weight of a concert grand piano — about 500 lb.",
      descriptionKg: "You've lifted the weight of a concert grand piano — about 227 kg.",
    },
    {
      minLb: 600,
      label: 'A Harley-Davidson motorcycle',
      descriptionLb: "You've lifted the weight of a Harley-Davidson Road King — about 600 lb.",
      descriptionKg: "You've lifted the weight of a Harley-Davidson Road King — about 272 kg.",
    },
    {
      minLb: 700,
      label: 'A male polar bear',
      descriptionLb: "You've lifted the weight of a male polar bear — about 700 lb.",
      descriptionKg: "You've lifted the weight of a male polar bear — about 317 kg.",
    },
    {
      minLb: 800,
      label: 'A dairy cow',
      descriptionLb: "You've lifted the weight of a dairy cow — about 800 lb.",
      descriptionKg: "You've lifted the weight of a dairy cow — about 363 kg.",
    },
    {
      minLb: 900,
      label: 'A small racehorse',
      descriptionLb: "You've lifted the weight of a small racehorse — about 900 lb.",
      descriptionKg: "You've lifted the weight of a small racehorse — about 408 kg.",
    },
    {
      minLb: 1000,
      label: 'A full-grown horse',
      descriptionLb: "You've lifted the weight of a full-grown horse — about 1,000 lb.",
      descriptionKg: "You've lifted the weight of a full-grown horse — about 454 kg.",
    },
    {
      minLb: 2000,
      label: 'A Smart car',
      descriptionLb: "You've lifted the weight of a Smart Fortwo — about 2,000 lb.",
      descriptionKg: "You've lifted the weight of a Smart Fortwo — about 907 kg.",
    },
    {
      minLb: 3000,
      label: 'A white rhinoceros',
      descriptionLb: "You've lifted the weight of a white rhinoceros — about 3,000 lb.",
      descriptionKg: "You've lifted the weight of a white rhinoceros — about 1,360 kg.",
    },
    {
      minLb: 4000,
      label: 'A hippopotamus',
      descriptionLb: "You've lifted the weight of a hippopotamus — about 4,000 lb.",
      descriptionKg: "You've lifted the weight of a hippopotamus — about 1,814 kg.",
    },
    {
      minLb: 5000,
      label: 'A large SUV',
      descriptionLb: "You've lifted the weight of a fully loaded large SUV — about 5,000 lb.",
      descriptionKg: "You've lifted the weight of a fully loaded large SUV — about 2,268 kg.",
    },
    {
      minLb: 6000,
      label: 'A male giraffe',
      descriptionLb: "You've lifted the weight of a male giraffe — about 6,000 lb. Neck and all.",
      descriptionKg: "You've lifted the weight of a male giraffe — about 2,722 kg. Neck and all.",
    },
    {
      minLb: 7000,
      label: 'A Ford F-250 pickup truck',
      descriptionLb: "You've lifted the weight of a Ford F-250 Super Duty — about 7,000 lb.",
      descriptionKg: "You've lifted the weight of a Ford F-250 Super Duty — about 3,175 kg.",
    },
    {
      minLb: 8000,
      label: 'An adult male elephant (Asian)',
      descriptionLb: "You've lifted the weight of an adult male Asian elephant — about 8,000 lb.",
      descriptionKg: "You've lifted the weight of an adult male Asian elephant — about 3,629 kg.",
    },
    {
      minLb: 9000,
      label: 'A school bus (empty)',
      descriptionLb: "You've lifted the weight of an empty school bus — about 9,000 lb.",
      descriptionKg: "You've lifted the weight of an empty school bus — about 4,082 kg.",
    },
    {
      minLb: 10000,
      label: 'An adult African elephant',
      descriptionLb: "You've lifted the weight of an adult African elephant — about 10,000 lb. Legendary.",
      descriptionKg: "You've lifted the weight of an adult African elephant — about 4,536 kg. Legendary.",
    },
    {
      minLb: 15000,
      label: 'A city transit bus',
      descriptionLb: "You've lifted the weight of a full city transit bus — about 15,000 lb.",
      descriptionKg: "You've lifted the weight of a full city transit bus — about 6,804 kg.",
    },
    {
      minLb: 20000,
      label: 'Two African elephants',
      descriptionLb: "You've lifted the weight of two adult African elephants — about 20,000 lb. Unstoppable.",
      descriptionKg: "You've lifted the weight of two adult African elephants — about 9,072 kg. Unstoppable.",
    },
    {
      minLb: 25000,
      label: 'A loaded semi-truck',
      descriptionLb: "You've lifted the weight of a fully loaded semi-truck — about 25,000 lb.",
      descriptionKg: "You've lifted the weight of a fully loaded semi-truck — about 11,340 kg.",
    },
    {
      minLb: 30000,
      label: 'A Sikorsky Black Hawk helicopter',
      descriptionLb: "You've lifted the weight of a Black Hawk helicopter — about 30,000 lb. You're basically the military.",
      descriptionKg: "You've lifted the weight of a Black Hawk helicopter — about 13,608 kg. You're basically the military.",
    },
    {
      minLb: 35000,
      label: 'A regional jet aircraft',
      descriptionLb: "You've lifted the weight of a regional jet aircraft — about 35,000 lb.",
      descriptionKg: "You've lifted the weight of a regional jet aircraft — about 15,876 kg.",
    },
    {
      minLb: 40000,
      label: 'Four full-grown humpback whales',
      descriptionLb: "You've lifted the weight of four humpback whales — about 40,000 lb.",
      descriptionKg: "You've lifted the weight of four humpback whales — about 18,144 kg.",
    },
    {
      minLb: 45000,
      label: 'A Boeing 737 (empty)',
      descriptionLb: "You've lifted the weight of an empty Boeing 737 — about 45,000 lb. You could be an airline.",
      descriptionKg: "You've lifted the weight of an empty Boeing 737 — about 20,412 kg. You could be an airline.",
    },
    {
      minLb: 50000,
      label: 'The Statue of Liberty\'s torch arm',
      descriptionLb: "You've lifted the equivalent of the Statue of Liberty's raised arm and torch — about 50,000 lb.",
      descriptionKg: "You've lifted the equivalent of the Statue of Liberty's raised arm and torch — about 22,680 kg.",
    },
    {
      minLb: 55000,
      label: 'An F/A-18 Super Hornet',
      descriptionLb: "You've lifted the weight of an F/A-18 Super Hornet fighter jet — about 55,000 lb. Top Gun status.",
      descriptionKg: "You've lifted the weight of an F/A-18 Super Hornet fighter jet — about 24,948 kg. Top Gun status.",
    },
    {
      minLb: 60000,
      label: 'Six adult African elephants',
      descriptionLb: "You've lifted the weight of six adult African elephants — about 60,000 lb. You are a force of nature.",
      descriptionKg: "You've lifted the weight of six adult African elephants — about 27,216 kg. You are a force of nature.",
    },
    {
      minLb: 65000,
      label: 'A loaded Abrams M1 tank',
      descriptionLb: "You've lifted the weight of an M1 Abrams battle tank — about 65,000 lb.",
      descriptionKg: "You've lifted the weight of an M1 Abrams battle tank — about 29,484 kg.",
    },
    {
      minLb: 70000,
      label: 'The Liberty Bell times 500',
      descriptionLb: "You've lifted the equivalent of 500 Liberty Bells — about 70,000 lb.",
      descriptionKg: "You've lifted the equivalent of 500 Liberty Bells — about 31,752 kg.",
    },
    {
      minLb: 75000,
      label: 'A blue whale\'s heart, 1,500 times over',
      descriptionLb: "You've lifted 1,500 blue whale hearts — about 75,000 lb. Mythic.",
      descriptionKg: "You've lifted 1,500 blue whale hearts — about 34,020 kg. Mythic.",
    },
    {
      minLb: 80000,
      label: 'The max legal highway truck load (US)',
      descriptionLb: "You've lifted the maximum legal US highway truck payload — about 80,000 lb.",
      descriptionKg: "You've lifted the maximum legal US highway truck payload — about 36,287 kg.",
    },
    {
      minLb: 85000,
      label: 'Eight adult African elephants',
      descriptionLb: "You've lifted the weight of eight adult African elephants — about 85,000 lb. Prehistoric energy.",
      descriptionKg: "You've lifted the weight of eight adult African elephants — about 38,555 kg. Prehistoric energy.",
    },
    {
      minLb: 90000,
      label: 'A space shuttle\'s main engines',
      descriptionLb: "You've lifted the combined weight of a space shuttle's three main engines — about 90,000 lb. You're built different.",
      descriptionKg: "You've lifted the combined weight of a space shuttle's three main engines — about 40,823 kg. You're built different.",
    },
    {
      minLb: 95000,
      label: 'A fully fueled Apollo Saturn V rocket stage',
      descriptionLb: "You've lifted the equivalent of a Saturn V rocket stage — about 95,000 lb. You are the mission.",
      descriptionKg: "You've lifted the equivalent of a Saturn V rocket stage — about 43,091 kg. You are the mission.",
    },
  ];
  
  export function getWeightComparison(totalLb: number): WeightComparison {
    const capped = Math.min(totalLb, 99999);
    const sorted = [...weightComparisons].sort((a, b) => b.minLb - a.minLb);
    return sorted.find(c => capped >= c.minLb) ?? weightComparisons[0];
  }