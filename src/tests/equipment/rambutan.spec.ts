import { TestBed } from '@angular/core/testing';
import { Rambutan } from '../../app/classes/equipment/unicorn/rambutan.class';
import { LogService } from '../../app/services/log.service';
import { Pet } from '../../app/classes/pet.class';
import { Panther } from '../../app/classes/pets/puppy/tier-5/panther.class';
import { Player } from '../../app/classes/player.class';

describe('Rambutan Equipment', () => {
    let equipment: Rambutan;
    let mockLogService: jasmine.SpyObj<LogService>;
    let mockPet: jasmine.SpyObj<Pet>;
    let mockPanther: jasmine.SpyObj<Panther>;
    let mockPlayer: jasmine.SpyObj<Player>;
    let mockOpponent: jasmine.SpyObj<Player>;
    let gameApi: any;

    beforeEach(() => {
        // Create mock services
        mockLogService = jasmine.createSpyObj('LogService', ['createLog']);
        
        // Create mock players
        mockPlayer = jasmine.createSpyObj('Player', ['getLastPet', 'getHighestHealthPet', 'getLowestHealthPet']);
        mockOpponent = jasmine.createSpyObj('Player', ['getLastPet', 'getHighestHealthPet', 'getLowestHealthPet']);
        
        // Create game API mock
        gameApi = {
            player: mockPlayer,
            opponet: mockOpponent
        };

        // Create mock pets
        mockPet = jasmine.createSpyObj('Pet', ['increaseMana', 'givePetEquipment'], {
            name: 'TestPet',
            parent: mockPlayer,
            equipment: { name: 'Rambutan' },
            originalBeforeAttack: null
        });

        mockPanther = jasmine.createSpyObj('Panther', ['increaseMana', 'givePetEquipment'], {
            name: 'TestPanther', 
            parent: mockPlayer,
            equipment: { name: 'Rambutan' },
            level: 2,
            originalBeforeAttack: null
        });

        TestBed.configureTestingModule({
            providers: [
                { provide: LogService, useValue: mockLogService }
            ]
        });

        equipment = new Rambutan(mockLogService);
    });

    it('should be created', () => {
        expect(equipment).toBeTruthy();
        expect(equipment.name).toBe('Rambutan');
        expect(equipment.equipmentClass).toBe('beforeAttack');
    });

    it('should give 3 mana to normal pet', () => {
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify mana gain
        expect(mockPet.increaseMana).toHaveBeenCalledWith(3);
        expect(mockLogService.createLog).toHaveBeenCalledWith({
            message: 'TestPet gained 3 mana. (Rambutan)',
            type: 'equipment',
            player: mockPlayer
        });
    });

    it('should multiply mana gain for Panther', () => {
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPanther);
        
        // Call the beforeAttack method
        mockPanther.beforeAttack(gameApi);
        
        // Verify mana gain: 3 * (level + 1) = 3 * (2 + 1) = 9
        expect(mockPanther.increaseMana).toHaveBeenCalledWith(9);
        expect(mockLogService.createLog).toHaveBeenCalledWith({
            message: 'TestPanther gained 9 mana. (Rambutan) (Panther)',
            type: 'equipment',
            player: mockPlayer
        });
    });

    it('should not trigger if equipment is removed', () => {
        // Remove equipment
        mockPet.equipment = null;
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify no mana gain or logging
        expect(mockPet.increaseMana).not.toHaveBeenCalled();
        expect(mockLogService.createLog).not.toHaveBeenCalled();
    });

    it('should not trigger if different equipment is equipped', () => {
        // Change equipment
        mockPet.equipment = { name: 'Other Equipment', equipmentClass: 'beforeAttack' as any, callback: () => {}, reset: () => {} };
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify no mana gain or logging
        expect(mockPet.increaseMana).not.toHaveBeenCalled();
        expect(mockLogService.createLog).not.toHaveBeenCalled();
    });

    it('should remove equipment after use', () => {
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify equipment is removed
        expect(mockPet.givePetEquipment).toHaveBeenCalledWith(null);
    });

    it('should call original beforeAttack if it exists', () => {
        const originalBeforeAttack = jasmine.createSpy('originalBeforeAttack');
        mockPet.originalBeforeAttack = originalBeforeAttack;
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify original beforeAttack was called
        expect(originalBeforeAttack).toHaveBeenCalledWith(gameApi);
    });
});