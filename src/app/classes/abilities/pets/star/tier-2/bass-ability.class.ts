import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class BassAbility extends Ability {
    private logService: LogService;
    private sellPets = [
        'Beaver', 'Duck', 'Pig', 'Pillbug', 'Kiwi', 'Mouse', 'Frog', 'Bass', 'Tooth Billed Pigeon', 'Marmoset', 'Capybara', 'Platypus'
    ];

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'BassAbility',
            owner: owner,
            triggers: ['BeforeThisDies', 'ThisSold'],
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

        const excludePets = owner.parent.petArray.filter(pet => {
            return pet == owner && !this.sellPets.includes(pet.name) && pet.level < 2;
        });

        let targetResp = owner.parent.getRandomPet(excludePets, true, null, null, owner);
        const target = targetResp.pet;
        if (target == null) {
            return;
        }

        const expGain = this.level;

        this.logService.createLog({
            message: `${owner.name} gave ${target.name} +${expGain} experience.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: targetResp.random
        });

        target.increaseExp(expGain);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): BassAbility {
        return new BassAbility(newOwner, this.logService);
    }
}