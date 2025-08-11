import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { CrackedEgg } from "../../hidden/cracked-egg.class";

export class SneakyEgg extends Pet {
    name = "Sneaky Egg";
    tier = 1;
    pack: Pack = 'Unicorn';
    attack = 1;
    health = 4;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {

        let power: Power = {
            attack: this.level * 4,
            health: this.level * 2
        }

        this.health = 0;

        let egg = new CrackedEgg(this.logService, this.abilityService, this.parent, power.health, power.attack, 0);

        this.logService.createLog(
            {
                message: `${this.name} spawned a ${power.attack}/${power.health} Cracked Egg`,
                type: "ability",
                player: this.parent,
                tiger: tiger,
            }
        )

        if (this.parent.summonPet(egg, this.savedPosition)) {
            this.abilityService.triggerSummonedEvents(egg);
        }

        this.superStartOfBattle(gameApi, tiger);
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