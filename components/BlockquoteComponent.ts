import { Component } from "./Component.ts"

export class BlockquoteComponent extends Component {
    render(data : any) : string {
        return `<blockquote>${data.value}</blockquote>`
    }
}
