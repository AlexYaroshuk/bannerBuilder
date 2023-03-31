import { ElementText } from "@/models/text";
import { ElementContainer } from "@/models/container";

class BannerBuilderViewModel {
    elementList: ElementContainer[]

    constructor() {
        this.elementList = [
            new ElementContainer({
                name: 'Container 1', children: [
                    new ElementText("Text 1", "foo"),
                    new ElementText("Text 2", "bar"),
                    new ElementText("Text 3", "sac")
                ]
            }),
            new ElementContainer({
                name: 'Container 2', children: [
                    new ElementText("Text 3", "baz"),
                    new ElementText("Text 4", "wee"),
                ]
            }),
        ];

        this.elementList[0].backgroundColor = "aliceblue";
        this.elementList[1].backgroundColor = "lightgreen";
    }
}
