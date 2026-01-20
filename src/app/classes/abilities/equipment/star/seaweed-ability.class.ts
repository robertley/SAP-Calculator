import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { LogService } from "app/services/log.service";
import { PetService } from "app/services/pet/pet.service";

export class SeaweedAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;
    private petService: PetService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService, petService: PetService) {
        super({
            name: 'SeaweedAbility',
            owner: owner,
            triggers: ['BeforeThisAttacks'],
            abilityType: 'Equipment',
            native: true,
            abilitylevel: 1,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.equipment = equipment;
        this.logService = logService;
        this.petService = petService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;

        // Create Baby Urchin with current pet's stats
        let babyUrchinPet = this.petService.createPet({
            name: "Baby Urchin",
            attack: owner.attack,
            health: owner.health,
            mana: owner.mana,
            exp: owner.exp,
            equipment: null
        }, owner.parent);

        this.logService.createLog({
            message: `${owner.name} transformed into ${babyUrchinPet.name} (Seaweed)`,
            type: 'equipment',
            player: owner.parent
        });

        owner.parent.transformPet(owner, babyUrchinPet);
    }
}