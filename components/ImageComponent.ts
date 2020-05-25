import { Component } from "./Component.ts"

export class ImageComponent extends Component {
    render(data : any) : string {
        return `<img src="${this.neosHost}${data.image.uri}" title="${data.image.alt ? super.html5EntitiesEncode(data.image.alt) : ''}"/>`
    }
}
