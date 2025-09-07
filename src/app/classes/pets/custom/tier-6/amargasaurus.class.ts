import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
// Import the FairyArmadillo class to check its type.
import { FairyArmadillo } from "../../star/tier-4/fairy-armadillo.class";
import { FairyBall } from "../../hidden/fairy-ball.class";

export class Amargasaurus extends Pet {
    name = "Amargasaurus";
    tier = 5;
    pack: Pack = 'Star';
    attack = 5;
    health = 7;
    //TO DO: Need to add this to pet memory
    healthRestoredThisTurn = 0;

    friendHurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let currentTargetPet: Pet;

        // Special handling ONLY for Fairy Armadillo to account for its transformation.
        if (pet.transformed) {
            currentTargetPet = pet.transformedInto;
            currentTargetPet.originalHealth = pet.originalHealth;
        } else {
            currentTargetPet = pet;
        }

        if (!currentTargetPet || !currentTargetPet.alive) {
            return;
        }

        if (currentTargetPet === this) {
            return;
        }

        const maxHealthToRestore = this.level * 15;
        const healthMissing = currentTargetPet.originalHealth - currentTargetPet.health;

        if (healthMissing <= 0 || this.healthRestoredThisTurn >= maxHealthToRestore) {
            return;
        }

        const remainingRestorePower = maxHealthToRestore - this.healthRestoredThisTurn;
        const healthToRestore = Math.min(healthMissing, remainingRestorePower);

        if (healthToRestore > 0) {
            let targetResp = this.parent.getSpecificPet(this, currentTargetPet)
            let target = targetResp.pet;
            if (target == null) {
                return;
            }
            this.logService.createLog({
                message: `${this.name} restored ${healthToRestore} health to ${target.name}.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            });

            target.increaseHealth(healthToRestore);
            this.healthRestoredThisTurn += healthToRestore;
        }

        this.superFriendHurt(gameApi, pet, tiger);
    }

    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.healthRestoredThisTurn = 0;
    }
}