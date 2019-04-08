import { Directive, ViewContainerRef, ElementRef, TemplateRef, Input, AfterViewInit, Renderer2 } from "@angular/core";

/**
 * renders default content if ng-content not set but we want to see a default value
 *
 */
@Directive({ selector: "[davinciDefaultTemplate]" })
export class DefaultContentDirective implements AfterViewInit {

    private template: TemplateRef<any>;
    private node: HTMLElement;

    hasContent: boolean;

    constructor(
        private element: ElementRef,
        private container: ViewContainerRef,
        private renderer: Renderer2
    ) {
        this.node = element.nativeElement;
    }

    @Input()
    public set davinciDefaultTemplate(template: TemplateRef<any>) {
        this.template = template;
    }

    /**
     * content has been rendered into template
     *
     */
    public ngAfterViewInit() {

        const childNodes = Array.from(this.node.childNodes);
        const hasContent = childNodes.some((node) => node.nodeType === 1 || node.nodeType === 3);

        if (!hasContent) {
            this.renderer.setStyle(this.node, "display", "none");
            window.setTimeout(() => this.container.createEmbeddedView(this.template) , 0);
        }
    }
}
