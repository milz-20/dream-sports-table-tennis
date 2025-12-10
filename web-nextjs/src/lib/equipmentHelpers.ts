// Helper file to add numerical ratings to blades and rubbers for customization
import { BladeData, RubberData } from '@/components/CustomizeRacket';

// Speed mapping for blades
const speedToNumber = (speed: string): number => {
  const mapping: { [key: string]: number } = {
    'ALL+': 5,
    'ALL': 4,
    'OFF-': 7,
    'OFF': 8,
    'OFF+': 9,
    'OFF++': 10,
  };
  return mapping[speed] || 7;
};

// Convert blade data to include numerical ratings
export const enhanceBladeData = (blade: any): BladeData => {
  const speedNum = speedToNumber(blade.speed || 'OFF');
  
  // Determine play style based on speed and composition
  const playStyle: string[] = [];
  if (speedNum >= 9) {
    playStyle.push('Aggressive', 'Power Looping');
  } else if (speedNum >= 7) {
    playStyle.push('All-Round Offensive', 'Looping');
  } else {
    playStyle.push('Control', 'All-Round');
  }
  
  if (blade.composition?.includes('Carbon') || blade.composition?.includes('ZL')) {
    playStyle.push('Fast Attack');
  } else if (blade.composition?.includes('Wood')) {
    playStyle.push('Touch Play');
  }

  // Calculate control (inverse relationship with speed)
  const control = Math.max(3, 13 - speedNum);
  
  // Calculate stiffness based on composition
  let stiffness = 6;
  if (blade.composition?.includes('Carbon')) stiffness = 8;
  if (blade.composition?.includes('ZL')) stiffness = 7;
  if (blade.composition?.includes('ALC') || blade.composition?.includes('Arylate')) stiffness = 7;
  if (blade.composition?.includes('7 Wood')) stiffness = 5;

  return {
    id: blade.id,
    name: blade.name,
    brand: blade.brand || 'Unknown',
    price: blade.price,
    image: blade.image,
    speed: speedNum,
    control: control,
    stiffness: stiffness,
    weight: 85, // Default weight
    composition: blade.composition || 'N/A',
    playStyle: playStyle,
  };
};

// Convert rubber data to include numerical ratings
export const enhanceRubberData = (rubber: any): RubberData => {
  // Determine speed based on type and hardness
  let speed = 7;
  const isTensor = rubber.type?.includes('Tensioned');
  const hardnessNum = parseInt(rubber.hardness) || 40;
  
  if (isTensor) {
    if (hardnessNum >= 47) speed = 9;
    else if (hardnessNum >= 40) speed = 8;
    else speed = 7;
  } else {
    if (hardnessNum >= 40) speed = 6;
    else speed = 5;
  }
  
  // Special cases for known rubbers
  if (rubber.name.includes('Dignics')) speed = Math.min(10, speed + 1);
  if (rubber.name.includes('Tenergy 05')) speed = 9;
  if (rubber.name.includes('Tenergy 80')) speed = 9;
  if (rubber.name.includes('Tenergy 64')) speed = 8;
  if (rubber.name.includes('Rozena')) speed = 6;
  if (rubber.name.includes('Sriver')) speed = 5;
  if (rubber.name.includes('Mark V')) speed = 5;
  
  // Determine spin
  let spin = 7;
  if (rubber.arc?.includes('High Arc')) spin = 9;
  else if (rubber.arc?.includes('Medium-High')) spin = 8;
  else if (rubber.arc?.includes('Medium Arc')) spin = 7;
  else if (rubber.arc?.includes('Low-Medium')) spin = 6;
  
  // Special spin cases
  if (rubber.name.includes('Tenergy 05') || rubber.name.includes('Dignics 05')) spin = 10;
  if (rubber.name.includes('Powergrip') || rubber.name.includes('Bluestorm')) spin = 9;
  if (rubber.name.includes('V15 Extra')) spin = 9;
  
  // Control (inverse of speed + spin)
  const control = Math.max(3, Math.min(10, 20 - speed - Math.floor(spin / 2)));
  
  // Play style
  const playStyle: string[] = [];
  if (speed >= 9) playStyle.push('Aggressive', 'Power Looping');
  if (spin >= 9) playStyle.push('Spin-Oriented', 'Looping');
  if (control >= 7) playStyle.push('All-Round', 'Control');
  if (speed >= 8 && spin >= 8) playStyle.push('Offensive');
  if (control >= 8) playStyle.push('Touch Play');
  
  return {
    id: rubber.id,
    name: rubber.name,
    price: rubber.price,
    image: rubber.image,
    speed: speed,
    spin: spin,
    control: control,
    hardness: rubber.hardness || 'N/A',
    type: rubber.type || 'Inverted',
    playStyle: playStyle,
  };
};
