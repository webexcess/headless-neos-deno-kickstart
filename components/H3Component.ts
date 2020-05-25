import { Component } from "./Component.ts"

export class H3Component extends Component {
    render(data : any) : string {
        return `<h3>${data.value}</h3>`
    }
}
