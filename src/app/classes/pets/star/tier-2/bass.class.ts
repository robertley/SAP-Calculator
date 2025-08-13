import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Bass extends Pet {
    name = "Bass";
    tier = 2;
    pack: Pack = 'Star';
    attack = 3;
    health = 3;

    // A list of pets with a "Sell" ability, needed for targeting. TO DO: add all sell pets
    private sellPets = [
        'Beaver', 'Duck', 'Pig', 'Pillbug', 'Kiwi', 'Mouse', 'Frog', 'Bass'
    ];

    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        const potentialTargets = this.parent.petArray.filter(pet => {
            return pet !== this && this.sellPets.includes(pet.name) && pet.level >= 2;
        });

        if (potentialTargets.length > 0) {
            const target = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
            
            const expGain = this.level;

            this.logService.createLog({
                message: `${this.name} gave ${target.name} +${expGain} experience.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });

            target.increaseExp(expGain);
        }

        this.superFaint(gameApi, tiger);
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