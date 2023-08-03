import { PetService } from "app/services/pet.service";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

// TODO - verify parrot has all ability methods
// fix bug with parrot copying parrot working despite order
export class Parrot extends Pet {
    name = "Parrot";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 4;
    health = 2;
    endTurn(gameApi: GameAPI) {
        let copyPet = this.petAhead;
        if (this.petAhead == null) {
            return;
        }
        this.startOfBattle = copyPet.startOfBattle?.bind(this);
        this.hurt = copyPet.hurt?.bind(this);
        this.faint = copyPet.faint?.bind(this);
        this.friendSummoned = copyPet.friendSummoned?.bind(this);
        this.friendAheadAttacks = copyPet.friendAheadAttacks?.bind(this);
        this.friendAheadFaints = copyPet.friendAheadFaints?.bind(this);
        this.friendFaints = copyPet.friendFaints?.bind(this);
        this.afterAttack = copyPet.afterAttack?.bind(this);
        this.beforeAttack = copyPet.beforeAttack?.bind(this);
        this.knockOut = copyPet.knockOut?.bind(this);
        this.summoned = copyPet.summoned?.bind(this);

        this.logService.createLog({
            message: `Parrot copied ${copyPet.name}`,
            type: 'ability',
            player: this.parent
        })
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}