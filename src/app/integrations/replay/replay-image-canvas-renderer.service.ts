import { Injectable } from '@angular/core';

export interface ReplayImagePetInfo {
  imagePath: string | null;
  perkImagePath: string | null;
  attack: number;
  health: number;
  tempAttack?: number;
  tempHealth?: number;
  level: number;
  xp: number;
}

export interface ReplayImageToyInfo {
  imagePath: string | null;
  level: number;
}

export interface ReplayImageBattleInfo {
  outcome: number;
  opponentName: string | null;
  playerName: string | null;
  playerLives: number | null;
  opponentLives: number | null;
  playerPets: Array<ReplayImagePetInfo | null>;
  opponentPets: Array<ReplayImagePetInfo | null>;
  playerToy: ReplayImageToyInfo | null;
  opponentToy: ReplayImageToyInfo | null;
}

export interface ReplayImageCanvasSession {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  baseWidth: number;
  rowHeight: number;
  footerHeight: number;
  headerHeight: number;
  petWidth: number;
  loadImage: (src: string | null) => Promise<HTMLImageElement | null>;
}

export interface ReplayImageCanvasOptions {
  rowCount: number;
  extraColumnWidth?: number;
  title?: string | null;
  footerHeight?: number;
}

export interface ReplayImageBattleRowOptions {
  index: number;
  turn: number;
  info: ReplayImageBattleInfo;
  playerPets?: Array<ReplayImagePetInfo | null>;
  opponentPets?: Array<ReplayImagePetInfo | null>;
  backgroundColor?: string;
}

@Injectable({ providedIn: 'root' })
export class ReplayImageCanvasRendererService {
  readonly petWidth = 50;
  readonly rowHeight = 125;
  readonly baseWidth = 1250;
  readonly footerHeight = 60;

  createSession(options: ReplayImageCanvasOptions): ReplayImageCanvasSession {
    const extraColumnWidth = Math.max(0, options.extraColumnWidth ?? 0);
    const footerHeight = Math.max(0, options.footerHeight ?? this.footerHeight);
    const headerHeight = options.title ? 36 : 0;
    const canvas = document.createElement('canvas');
    canvas.width = this.baseWidth + extraColumnWidth;
    canvas.height =
      headerHeight + options.rowCount * this.rowHeight + footerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas rendering is not available in this browser.');
    }

