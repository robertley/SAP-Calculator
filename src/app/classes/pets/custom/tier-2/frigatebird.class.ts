import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Rice } from "../../../equipment/puppy/rice.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

// TODO research order of ailment removal
export class Frigatebird extends Pet {
    name = "Frigatebird";
    tier = 2;
    pack: Pack = 'Custom';
    attack = 2;
    health = 1;
    friendGainedAilment(gameApi: GameAPI, pet?: Pet): void {
        if (this.abilityUses >= this.level) {
            return;
        }
        if (pet == this) {
            return;
        }
        let equipment = pet.equipment;
        pet.givePetEquipment(new Rice());
        this.abilityUses++;
        this.logService.createLog({
            message: `${this.name} removed ${equipment.name} from ${pet.name} and gave ${pet.name} Rice.`,
            type: 'ability',
            player: this.parent
        })
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

    resetPet(): void {
        super.resetPet();
    }

    setAbilityUses() {
        super.setAbilityUses();
        this.maxAbilityUses = this.level;
    }
}