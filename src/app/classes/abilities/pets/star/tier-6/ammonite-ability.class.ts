import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { PetService } from "app/services/pet.service";

export class AmmoniteAbility extends Ability {
    private logService: LogService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, petService: PetService) {
        super({
            name: 'AmmoniteAbility',
            owner: owner,
            triggers: ['BeforeThisDies'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
        this.petService = petService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let targetsBehindResp = owner.parent.nearestPetsBehind(1, owner);
        if (targetsBehindResp.pets.length === 0) {
            return;
        }
        let friendBehind = targetsBehindResp.pets[0];
        let rolls = owner.parent === gameApi.player ? gameApi.playerRollAmount : gameApi.opponentRollAmount;
        let expToGive = Math.floor(rolls / 2) * this.level;

        let mimicOctopus = this.petService.createPet({
            name: "Mimic Octopus",
            attack: friendBehind.attack,
            health: friendBehind.health,
            equipment: friendBehind.equipment,
            mana: friendBehind.mana,
            exp: friendBehind.exp
        }, owner.parent);

        this.logService.createLog({
            message: `${owner.name} transformed ${friendBehind.name} into ${mimicOctopus.name}`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: targetsBehindResp.random
        });
        owner.parent.transformPet(friendBehind, mimicOctopus);

        let expTargetResp = owner.parent.getThis(mimicOctopus);
        let target = expTargetResp.pet;
        if (target == null) {
            return;
        }
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} +${expToGive} experience.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: expTargetResp.random
        });

        target.increaseExp(expToGive);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): AmmoniteAbility {
        return new AmmoniteAbility(newOwner, this.logService, this.petService);
    }
}