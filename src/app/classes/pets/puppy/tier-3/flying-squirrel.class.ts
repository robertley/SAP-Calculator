import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ToyService } from "../../../../services/toy.service";
import { InjectorService } from "../../../../services/injector.service";

export class FlyingSquirrel extends Pet {
    name = "Flying Squirrel";
    tier = 3;
    pack: Pack = 'Puppy';
    attack = 3;
    health = 3;
    private get toyService(): ToyService {
        return InjectorService.getInjector().get(ToyService);
    }
    friendlyToyBroke(gameApi: GameAPI, tiger?: boolean): void {
        const originalToy = this.parent.originalToy;
        if (!originalToy) {
            return;
        }

        const newToy = this.toyService.createToy(originalToy.name, this.parent, originalToy.level);
        this.parent.setToy(newToy);
        this.logService.createLog({
            message: `${this.parent.toy.name} respawned!`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.superFriendlyToyBroke(gameApi, tiger);
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