import { TestBed } from '@angular/core/testing';
import { Rambutan } from '../../app/classes/equipment/unicorn/rambutan.class';
import { LogService } from '../../app/services/log.service';
import { Pet } from '../../app/classes/pet.class';
import { Panther } from '../../app/classes/pets/puppy/tier-5/panther.class';
import { Player } from '../../app/classes/player.class';

describe('Rambutan Equipment (Simple)', () => {
    let equipment: Rambutan;
    let mockLogService: jasmine.SpyObj<LogService>;
    let testPet: any;
    let testPanther: any;
    let mockPlayer: jasmine.SpyObj<Player>;
    let mockOpponent: jasmine.SpyObj<Player>;
    let gameApi: any;

    beforeEach(() => {
        mockLogService = jasmine.createSpyObj('LogService', ['createLog']);
        mockPlayer = jasmine.createSpyObj('Player', ['getLastPet']);
        mockOpponent = jasmine.createSpyObj('Player', ['getLastPet']);
        
        gameApi = {
            player: mockPlayer,
            opponet: mockOpponent
        };

        // Create simple test objects that mimic pets
        testPet = {
            name: 'TestPet',
            parent: mockPlayer,
            equipment: { name: 'Rambutan' },
            originalBeforeAttack: null,
            increaseMana: jasmine.createSpy('increaseMana'),
            givePetEquipment: jasmine.createSpy('givePetEquipment')
        };

        testPanther = {
            name: 'TestPanther',
            parent: mockPlayer,
            equipment: { name: 'Rambutan' },
            level: 2,
            originalBeforeAttack: null,
            increaseMana: jasmine.createSpy('increaseMana'),
            givePetEquipment: jasmine.createSpy('givePetEquipment')
        };
        
        // Make testPanther an instance of Panther for instanceof check
        Object.setPrototypeOf(testPanther, Panther.prototype);

        equipment = new Rambutan(mockLogService);
    });

    it('should be created', () => {
        expect(equipment).toBeTruthy();
        expect(equipment.name).toBe('Rambutan');
        expect(equipment.equipmentClass).toBe('beforeAttack');
    });

    it('should give 3 mana to normal pet', () => {
        // Set up beforeAttack method
        equipment.callback(testPet);
        
        // Call beforeAttack
        testPet.beforeAttack(gameApi);
        
        expect(testPet.increaseMana).toHaveBeenCalledWith(3);
        expect(mockLogService.createLog).toHaveBeenCalledWith({
            message: 'TestPet gained 3 mana. (Rambutan)',
            type: 'equipment',
            player: mockPlayer
        });
        expect(testPet.givePetEquipment).toHaveBeenCalledWith(null);
    });

    it('should multiply mana gain for Panther (3 * (level + 1))', () => {
        // Set up beforeAttack method
        equipment.callback(testPanther);
        
        // Call beforeAttack
        testPanther.beforeAttack(gameApi);
        
        // Should be 3 * (2 + 1) = 9
        expect(testPanther.increaseMana).toHaveBeenCalledWith(9);
        expect(mockLogService.createLog).toHaveBeenCalledWith({
            message: 'TestPanther gained 9 mana. (Rambutan) (Panther)',
            type: 'equipment',
            player: mockPlayer
        });
        expect(testPanther.givePetEquipment).toHaveBeenCalledWith(null);
    });

    it('should not trigger if equipment is removed', () => {
        testPet.equipment = null;
        
        equipment.callback(testPet);
        testPet.beforeAttack(gameApi);
        
        expect(testPet.increaseMana).not.toHaveBeenCalled();
        expect(mockLogService.createLog).not.toHaveBeenCalled();
    });

    it('should not trigger if different equipment is equipped', () => {
        testPet.equipment = { name: 'Other Equipment' };
        
        equipment.callback(testPet);
        testPet.beforeAttack(gameApi);
        
        expect(testPet.increaseMana).not.toHaveBeenCalled();
        expect(mockLogService.createLog).not.toHaveBeenCalled();
    });

    it('should call original beforeAttack if it exists', () => {
        const originalBeforeAttack = jasmine.createSpy('originalBeforeAttack');
        testPet.originalBeforeAttack = originalBeforeAttack;
        
        equipment.callback(testPet);
        testPet.beforeAttack(gameApi);
        
        expect(originalBeforeAttack).toHaveBeenCalledWith(gameApi);
        expect(testPet.increaseMana).toHaveBeenCalledWith(3);
    });
});