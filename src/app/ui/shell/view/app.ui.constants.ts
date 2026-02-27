export const DAY = '#85ddf2';
export const NIGHT = '#33377a';
export const BATTLE_BACKGROUND_BASE = 'assets/art/Public/Public/Background/';
export const TOY_ART_BASE = 'assets/art/Public/Public/Toys/';
export type LogFilterTabValue = 'player' | 'opponent' | 'draw' | null;

export const BATTLE_BACKGROUNDS = [
  'AboveCloudsBattle.png',
  'ArcticBattle.png',
  'AutumnForestBattle.png',
  'BeachBattle.png',
  'BridgeBattle.png',
  'CastleWallBattle.png',
  'CaveBattle.png',
  'ColosseumBattle.png',
  'CornFieldBattle.png',
  'DesertBattle.png',
  'DungeonBattle.png',
  'FarmBattle.png',
  'FieldBattle.png',
  'FoodLandBattle.png',
  'FrontYardBattle.png',
  'HalloweenStreetBattle.png',
  'JungleBattle.png',
  'LavaCaveBattle.png',
  'LavaMountainBattle.png',
  'MoneyBinBattle.png',
  'MoonBattle.png',
  'PagodaBattle.png',
  'PlaygroundBattle.png',
  'SavannaBattle.png',
  'ScaryForestBattle.png',
  'SnowBattle.png',
  'SpaceStationBattle.png',
  'UnderwaterBattle.png',
  'UrbanCityBattle.png',
  'WildWestTownBattle.png',
  'WinterPineForestBattle.png',
  'WizardSchoolBattle.png',
] as const;

export const DARK_BATTLE_BACKGROUNDS = [
  'DungeonBattle.png',
  'ScaryForestBattle.png',
] as const;

export const LIGHT_BATTLE_BACKGROUNDS = BATTLE_BACKGROUNDS.filter(
  (background) =>
    !DARK_BATTLE_BACKGROUNDS.includes(
      background as (typeof DARK_BATTLE_BACKGROUNDS)[number],
    ),
) as readonly string[];

export const LOG_FILTER_TABS: ReadonlyArray<{
  label: string;
  value: LogFilterTabValue;
}> = [
  { label: 'None', value: null },
  { label: 'Player', value: 'player' },
  { label: 'Opponent', value: 'opponent' },
  { label: 'Draw', value: 'draw' },
] as const;
