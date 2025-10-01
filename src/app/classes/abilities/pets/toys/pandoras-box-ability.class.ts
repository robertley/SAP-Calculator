import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { EquipmentService } from "app/services/equipment.service";
import { Cold } from "../../../equipment/ailments/cold.class";
import { Crisp } from "../../../equipment/ailments/crisp.class";
import { Dazed } from "../../../equipment/ailments/dazed.class";
import { Icky } from "../../../equipment/ailments/icky.class";
import { Spooked } from "../../../equipment/ailments/spooked.class";
import { Toasty } from "../../../equipment/ailments/toasty.class";
import { Weak } from "../../../equipment/ailments/weak.class";
import { getOpponent } from "../../../../util/helper-functions";

export class PandorasBoxAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;
    private equipmentService: EquipmentService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService, equipmentService: EquipmentService) {
        super({
            name: 'PandorasBoxAbility',
            owner: owner,
            triggers: [],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
        this.equipmentService = equipmentService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        // Mirror Pandoras Box toy behavior
        let equipmentMap = this.equipmentService.getInstanceOfAllEquipment();
        let ailments = [
            new Cold(),
            new Crisp(),
            new Dazed(),
            new Icky(),
            // new Ink(), // excluded
            new Spooked(),
            new Toasty(),
            new Weak()
        ];
        
        // https://superautopets.wiki.gg/wiki/Pandoras_Box
        let excludedPerks = [
            'Cake Slice',
            'Carrot',
            'Cherry',
            'Chocolate Cake',
            'Coconut',
            'Croissant',
            'Cucumber',
            'Eggplant',
            'Fig',
            'Gingerbread Man',
            'Grapes',
            'Golden Egg',
            'Health Potion',
            'Love Potion',
            'Magic Beans',
            'Peanut',
            'Pie',
            'Rambutan',
            'Rice',
            'Skewer'
        ]

        let opponent = getOpponent(gameApi, owner.parent);
        let pets = [
            ...owner.parent.petArray,
            ...opponent.petArray
        ];

        let equipments = Array.from(equipmentMap.values());
        equipments = equipments.filter(equipment => !excludedPerks.includes(equipment.name));

        for (let pet of pets) {
            // 50% chance for pool to be ailments
            let perkPool = ailments;
            if (Math.random() < 0.5) {
                perkPool = equipments;
            }
            let equipment = perkPool[Math.floor(Math.random() * perkPool.length)];
            this.logService.createLog({
                message: `Pandoras Box Ability gave ${pet.name} ${equipment.name}`,
                type: "ability",
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: true,
            })
            pet.givePetEquipment(equipment, this.level);
        }

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): PandorasBoxAbility {
        return new PandorasBoxAbility(newOwner, this.logService, this.abilityService, this.equipmentService);
    }
}