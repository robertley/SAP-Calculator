import { vi } from 'vitest';
import { ReplayImageCanvasRendererService } from '../../../src/app/integrations/replay/replay-image-canvas-renderer.service';

describe('ReplayImageCanvasRendererService', () => {
  it('creates the shared canvas geometry used by replay images', () => {
    const fillRect = vi.fn();
    const fillText = vi.fn();
    const context = createContext({ fillRect, fillText });
    const canvas = createCanvas(context);
    vi.stubGlobal('document', {
      createElement: vi.fn(() => canvas),
    });

    const renderer = new ReplayImageCanvasRendererService();
    const session = renderer.createSession({
      rowCount: 2,
      extraColumnWidth: 260,
      title: 'Player vs Opponent',
    });

    expect(session.width).toBe(1510);
    expect(session.height).toBe(346);
    expect(session.headerHeight).toBe(36);
    expect(session.rowHeight).toBe(125);
    expect(fillRect).toHaveBeenCalledWith(0, 0, 1510, 346);
    expect(fillText).toHaveBeenCalledWith('Player vs Opponent', 755, 24);
    vi.unstubAllGlobals();
  });

  it('draws both boards through one shared row contract', async () => {
    const drawImage = vi.fn();
    const fillText = vi.fn();
    const context = createContext({ drawImage, fillText });
    const canvas = createCanvas(context);
    vi.stubGlobal('document', {
      createElement: vi.fn(() => canvas),
    });
    class TestImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_value: string) {
        this.onload?.();
      }
    }
    vi.stubGlobal('Image', TestImage);

    const renderer = new ReplayImageCanvasRendererService();
    const session = renderer.createSession({ rowCount: 1 });
    await renderer.drawBattleRow(session, {
      index: 0,
      turn: 4,
      info: {
        outcome: 1,
        playerName: 'Player',
        opponentName: 'Opponent',
        playerLives: 8,
        opponentLives: 7,
        playerPets: [pet('/player.png')],
        opponentPets: [pet('/opponent.png')],
        playerToy: null,
        opponentToy: null,
      },
    });

    expect(drawImage).toHaveBeenCalled();
    expect(fillText).toHaveBeenCalledWith('4', 90, 56);
    expect(fillText).toHaveBeenCalledWith('Player (Player)', 415, 17);
    expect(fillText).toHaveBeenCalledWith('Opponent (Opponent)', 1010, 17);
    expect(fillText).toHaveBeenCalledWith('WIN', 157, 101);
    expect(fillText).toHaveBeenCalledWith('2', 552.5, 95);
    expect(fillText).toHaveBeenCalledWith('2', 887.5, 95);
    vi.unstubAllGlobals();
  });
});

function pet(imagePath: string) {
  return {
    imagePath,
    perkImagePath: null,
    attack: 2,
    health: 2,
    level: 1,
    xp: 0,
  };
}

function createCanvas(context: CanvasRenderingContext2D): HTMLCanvasElement {
  return {
    width: 0,
    height: 0,
    getContext: vi.fn(() => context),
    toBlob: vi.fn(),
  } as unknown as HTMLCanvasElement;
}

function createContext(overrides: Record<string, unknown>) {
  return {
    fillStyle: '',
    font: '',
    textAlign: 'left',
    strokeStyle: '',
    lineWidth: 1,
    fillRect: vi.fn(),
    fillText: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    scale: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    ...overrides,
  } as unknown as CanvasRenderingContext2D;
}
