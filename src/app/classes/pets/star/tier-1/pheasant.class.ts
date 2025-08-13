import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Strawberry } from "../../../equipment/star/strawberry.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";


export class Pheasant extends Pet {
    name = "Pheasant";
    tier = 1;
    pack: Pack = 'Star';
    attack = 2;
    health = 1;
    abilityUses = 0;
    maxAbilityUses: number;

    friendSummoned(gameApi: GameAPI, pet: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }

        this.logService.createLog({
            message: `${this.name} gave ${pet.name} a Strawberry.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });

        pet.givePetEquipment(new Strawberry());

        this.abilityUses++;
        this.superFriendSummoned(gameApi, pet, tiger);
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
    }
}