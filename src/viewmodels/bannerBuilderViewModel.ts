import { Element } from "@/models/element";
import { ElementText } from "@/models/text";
import { ElementContainer } from "@/models/container";

class BannerBuilderViewModel {
    rootContainer: ElementContainer;

    constructor() {
        this.rootContainer = new ElementContainer({
            name: "Root", children: [
                new ElementContainer({
                    name: 'Container 1', children: [
                        new ElementText("Text 1", "foo"),
                        new ElementText("Text 2", "bar"),
                        new ElementText("Text 3", "sac"),
                        new ElementContainer({
                            name: 'Container 1-1', children: [
                                new ElementText("Text 1-1", "das"),
                                new ElementText("Text 1-2", "mor"),
                            ]
                        })
                    ]
                }),
                new ElementContainer({
                    name: 'Container 2', children: [
                        new ElementText("Text 3", "baz"),
                        new ElementText("Text 4", "wee"),
                    ]
                }),
            ]
        });

        // this.elementList[0].backgroundColor = "aliceblue";
        // this.elementList[1].backgroundColor = "lightgreen";
    }

    getRootContainer(): ElementContainer {
        return this.rootContainer;
    }
}

export { BannerBuilderViewModel }