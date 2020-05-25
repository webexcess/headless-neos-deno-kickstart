import { Html5Entities } from "https://deno.land/x/html_entities@v1.0/mod.js";

export class Component {
    neosHost = ''

    constructor(neosHost? : string) {
        if (neosHost) {
            this.neosHost = neosHost
        }
    }

    render(data : any) : string {
        return 'Render method not defined!'
    }

    html5EntitiesEncode(value : string) {
        return Html5Entities.encode(value)
    }
}