    const imageCache = new Map<string, Promise<HTMLImageElement | null>>();
    const loadImage = (src: string | null): Promise<HTMLImageElement | null> => {
      if (!src) {
        return Promise.resolve(null);
      }
      const cached = imageCache.get(src);
      if (cached) {
        return cached;
      }
      const promise = new Promise<HTMLImageElement | null>((resolve) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = src;
      });
      imageCache.set(src, promise);
      return promise;
    };

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (options.title) {
      ctx.fillStyle = '#000000';
      ctx.font = '18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(options.title, canvas.width / 2, 24);
      ctx.textAlign = 'left';
    }

    return {
      canvas,
      ctx,
      width: canvas.width,
      height: canvas.height,
      baseWidth: this.baseWidth,
      rowHeight: this.rowHeight,
      footerHeight,
      headerHeight,
      petWidth: this.petWidth,
      loadImage,
    };
  }

  async drawBattleRow(
    session: ReplayImageCanvasSession,
    options: ReplayImageBattleRowOptions,
  ): Promise<{ rowStartY: number; baseY: number }> {
    const { ctx, petWidth, loadImage, baseWidth } = session;
    const info = options.info;
    const rowStartY = session.headerHeight + options.index * session.rowHeight;
    const baseY = rowStartY + 25;
    const playerPets = options.playerPets ?? info.playerPets;
    const opponentPets = options.opponentPets ?? info.opponentPets;
    const turnIconSize = (25 + petWidth) * 2;
    const livesIconSize = 15 + petWidth;

    ctx.fillStyle =
      options.backgroundColor ?? this.getOutcomeBackground(info.outcome);
    ctx.fillRect(0, rowStartY, session.width, session.rowHeight);

    ctx.fillStyle = '#000000';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(
      String(options.turn),
      25 + petWidth + 15,
      baseY + petWidth / 2 + 6,
    );

    const heartIcon = await loadImage(
      '/assets/art/Public/Public/Icons/heart-from-textmap.png',
    );
    if (heartIcon) {
      ctx.drawImage(heartIcon, turnIconSize, baseY, petWidth, petWidth);
      if (info.playerLives !== null) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          String(info.playerLives),
          turnIconSize + petWidth / 2,
          baseY + (petWidth - 24) + 6,
        );
      }
    }

    ctx.fillStyle = '#111111';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(
      this.getOutcomeLabel(info.outcome),
      turnIconSize + petWidth / 2 - 18,
      baseY + petWidth + 26,
    );

    for (let index = 0; index < playerPets.length && index < 5; index += 1) {
      const pet = playerPets[index];
      if (!pet) {
        continue;
      }
      const visualIndex = 4 - index;
      const x =
        visualIndex * (petWidth + 25) + 25 + turnIconSize + livesIconSize;
      await this.drawPet(session, pet, x, baseY, true);
    }
    if (info.playerToy) {
      await this.drawToy(
        session,
        info.playerToy,
        5 * (petWidth + 25) + turnIconSize + livesIconSize,
        baseY,
      );
    }

    for (
      let index = 0;
      index < opponentPets.length && index < 5;
      index += 1
    ) {
      const pet = opponentPets[index];
      if (!pet) {
        continue;
      }
      const visualIndex = 4 - index;
      const x = baseWidth - (visualIndex * (petWidth + 25) + petWidth + 25);
      await this.drawPet(session, pet, x, baseY, false);
    }
    if (info.opponentToy) {
      await this.drawToy(
        session,
        info.opponentToy,
        baseWidth - (5 + 1) * (petWidth + 25),
        baseY,
      );
    }

    ctx.textAlign = 'left';
    return { rowStartY, baseY };
  }

  drawFooterBackground(session: ReplayImageCanvasSession): number {
    const footerY =
      session.height - session.footerHeight;
    session.ctx.fillStyle = '#FFFFFF';
    session.ctx.fillRect(0, footerY, session.width, session.footerHeight);
    return footerY;
  }

  toBlob(session: ReplayImageCanvasSession): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      session.canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create PNG image.'));
          return;
        }
        resolve(blob);
      }, 'image/png');
    });
  }

  private async drawPet(
    session: ReplayImageCanvasSession,
    pet: ReplayImagePetInfo,
    x: number,
    y: number,
    flip: boolean,
  ): Promise<void> {
    const { ctx, petWidth, loadImage } = session;
    const petImage = await loadImage(pet.imagePath);
    if (petImage) {
      if (flip) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(petImage, -(x + petWidth), y, petWidth, petWidth);
        ctx.restore();
      } else {
        ctx.drawImage(petImage, x, y, petWidth, petWidth);
      }
    }
    const perkImage = await loadImage(pet.perkImagePath);
    if (perkImage) {
      ctx.drawImage(perkImage, x + 30, y - 10, 30, 30);
    }

    ctx.font = '18px Arial';
    ctx.fillStyle = 'green';
    ctx.textAlign = 'center';
    ctx.fillText(
      String(pet.attack + (pet.tempAttack ?? 0)),
      x + petWidth / 4,
      y + petWidth + 20,
    );
    ctx.fillStyle = 'red';
    ctx.fillText(
      String(pet.health + (pet.tempHealth ?? 0)),
      x + (3 * petWidth) / 4,
      y + petWidth + 20,
    );
    ctx.font = '12px Arial';
    ctx.fillStyle = 'grey';
    ctx.fillText('Lvl', x, y - 6);
    ctx.font = '18px Arial';
    ctx.fillStyle = 'orange';
    ctx.fillText(String(pet.level), x + 18, y - 7.5);

    const xpBars = pet.xp < 2 ? 2 : 3;
    const xpStartX = x - 9;
    const xpBarWidth = pet.xp < 2 ? 14 : 10;
    const xpBarGap = pet.xp < 2 ? 16 : 12;
    for (let index = 0; index < xpBars; index += 1) {
      const filled = pet.xp < 2 ? index < pet.xp : index < pet.xp - 2;
      this.fillRoundedRect(
        ctx,
        xpStartX + index * xpBarGap,
        y - 2,
        xpBarWidth,
        6,
        2,
        filled ? 'orange' : 'grey',
      );
    }
    ctx.textAlign = 'left';
  }

  private async drawToy(
    session: ReplayImageCanvasSession,
    toy: ReplayImageToyInfo,
    x: number,
    y: number,
  ): Promise<void> {
    const { ctx, petWidth, loadImage } = session;
    const toyImage = await loadImage(toy.imagePath);
    if (toyImage) {
      ctx.drawImage(toyImage, x, y, petWidth, petWidth);
    }
    ctx.fillStyle = '#111111';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Lv${toy.level}`, x + petWidth / 2, y + (3 * petWidth) / 2);
    ctx.textAlign = 'left';
  }

  private getOutcomeBackground(outcome: number): string {
    return outcome === 1
      ? '#E6F4EA'
      : outcome === 2
        ? '#FDECEA'
        : '#F2F2F2';
  }

  private getOutcomeLabel(outcome: number): string {
    return outcome === 1 ? 'WIN' : outcome === 2 ? 'LOSS' : 'DRAW';
  }

  private fillRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillStyle: string,
  ): void {
    const clampedRadius = Math.max(
      0,
      Math.min(radius, Math.min(width, height) / 2),
    );
    ctx.beginPath();
    ctx.moveTo(x + clampedRadius, y);
    ctx.lineTo(x + width - clampedRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + clampedRadius);
    ctx.lineTo(x + width, y + height - clampedRadius);
    ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - clampedRadius,
      y + height,
    );
    ctx.lineTo(x + clampedRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - clampedRadius);
    ctx.lineTo(x, y + clampedRadius);
    ctx.quadraticCurveTo(x, y, x + clampedRadius, y);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
}
