import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { ChimLion } from "../../../../pets/hidden/chim-lion.class";
import { ChimGoat } from "../../../../pets/hidden/chim-goat.class";
import { ChimSnake } from "../../../../pets/hidden/chim-snake.class";

export class ChimeraAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'ChimeraAbility',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        if (owner.mana <= 0) {
            return;
        }

        const buffMultiplier = Math.floor(owner.mana / 2);
        const bonusAttack = buffMultiplier * 1;
        const bonusHealth = buffMultiplier * 2;

        const finalAttack = 3 + bonusAttack;
        const finalHealth = 3 + bonusHealth;

        this.logService.createLog({
            message: `${owner.name} spent ${owner.mana} mana.`,
            type: "ability",
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });

        // Always spawn Lion
        let lion = new ChimLion(this.logService, this.abilityService, owner.parent, finalHealth, finalAttack);
        let lionSummonResult = owner.parent.summonPet(lion, owner.savedPosition, false, owner);
        if (lionSummonResult.success) {
            this.logService.createLog({
                message: `${owner.name} spawned a ${lion.name} ${finalAttack}/${finalHealth}.`,
                type: "ability",
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: lionSummonResult.randomEvent
            });
        }

        if (this.level >= 2) {
            // Spawn Goat at level 2+
            let goat = new ChimGoat(this.logService, this.abilityService, owner.parent, finalHealth, finalAttack);
            let goatSummonResult = owner.parent.summonPet(goat, owner.savedPosition, false, owner);
            if (goatSummonResult.success) {
                this.logService.createLog({
                    message: `${owner.name} spawned a ${goat.name} ${finalAttack}/${finalHealth}.`,
                    type: "ability",
                    player: owner.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: goatSummonResult.randomEvent
                });
            }
        }

        if (this.level >= 3) {
            // Spawn Snake at level 3
            let snake = new ChimSnake(this.logService, this.abilityService, owner.parent, finalHealth, finalAttack);
            let snakeSummonResult = owner.parent.summonPet(snake, owner.savedPosition, false, owner);
            if (snakeSummonResult.success) {
                this.logService.createLog({
                    message: `${owner.name} spawned a ${snake.name} ${finalAttack}/${finalHealth}.`,
                    type: "ability",
                    player: owner.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: snakeSummonResult.randomEvent
                });
            }
        }

        owner.mana = 0;

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): ChimeraAbility {
        return new ChimeraAbility(newOwner, this.logService, this.abilityService);
    }
}