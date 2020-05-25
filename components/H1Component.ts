import { Component } from "./Component.ts"

export class H1Component extends Component {
    render(data : any) : string {
        return `<h1>${data.value}</h1>`
    }
}
