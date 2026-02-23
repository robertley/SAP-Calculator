import { Log } from 'app/domain/interfaces/log.interface';

export type FightSide = 'player' | 'opponent';

export interface NamePatternSet {
    regex: RegExp | null;
    canonicalByLower: Map<string, string>;
}

export interface ParsedAttackEvent {
    attackerName: string | null;
    targetName: string | null;
    damage: number | null;
    isSnipe: boolean;
}

export interface ParsedTransformEvent {
    sourceName: string | null;
    targetName: string | null;
    transformedName: string | null;
    attack: number | null;
    health: number | null;
    exp: number | null;
    mana: number | null;
    equipmentName: string | null;
}

export interface ParsedStatChange {
    attackDelta: number;
    healthDelta: number;
    expDelta: number;
    manaDelta: number;
}

export interface ParsedTrumpetChange {
    delta: number;
    appliesToOpponent: boolean;
}

export interface SlotRef {
    side: FightSide;
    slot: number;
    value: FightAnimationSlot;
}

export interface ResolvedPetVisual {
    petIconSrc: string | null;
    petCompanionIconSrc: string | null;
    petCompanionName: string | null;
}

export interface FightAnimationSlot {
    side: FightSide;
    slot: number;
    isEmpty: boolean;
    pendingRemoval: boolean;
    attack: number | null;
    health: number | null;
    exp: number | null;
    mana: number | null;
    petIconSrc: string | null;
    petName: string | null;
    petCompanionIconSrc: string | null;
    petCompanionName: string | null;
    equipmentIconSrc: string | null;
    equipmentName: string | null;
    label: string | null;
}

export interface FightAnimationFrame {
    index: number;
    logIndex: number;
    type: Log['type'];
    text: string;
    randomEvent: boolean;
    impact: FightAnimationImpact | null;
    popups: FightAnimationPopup[];
    death: FightAnimationDeath | null;
    shifts: FightAnimationShift[];
    equipmentChanges: FightAnimationEquipmentChange[];
    toyChanges: FightAnimationToyChange[];
    playerSlots: FightAnimationSlot[];
    opponentSlots: FightAnimationSlot[];
    playerToyName: string | null;
    playerHardToyName: string | null;
    opponentToyName: string | null;
    opponentHardToyName: string | null;
}

export interface FightAnimationImpact {
    attackerSide: FightSide;
    attackerSlot: number;
    targetSide: FightSide;
    targetSlot: number;
    damage: number | null;
    isSnipe: boolean;
}

export type FightAnimationPopupType =
    | 'damage'
    | 'attack'
    | 'health'
    | 'exp'
    | 'mana'
    | 'trumpets';

export interface FightAnimationPopup {
    side: FightSide;
    slot: number;
    type: FightAnimationPopupType;
    delta: number;
}

export interface FightAnimationDeath {
    side: FightSide;
    slot: number;
    petIconSrc: string | null;
    petName: string | null;
    petCompanionIconSrc: string | null;
    petCompanionName: string | null;
}

export interface FightAnimationShift {
    side: FightSide;
    slot: number;
    fromSlot: number;
}

export interface FightAnimationEquipmentChange {
    side: FightSide;
    slot: number;
    action: 'added' | 'removed';
    equipmentName: string | null;
    equipmentIconSrc: string | null;
}

export interface FightAnimationToyChange {
    side: FightSide;
    action: 'added' | 'removed';
    toyName: string;
    isHardToy: boolean;
}

export interface FightAnimationBoardState {
    playerSlots: FightAnimationSlot[];
    opponentSlots: FightAnimationSlot[];
    playerToyName: string | null;
    playerHardToyName: string | null;
    opponentToyName: string | null;
    opponentHardToyName: string | null;
}

export interface FightAnimationMutationResult {
    impact: FightAnimationImpact | null;
    popups: FightAnimationPopup[];
    death: FightAnimationDeath | null;
    shifts: FightAnimationShift[];
    equipmentChanges: FightAnimationEquipmentChange[];
    toyChanges: FightAnimationToyChange[];
}

export interface ParsedToken {
    slot: number | null;
    isEmpty: boolean;
    attack: number | null;
    health: number | null;
    exp: number | null;
    mana: number | null;
    petIconSrc: string | null;
    petName: string | null;
    equipmentIconSrc: string | null;
    equipmentName: string | null;
    label: string | null;
}

export interface FightAnimationBuildOptions {
    includePositionPrefix?: boolean;
    includeBoardFrames?: boolean;
}
