import { AbilityTrigger } from '../../classes/ability.class';

// Priority mapping (lower number = higher priority); kept separate from AbilityService to keep that file leaner.
export const ABILITY_PRIORITIES: Readonly<Record<string, number>> = {
  // Battle start events
  BeforeStartBattle: 0,
  StartBattle: 0.1,

  // Level up events
  ThisLeveledUp: 1,
  FriendLeveledUp: 2,
  FriendlyLeveledUp: 2,
  AnyLeveledUp: 2,

  // Hurt events
  ThisHurt: 3,
  FriendHurt: 4,
  EnemyHurt: 4,
  AnyoneHurt: 4,
  FriendAheadHurt: 4,
  AdjacentFriendsHurt: 4,
  AnyoneBehindHurt: 4,
  // "EnemyHurtOrPushed": 4,
  // "FriendHurtOrFaint": 4,
  // "ThisHurtOrFaint": 4,

  // Mana events
  ThisGainedMana: 5,

  // Summon events
  ThisSummoned: 6,
  // "ThisSummonedLate": 6,
  FriendSummoned: 7,
  EnemySummoned: 7,
  // "OtherSummoned": 7,
  BeeSummoned: 7,
  // "CompositeEnemySummonedOrPushed": 7,

  // Movement events
  EnemyPushed: 8,
  FriendJumped: 8,
  AnyoneJumped: 8,
  // "FriendJumpedOrTransformed": 8,

  // Death/Faint events
  BeforeThisDies: 9,
  KitsuneFriendDies: 9,
  // "ThisDiesForPerks": 9,
  FriendAheadDied: 10,
  // "ThisDied": 11, // Moved to 26 to handle post-removal
  // "FriendDied": 12, // Moved to 26
  // "AdjacentFriendsDie": 12, // Moved to 26
  // "EnemyDied": 12, // Moved to 26
  // "EnemyFaint": 12, // Moved to 26
  // "PetDied": 12, // Moved to 26
  // "AllEnemiesDied": 12,
  // "AllFriendsFainted": 12,

  // Toy events
  // "FriendlyToyBroke": 12, // Moved to 26
  // "ToyBroke": 12,
  // "ThisBroke": 12,
  // "ToySummoned": 12,
  // "FriendlyToySummoned": 12,
  // "ThisBoughtOrToyBroke": 12,

  // Kill events (post-removal ordering)
  ThisKilled: 26.5,
  ThisKilledEnemy: 26.5,

  // Transform events
  ThisTransformed: 14,
  FriendTransformed: 14.5,
  // "FriendTransformedInBattle": 14.5,
  // "BeforeFriendTransformed": 14.5,

  // Experience events
  // "FriendGainedExperience": 15,
  FriendGainedExp: 15,
  FriendlyGainedExp: 15,
  // "GainExp": 15,

  // Food events
  // "FriendAteFood": 16,
  FoodEatenByThis: 16,
  FoodEatenByAny: 16,
  FoodEatenByFriend: 16,
  FoodEatenByFriendly: 16,
  // "FoodBought": 16,
  AppleEatenByThis: 16,
  CornEatenByThis: 16,
  CornEatenByFriend: 16,
  // "ShopFoodEatenByThis": 16,

  // Counter events (numbered triggers share counter priority)
  counter: 17,

  // Lost perk events
  ThisLostPerk: 17.5,
  FriendLostPerk: 18,
  PetLostPerk: 18,
  LostStrawberry: 18,
  FriendLostStrawberry: 18,
  // "LostAttack": 18,

  // Gained perk events
  ThisGainedPerk: 19,
  ThisGainedStrawberry: 19,
  FriendGainsPerk: 20,
  FriendlyGainsPerk: 20,
  // "ThisGainedPerkOrAilment": 20,
  FriendGainedStrawberry: 20,
  FriendlyGainedStrawberry: 20,

  // Ailment events
  ThisGainedAilment: 19,
  FriendGainsAilment: 20,
  // "FriendlyGainedAilment": 20,
  EnemyGainedAilment: 20,
  // "PetGainedAilment": 20,
  AnyoneGainedAilment: 20,
  AnyoneGainedWeak: 20,

  // Special movement
  FriendFlung: 21,
  AnyoneFlung: 21,

  // Mana snipe (after post-removal faint abilities)
  ManaSnipe: 24.5,

  // Space/positioning events
  ClearFront: 25,

  // Post-removal Death events (User list 11/12, but must be after ClearFront 25)
  ThisDied: 25.6,
  FriendDied: 26,
  AdjacentFriendsDie: 26,
  EnemyDied: 26,
  PetDied: 26,
  FriendlyToyBroke: 26,

  // Special summons
  GoldenRetrieverSummons: 27,

  // Composite/unused categories kept for reference
  // "Composite": 99,
  // "None": 999
};

// Utility getter for external code that prefers a typed lookup signature.
export const getAbilityPriority = (
  trigger: AbilityTrigger,
): number | undefined => ABILITY_PRIORITIES[trigger];
