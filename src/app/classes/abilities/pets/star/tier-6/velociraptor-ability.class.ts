import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class VelociraptorAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'VelociraptorAbility',
            owner: owner,
            triggers: ['FriendAttacked'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        // Find the pet ahead (to the left) with Strawberry
        let targetPet: Pet | undefined;
        let petIndex = owner.parent.petArray.indexOf(owner);

        for (let i = petIndex - 1; i >= 0; i--) {
            let checkPet = owner.parent.petArray[i];
            if (checkPet.alive && checkPet.equipment && checkPet.equipment.name === 'Strawberry') {
                targetPet = checkPet;
                break;
            }
        }

        if (!targetPet) {
            return;
        }

        // Remove the Strawberry equipment
        if (targetPet && targetPet.equipment && targetPet.equipment.name === 'Strawberry') {
            targetPet.removePerk();
            this.logService.createLog({
                message: `${owner.name} removed Strawberry from ${targetPet.name}`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger
            });

            let attackBonus = this.level * 2;
            let healthBonus = this.level * 3;

            // Give all friends the bonus
            let friendlyPetsResp = owner.parent.getAll(false, owner, true);
            let friendlyPets = friendlyPetsResp.pets;
            for (let friendPet of friendlyPets) {
                friendPet.increaseAttack(attackBonus);
                friendPet.increaseHealth(healthBonus);

                this.logService.createLog({
                    message: `${owner.name} gave ${friendPet.name} +${attackBonus} attack and +${healthBonus} health`,
                    type: 'ability',
                    player: owner.parent,
                    tiger: tiger,
                    randomEvent: friendlyPetsResp.random
                });
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): VelociraptorAbility {
        return new VelociraptorAbility(newOwner, this.logService);
    }
}