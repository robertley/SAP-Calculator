import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class SalmonOfKnowledge extends Pet {
    name = "Salmon of Knowledge";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 1;
    health = 5;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let power = this.level * 2;
        let playerPets = this.parent.petArray;
        let opponentPets = this.parent.opponent.petArray;
        let targets = [];
        if (playerPets[0] != null) {
            targets.push(playerPets[0]);
        }
        if (playerPets[1] != null) {
            targets.push(playerPets[1]);
        }
        if (opponentPets[0] != null) {
            targets.push(opponentPets[0]);
        }
        if (opponentPets[1] != null) {
            targets.push(opponentPets[1]);
        }
        for (let target of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${power} exp.`,
                type: 'ability',
                player: this.parent
            });
            target.increaseExp(power);
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

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level;
    }
}