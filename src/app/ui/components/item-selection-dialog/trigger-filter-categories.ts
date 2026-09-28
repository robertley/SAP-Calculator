// Presentation ordering for the selection dialog trigger filters.
export const TRIGGER_DISPLAY_ORDER: Readonly<Record<string, number>> = {
  // Normal Order (Pre-removal)
  // Level up events
  ThisLeveledUp: 1,
  FriendLeveledUp: 2,
  FriendlyLeveledUp: 2,
  // Hurt events
  ThisHurt: 3,
  FriendHurt: 4,
  EnemyHurt: 4,
  AnyoneHurt: 4,
  FriendAheadHurt: 4,
  AnyoneBehindHurt: 4,

  // Mana events
  ThisGainedMana: 5,

  // Summon events
  ThisSummoned: 6,
  FriendSummoned: 7,
  EnemySummoned: 7,
  BeeSummoned: 7,

  // Movement events
  EnemyPushed: 8,
  FriendJumped: 8,
  AnyoneJumped: 8,

  // Pre-Removal Faint events
  Faint: 9,
  FriendAheadFainted: 10,
  FriendFaints: 11,
  EnemyFaint: 11,

  // Kill events (post-removal ordering)
  KnockOut: 13,

  // Transform events
  ThisTransformed: 14,
  FriendTransformed: 15,

  // Experience events
  FriendGainedExp: 16,

  // Food events
  FoodEatenByThis: 17,
  FoodEatenByFriendly: 17,
  AppleEatenByThis: 17,
  CornEatenByFriend: 17,

  // Counter events (numbered triggers share CounterEvent priority)
  CounterEvent: 18,

  // Lost perk events
  FriendLostPerk: 19,
  PetLostPerk: 19,

  // Gained perk events
  ThisGainedPerk: 20,
  FriendlyGainsPerk: 21,
  FriendlyGainedStrawberry: 21,

  // Ailment events
  ThisGainedAilment: 20,
  FriendGainsAilment: 21,
  EnemyGainedAilment: 21,
  AnyoneGainedAilment: 21,

  AnyoneFlung: 22,

  // Mana snipe (pre-removal)
  ManaSnipe: 23,

  // Normal Order (Post-removal)
  // These are only processed after fainted pets are removed.
  PostRemovalFaint: 25,
  PostRemovalFriendFaints: 26,
  FriendlyToyBroke: 26,

  // Post-removal board cleanup
  EmptyFrontSpace: 27,

  // Special summons
  GoldenRetrieverSummons: 28,

  // Before-attack phase order. Phase execution filters these ahead of normal
  // events; these values define the order within that phase.
  BeforeThisAttacks: 30,
  BeforeFirstAttack: 30,
  BeforeFriendAttacks: 31,
  BeforeFriendlyAttack: 31,
  BeforeAdjacentFriendAttacked: 31,

  // After-attack phase order. The attacker's own "After attack" ability must
  // resolve before all abilities observing another pet's attack. Those
  // observers share one group before normal-order events resume.
  ThisAttacked: 30,
  ThisFirstAttack: 30,
  FriendAttacked: 31,
  FriendAheadAttacked: 31,
  FriendlyAttacked: 31,
  AdjacentFriendAttacked: 31,
  AnyoneAttack: 31,
  EnemyAttacked: 31,
};

// Phase labels.

export const PHASE_TRIGGERS: ReadonlyArray<string> = [
  'BeforeStartBattle',
  'StartBattle',
];

// Attack trigger labels.
export const ATTACK_TRIGGERS: ReadonlyArray<string> = [
  'BeforeFriendlyAttack',
  'BeforeThisAttacks',
  'BeforeFirstAttack',
  'BeforeFriendAttacks',
  'BeforeAdjacentFriendAttacked',
  'AnyoneAttack',
  'EnemyAttacked',
  'EnemyAttacked2',
  'EnemyAttacked5',
  'EnemyAttacked7',
  'EnemyAttacked8',
  'FriendlyAttacked',
  'FriendlyAttacked5',
  'FriendAttacked',
  'FriendAheadAttacked',
  'AdjacentFriendAttacked',
  'ThisAttacked',
  'ThisFirstAttack',
];

// In-shop triggers (handled by shop/buy/sell/roll logic).
export const IN_SHOP_TRIGGERS: ReadonlyArray<string> = [
  'ShopUpgrade',
  'StartTurn',
  'SpecialEndTurn',
  'Roll',
  'Roll3',
  'EndTurn',
  'ThisSold',
  'ThisBought',
  'FriendSold',
  'FriendBought',
  'Tier1FriendBought',
  'SpendGold',
  'SpendGold7',
  'FoodBought',
  'Eat',
  'Eat2',
];

