import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Kitsune extends Pet {
    name = "Kitsune";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 7;
    friendFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (this.petAhead == null) {
            return
        }
        //TO DO: Check trigger order
        let targetResp = this.parent.getSpecificPet(this, pet);
        if (targetResp.pet == null) {
            return;
        }
        let target = targetResp.pet;
        let mana = target.mana;

        target.mana = 0;
        this.logService.createLog({
            message: `${this.name} took ${mana} mana from ${target.name}.`,
            type: "ability",
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        let buffTargetsAheadResp = this.parent.nearestPetsAhead(1, this);
        if (buffTargetsAheadResp.pets.length == null) {
            return;
        }
        let buffTarget = buffTargetsAheadResp.pets[0];
        this.logService.createLog({
            message: `${this.name} gave ${target.name} +${mana + this.level * 2} mana.`,
            type: "ability",
            player: this.parent,
            tiger: tiger,
            randomEvent: buffTargetsAheadResp.random
        });

        buffTarget.increaseMana(mana + this.level * 2);
        this.superFriendFaints(gameApi, pet, tiger);
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
}