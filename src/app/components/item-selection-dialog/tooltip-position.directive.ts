import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appTooltip]',
    standalone: true
})
export class TooltipPositionDirective {
    @Input('appTooltip') tooltipText: string | null = null;

    constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) { }

    @HostListener('mouseenter')
    @HostListener('focus')
    onShow(): void {
        const text = this.tooltipText?.trim();
        if (!text) {
            this.renderer.removeAttribute(this.el.nativeElement, 'data-tooltip');
            return;
        }

        this.renderer.setAttribute(this.el.nativeElement, 'data-tooltip', text);
        this.renderer.addClass(this.el.nativeElement, 'has-tooltip');
        this.updatePosition(text);
    }

    @HostListener('mouseleave')
    @HostListener('blur')
    onHide(): void {
        this.renderer.removeClass(this.el.nativeElement, 'has-tooltip');
    }

    private updatePosition(text: string): void {
        const rect = this.el.nativeElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const padding = 12;
        const arrowSize = 8;
        const gap = 12;
        const maxTooltipWidth = Math.min(200, viewportWidth - padding * 2);

        const { width: tooltipWidth, height: tooltipHeight } = this.measureTooltip(text, maxTooltipWidth);

        const centerX = rect.left + rect.width / 2;
        const left = this.clamp(centerX - tooltipWidth / 2, padding, viewportWidth - tooltipWidth - padding);

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
        let arrowLeft = this.clamp(centerX, padding + arrowSize, viewportWidth - padding - arrowSize);
        let arrowTop = rect.top - gap - arrowSize;

        if (placement === 'bottom') {
            top = rect.bottom + gap + arrowSize;
            arrowTop = rect.bottom + gap;
        }

        if (placement === 'right') {
            tooltipLeft = this.clamp(rect.right + gap + arrowSize, padding, viewportWidth - tooltipWidth - padding);
            top = this.clamp(rect.top + rect.height / 2 - tooltipHeight / 2, padding, viewportHeight - tooltipHeight - padding);
            arrowLeft = rect.right + gap;
            arrowTop = this.clamp(rect.top + rect.height / 2, padding + arrowSize, viewportHeight - padding - arrowSize);
        }

        if (placement === 'left') {
            tooltipLeft = this.clamp(rect.left - tooltipWidth - gap - arrowSize, padding, viewportWidth - tooltipWidth - padding);
            top = this.clamp(rect.top + rect.height / 2 - tooltipHeight / 2, padding, viewportHeight - tooltipHeight - padding);
            arrowLeft = rect.left - gap - arrowSize;
            arrowTop = this.clamp(rect.top + rect.height / 2, padding + arrowSize, viewportHeight - padding - arrowSize);
        }

        this.renderer.setStyle(this.el.nativeElement, '--tooltip-left', `${tooltipLeft}px`);
        this.renderer.setStyle(this.el.nativeElement, '--tooltip-top', `${top}px`);
        this.renderer.setStyle(this.el.nativeElement, '--tooltip-arrow-left', `${arrowLeft}px`);
        this.renderer.setStyle(this.el.nativeElement, '--tooltip-arrow-top', `${arrowTop}px`);
        this.renderer.setStyle(this.el.nativeElement, '--tooltip-max-width', `${maxTooltipWidth}px`);
        this.renderer.setAttribute(this.el.nativeElement, 'data-tooltip-placement', placement);
    }

    private measureTooltip(text: string, maxWidth: number): { width: number; height: number } {
        const measure = document.createElement('div');
        measure.textContent = text;
        measure.style.position = 'fixed';
        measure.style.visibility = 'hidden';
        measure.style.pointerEvents = 'none';
        measure.style.fontSize = '0.78rem';
        measure.style.lineHeight = '1.3';
        measure.style.padding = '0.55rem 0.7rem';
        measure.style.borderRadius = '8px';
        measure.style.maxWidth = `${maxWidth}px`;
        measure.style.whiteSpace = 'pre-wrap';
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

    private clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
}