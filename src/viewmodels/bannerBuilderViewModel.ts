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
                        new ElementText({ name: "Text 1", text: "foo" }),
                        new ElementText({ name: "Text 2", text: "bar" }),
                        new ElementText({ name: "Text 3", text: "sac" }),
                        new ElementContainer({
                            name: 'Container 1-1', children: [
                                new ElementText({ name: "Text 1-1", text: "das" }),
                                new ElementText({ name: "Text 1-2", text: "mor" }),
                            ]
                        })
                    ]
                }),
                new ElementContainer({
                    name: 'Container 2', children: [
                        new ElementText({ name: "Text 3", text: "baz" }),
                        new ElementText({ name: "Text 4", text: "wee" }),
                    ]
                }),
            ]
        });

        // this.rootContainer.getChildren()[0].backgroundColor = "aliceblue";
        // this.rootContainer.getChildren()[1].backgroundColor = "lightgreen";
    }

    getRootContainer(): ElementContainer {
        return this.rootContainer;
    }
}

export { BannerBuilderViewModel }