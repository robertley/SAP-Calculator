import {
  AbilityTrigger,
  NumberedTriggerBase,
} from 'app/domain/entities/ability.class';

// Priority mapping (lower number = higher priority); kept separate from AbilityService to keep that file leaner.
export const ABILITY_PRIORITIES: Readonly<Record<string, number>> = {
  // Normal Order (Pre-removal)
  // Level up events
  ThisLeveledUp: 1, // e.g., pets/unicorn/tier-3/lucky-cat.class
  FriendLeveledUp: 2, // e.g., pets/unicorn/tier-4/cyclops.class
  FriendlyLeveledUp: 2, // e.g., pets/unicorn/tier-2/wyvern.class
  // Hurt events
  ThisHurt: 3, // e.g., pets/turtle/tier-2/peacock.class
  FriendHurt: 4, // e.g., pets/star/tier-2/koala.class
  EnemyHurt: 4, // e.g., pets/star/tier-3/toad.class
  AnyoneHurt: 4, // e.g., pets/custom/tier-3/great-potoo.class
  FriendAheadHurt: 4, // e.g., pets/golden/tier-1/silkmoth.class
  AnyoneBehindHurt: 4, // e.g., pets/danger/tier-3/monkey-faced-bat.class

  // Mana events
  ThisGainedMana: 5, // e.g., pets/unicorn/tier-1/pengobble.class

  // Summon events
  ThisSummoned: 6, // e.g., pets/hidden/salmon.class
  FriendSummoned: 7, // e.g., pets/unicorn/tier-5/amalgamation.class
  EnemySummoned: 7, // e.g., pets/star/tier-2/iguana.class
  BeeSummoned: 7, // e.g., pets/custom/tier-3/queen-bee.class

  // Movement events
  EnemyPushed: 8, // e.g., pets/star/tier-2/iguana.class
  FriendJumped: 8, // e.g., pets/danger/tier-2/araripe-manakin.class
  AnyoneJumped: 8, // e.g., pets/danger/tier-6/philippine-eagle.class

  // Pre-Removal Faint events
  Faint: 9, // e.g., pets/hidden/baby-urchin.class
  FriendFaints: 9, // e.g., pets/unicorn/tier-5/kitsune.class
  FriendAheadFainted: 10, // e.g., pets/unicorn/tier-3/tatzelwurm.class

  // Kill events (post-removal ordering)
  KnockOut: 13, // e.g., pets/turtle/tier-4/hippo.class

  // Transform events
  ThisTransformed: 14, // e.g., pets/hidden/butterfly.class
  FriendTransformed: 15, // e.g., pets/danger/tier-1/ili-pika.class

  // Experience events
  FriendGainedExp: 16, // e.g., pets/unicorn/tier-1/murmel.class

  // Food events
  FoodEatenByThis: 17, // e.g., pets/turtle/tier-5/seal.class
  FoodEatenByFriendly: 17, // e.g., pets/turtle/tier-3/rabbit.class
  AppleEatenByThis: 17, // e.g., pets/custom/tier-4/jerboa.class
  CornEatenByFriend: 17, // e.g., pets/custom/tier-6/chimpanzee.class

  // Counter events (numbered triggers share CounterEvent priority)
  CounterEvent: 18, // e.g., pets/danger/tier-1/bombus-dahlbomii (counter)

  // Lost perk events
  FriendLostPerk: 19, // e.g., pets/star/tier-6/real-velociraptor.class
  PetLostPerk: 19, // e.g., pets/custom/tier-4/yeti-crab.class

  // Gained perk events
  ThisGainedPerk: 20, // e.g., pets/puppy/tier-4/whale-shark.class
  FriendlyGainsPerk: 21, // e.g., pets/puppy/tier-1/ladybug.class
  FriendlyGainedStrawberry: 21, // e.g., pets/star/tier-3/cassowary.class

  // Ailment events
  ThisGainedAilment: 20, // e.g., pets/puppy/tier-4/whale-shark.class
  FriendGainsAilment: 21, // e.g., pets/unicorn/tier-4/unicorn.class
  EnemyGainedAilment: 21, // e.g., pets/unicorn/tier-5/vampire-bat.class
  AnyoneGainedAilment: 21, // e.g., pets/unicorn/tier-2/mothman.class

  AnyoneFlung: 22, // e.g., pets/custom/tier-5/jackal.class

  // Mana snipe (pre-removal)
  ManaSnipe: 23, // e.g., no pet/toy/equipment uses this trigger yet

  // Normal Order (Post-removal)
  // These are only processed after fainted pets are removed.
  PostRemovalFaint: 25, // e.g., pets/hidden/smaller-slug.class
  PostRemovalFriendFaints: 26, // e.g., pets/turtle/tier-5/shark.class
  FriendlyToyBroke: 26, // e.g., pets/puppy/tier-5/mosasaurus.class

  // Post-removal board cleanup
  EmptyFrontSpace: 27, // e.g., pets/unicorn/tier-2/drop-bear.class

  // Special summons
  GoldenRetrieverSummons: 28, // e.g., no pet/toy/equipment uses this trigger yet
};

// Phase triggers (handled by explicit phase filters in AbilityService).
export type TriggerCategory = AbilityTrigger | NumberedTriggerBase;

export const PHASE_TRIGGERS: ReadonlyArray<TriggerCategory> = [
  'BeforeStartBattle',
  'StartBattle',
];

// Attack-based triggers (handled by AttackEventService and phase filters).
export const ATTACK_TRIGGERS: ReadonlyArray<TriggerCategory> = [
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
export const IN_SHOP_TRIGGERS: ReadonlyArray<TriggerCategory> = [
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

// Utility getter for external code that prefers a typed lookup signature.
export const getAbilityPriority = (
  trigger: AbilityTrigger,
): number | undefined => ABILITY_PRIORITIES[trigger];



