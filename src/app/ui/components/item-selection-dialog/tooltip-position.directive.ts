import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipPositionDirective implements OnDestroy {
  @Input('appTooltip') tooltipText: string | null = null;

  private tooltipElement: HTMLElement | null = null;
  private currentTooltipText: string | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {}

  @HostListener('mouseenter')
  @HostListener('focus')
  onShow(): void {
    const text = this.formatTooltipText(this.tooltipText);
    if (!text) {
      this.removeTooltip();
      return;
    }

    this.currentTooltipText = text;
    this.ensureTooltipElements();
    if (!this.tooltipElement) {
      return;
    }

    this.tooltipElement.textContent = text;
    this.renderer.setAttribute(this.tooltipElement, 'role', 'tooltip');
    this.updatePosition(text);
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  onHide(): void {
    this.removeTooltip();
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onViewportChange(): void {
    if (!this.currentTooltipText || !this.tooltipElement) {
      return;
    }

    this.updatePosition(this.currentTooltipText);
  }

  ngOnDestroy(): void {
    this.removeTooltip();
  }

  private updatePosition(text: string): void {
    if (!this.tooltipElement) {
      return;
    }

    const rect = this.el.nativeElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 12;
    const arrowSize = 0;
    const gap = 12;
    const maxTooltipWidth = Math.min(420, viewportWidth - padding * 2);
    const maxTooltipHeight = Math.min(360, viewportHeight - padding * 2);

    const { width: tooltipWidth, height: tooltipHeight } = this.measureTooltip(
      text,
      maxTooltipWidth,
      maxTooltipHeight,
    );

    const centerX = rect.left + rect.width / 2;
    const left = this.clamp(
      centerX - tooltipWidth / 2,
      padding,
      viewportWidth - tooltipWidth - padding,
    );

    const spaceAbove = rect.top;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceLeft = rect.left;
    const spaceRight = viewportWidth - rect.right;
    const neededSpace = tooltipHeight + gap + arrowSize;

    let placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
    const canRight = spaceRight >= tooltipWidth + gap + arrowSize;
    const canLeft = spaceLeft >= tooltipWidth + gap + arrowSize;

    if (canRight || canLeft) {
      placement = canRight ? 'right' : 'left';
    } else if (spaceAbove < neededSpace && spaceBelow >= neededSpace) {
      placement = 'bottom';
    } else if (spaceAbove < neededSpace && spaceBelow < neededSpace) {
      placement = spaceAbove >= spaceBelow ? 'top' : 'bottom';
    }

    let top = rect.top - tooltipHeight - gap - arrowSize;
    let tooltipLeft = left;
    if (placement === 'bottom') {
      top = rect.bottom + gap + arrowSize;
    }

    if (placement === 'right') {
      tooltipLeft = this.clamp(
        rect.right + gap + arrowSize,
        padding,
        viewportWidth - tooltipWidth - padding,
      );
      top = this.clamp(
        rect.top + rect.height / 2 - tooltipHeight / 2,
        padding,
        viewportHeight - tooltipHeight - padding,
      );
    }

    if (placement === 'left') {
      tooltipLeft = this.clamp(
        rect.left - tooltipWidth - gap - arrowSize,
        padding,
        viewportWidth - tooltipWidth - padding,
      );
      top = this.clamp(
        rect.top + rect.height / 2 - tooltipHeight / 2,
        padding,
        viewportHeight - tooltipHeight - padding,
      );
    }

    this.renderer.setStyle(this.tooltipElement, 'left', `${tooltipLeft}px`);
    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'max-width', `${maxTooltipWidth}px`);
    this.renderer.setStyle(this.tooltipElement, 'max-height', `${maxTooltipHeight}px`);
    this.renderer.setAttribute(this.tooltipElement, 'data-placement', placement);
  }

  private measureTooltip(
    text: string,
    maxWidth: number,
    maxHeight: number,
  ): { width: number; height: number } {
    const measure = document.createElement('div');
    measure.textContent = text;
    measure.style.position = 'fixed';
    measure.style.visibility = 'hidden';
    measure.style.pointerEvents = 'none';
    measure.style.fontSize = '0.72rem';
    measure.style.lineHeight = '1.2';
    measure.style.padding = '0.45rem 0.6rem';
    measure.style.borderRadius = '8px';
    measure.style.maxWidth = `${maxWidth}px`;
    measure.style.maxHeight = `${maxHeight}px`;
    measure.style.whiteSpace = 'pre-wrap';
    measure.style.overflow = 'visible';
    measure.style.boxSizing = 'border-box';
    measure.style.width = 'max-content';
    document.body.appendChild(measure);
    let rect = measure.getBoundingClientRect();
    if (rect.width > maxWidth) {
      measure.style.width = `${maxWidth}px`;
      rect = measure.getBoundingClientRect();
    }
    document.body.removeChild(measure);

    return { width: rect.width, height: rect.height };
  }

  private ensureTooltipElements(): void {
    if (!this.tooltipElement) {
      this.tooltipElement = this.renderer.createElement('div');
      this.renderer.addClass(this.tooltipElement, 'sap-floating-tooltip');
      this.renderer.appendChild(document.body, this.tooltipElement);
    }
  }

  private removeTooltip(): void {
    this.currentTooltipText = null;

    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }

  private formatTooltipText(text: string | null): string {
    if (!text) {
      return '';
    }

    return text
      .trim()
      .replace(/\s*(Level\s+\d+\s*[:\-])/gi, '\n$1')
      .replace(/^\n+/, '')
      .replace(/\n{3,}/g, '\n\n');
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
