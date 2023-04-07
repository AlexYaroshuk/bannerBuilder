import { Text } from "@/models/text";
import { Container } from "@/models/container";

class BannerBuilderViewModel {
    rootContainer: Container;

    constructor() {
        this.rootContainer = new Container({
            name: "Root", children: [
                new Container({
                    name: 'Container 1', children: [
                        new Text({ name: "Text 1", text: "foo" }),
                        new Text({ name: "Text 2", text: "bar" }),
                        new Text({ name: "Text 3", text: "sac" }),
                        new Container({
                            name: 'Container 1-1', children: [
                                new Text({ name: "Text 1-1", text: "das" }),
                                new Text({ name: "Text 1-2", text: "mor" }),
                            ]
                        })
                    ]
                }),
                new Container({
                    name: 'Container 2', children: [
                        new Text({ name: "Text 3", text: "baz" }),
                        new Text({ name: "Text 4", text: "wee" }),
                    ]
                }),
            ]
        });
    }

    getRootContainer(): Container {
        return this.rootContainer;
    }
}

export { BannerBuilderViewModel }