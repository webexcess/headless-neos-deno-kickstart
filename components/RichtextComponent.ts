import { Component } from "./Component.ts"

export class RichtextComponent extends Component {
    render(data : any) : string {
        return data.value
    }
}
