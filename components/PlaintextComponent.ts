import { Component } from "./Component.ts"

export class PlaintextComponent extends Component {
    render(data : any) : string {
        return data.value
    }
}
