import { Garlic } from "app/classes/equipment/turtle/garlic.class";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Bilby extends Pet {
    name = "Bilby";
    tier = 2;
    pack: Pack = 'Puppy';
    attack = 1;
    health = 4;
    friendLostPerk(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        if (this == pet) {
            return;
        }
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} Garlic.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        pet.givePetEquipment(new Garlic());
        this.abilityUses++;
        super.superFriendLosPerk(gameApi, pet, tiger);
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
        this.maxAbilityUses = this.level;
    }
}