import { Component } from "./Component.ts"

export class SinglelineComponent extends Component {
    render(data : any) : string {
        return data.value
    }
}
