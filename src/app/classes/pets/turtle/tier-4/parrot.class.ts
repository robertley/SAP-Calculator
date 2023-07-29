import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

// TODO - verify parrot has all ability methods
export class Parrot extends Pet {
    name = "Parrot";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 4;
    health = 2;
    endTurn = (gameApi: GameAPI) => {
        let copyPet = this.petAhead;
        this.startOfBattle = copyPet.startOfBattle;
        this.hurt = copyPet.hurt;
        this.faint = copyPet.faint;
        this.friendSummoned = copyPet.friendSummoned;
        this.friendAheadAttacks = copyPet.friendAheadAttacks;
        this.friendAheadFaints = copyPet.friendAheadFaints;
        this.friendFaints = copyPet.friendFaints;
        this.afterAttack = copyPet.afterAttack;
        this.beforeAttack = copyPet.beforeAttack;
        this.knockOut = copyPet.knockOut;
        this.summoned = copyPet.summoned;

        this.logService.createLog({
            message: `Parrot copied ${copyPet.name}`,
            type: 'ability',
            player: this.parent,
            randomEvent: true
        })
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.health = health ?? this.health;
        this.attack = attack ?? this.attack;
        this.exp = exp ?? this.exp;
        this.originalHealth = this.health;
        this.originalAttack = this.attack;
        this.equipment = equipment;
        this.originalEquipment = equipment;
    }
}