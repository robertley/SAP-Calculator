import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { Garlic } from "../../../../equipment/turtle/garlic.class";
import { Honey } from "../../../../equipment/turtle/honey.class";
import { MeatBone } from "../../../../equipment/turtle/meat-bone.class";
import { Walnut } from "../../../../equipment/puppy/walnut.class";

export class BeetleAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'BeetleAbility',
            owner: owner,
            triggers: ['StartBattle'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {

        const { gameApi, triggerPet, tiger, pteranodon } = context; const owner = this.owner;

        let equipment;
        switch (this.level) {
            case 1:
                equipment = new Walnut();
                break;
            case 2:
                equipment = new Walnut();
                equipment.power = 4;
                equipment.originalPower = 4;
                break;
            case 3:
                equipment = new Walnut();
                equipment.power = 6;
                equipment.originalPower = 6;
                break;
        }
        let excludePets = owner.parent.getPetsWithEquipment(equipment.name);
        let targetsBehindResp = owner.parent.nearestPetsBehind(1, owner, excludePets);
        if (targetsBehindResp.pets.length === 0) {
            return;
        }
        let targetPet = targetsBehindResp.pets[0];
        this.logService.createLog({
            message: `${owner.name} gave ${targetPet.name} ${equipment.name}.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetsBehindResp.random
        });
        targetPet.givePetEquipment(equipment);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): BeetleAbility {
        return new BeetleAbility(newOwner, this.logService, this.abilityService);
    }
}