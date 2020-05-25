import { Component } from "./Component.ts"

export class H2Component extends Component {
    render(data : any) : string {
        return `<h2>${data.value}</h2>`
    }
}
