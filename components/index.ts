import { PlaintextComponent } from "./PlaintextComponent.ts"
import { SinglelineComponent } from "./SinglelineComponent.ts"
import { H1Component } from "./H1Component.ts"
import { H2Component } from "./H2Component.ts"
import { H3Component } from "./H3Component.ts"
import { RichtextComponent } from "./RichtextComponent.ts"
import { BlockquoteComponent } from "./BlockquoteComponent.ts"
import { ImageComponent } from "./ImageComponent.ts"
import { Html5Entities } from "https://deno.land/x/html_entities@v1.0/mod.js";

export class Components {
    neosHost = ''

    constructor(neosHost: string) {
        this.neosHost = neosHost
    }

    renderComponent(name : string = '', data : any) {
        switch(name) {
            case 'Plaintext':
                return new PlaintextComponent().render(data);
                break;
            case 'Singleline':
                return new SinglelineComponent().render(data);
                break;
            case 'H1':
                return new H1Component().render(data);
                break;
            case 'H2':
                return new H2Component().render(data);
                break;
            case 'H3':
                return new H3Component().render(data);
                break;
            case 'Richtext':
                return new RichtextComponent().render(data);
                break;
            case 'Blockquote':
                return new BlockquoteComponent().render(data);
                break;
            case 'Image':
                return new ImageComponent(this.neosHost).render(data);
                break;
        }

        return '<div><strong>Component not found:</strong> ' + Html5Entities.encode(JSON.stringify(data)) + '</strong>';
    }
}
