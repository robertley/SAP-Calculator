import type { Pet } from "../pet.class";

export function resetPetState(self: Pet): void {
    self.health = self.originalHealth;
    self.attack = self.originalAttack;
    self.equipment = self.originalEquipment;
    self.lastLostEquipment = null;
    self.mana = self.originalMana;
    self.triggersConsumed = self.originalTriggersConsumed;
    self.exp = self.originalExp;
    //clear memories
    self.timesHurt = self.originalTimesHurt;
    self.timesAttacked = 0;
    self.abilityCounter = 0;
    self.transformed = false;
    self.transformedInto = null;
    self.currentTarget = null;
    self.lastAttacker = null;
    self.killedBy = null;
    self.swallowedPets = [];
    self.targettedFriends.clear();
    self.savedPosition = self.originalSavedPosition;
    self.abilityList = [...self.originalAbilityList];
    self.initAbilityUses();
    //reset flags
    self.done = false;
    self.seenDead = false;
    self.removed = false;
    self.jumped = false;
    self.clearFrontTriggered = false;
    try {
        self.equipment?.reset();
    } catch (error) {
        console.warn('equipment reset failed', self.equipment)
        console.error(error)
        // window.alert("You found a rare bug! Please report this bug using the Report A Bug feature and say in this message that you found the rare bug. Thank you!")
    }
    if (self.equipment) {
        self.equipment.multiplier = 1;
        self.equipment.multiplierMessage = '';
    }
}
