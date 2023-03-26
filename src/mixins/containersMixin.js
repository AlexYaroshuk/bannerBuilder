export default {
    data() {
        return {
            containers: [
                {
                    containerName: "Container 1",
                    isHovered: false,
                    isSelected: false,
                    type: "container",

                    //children
                    children: [
                        {
                            name: "Text 1",
                            value: "foo",
                            type: "text",
                            isSelected: false,
                            isHovered: false,
                        },
                        {
                            name: "Text 2",
                            value: "bar",
                            type: "text",
                            isSelected: false,
                            isHovered: false,
                        },
                        {
                            name: "Text 3",
                            value: "sac",
                            type: "text",
                            isSelected: false,
                            isHovered: false,
                        },
                    ],

                    text: "This is some text",
                    textSize: "16",
                    textFamily: "Arial",
                    textColor: "white",
                    textBGColor: "transparent",
                    linkLabel: "This is some link",
                    linkFamily: "Arial",
                    linkTextSize: "14",
                    linkColor: "yellow",
                    linkBGColor: this.linkBGColor,
                    linkURL: "https://www.npmjs.com/package/aicommits",
                    imageLink:
                        "https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/713db751-0cc0-4d18-b283-bd707824f201/smashingconf-front-end-sf-2023.png",
                    backgroundColor: "white",
                    borderColor: "violet",
                    borderRadius: 0,
                    borderWidth: 2,
                    BGImage: null,
                },
                {
                    containerName: "Container 2",
                    isHovered: false,
                    isSelected: false,
                    type: "container",

                    // children
                    children: [
                        {
                            name: "Text 3",
                            value: "baz",
                            type: "text",
                            isSelected: false,
                            isHovered: false,
                        },
                        {
                            name: "Text 4",
                            value: "wee",
                            type: "text",
                            isSelected: false,
                            isHovered: false,
                        },
                    ],
                    text: "This is some text",
                    textSize: "16",
                    textFamily: "Arial",
                    textColor: "white",
                    textBGColor: "transparent",
                    linkLabel: "This is some link",
                    linkFamily: "Arial",
                    linkTextSize: "14",
                    linkColor: "yellow",
                    linkBGColor: this.linkBGColor,
                    linkURL: "https://www.npmjs.com/package/aicommits",
                    imageLink:
                        "https://imgs.search.brave.com/jGVLyId8xm-5LEibe7k3viIX-7hIy8AsNBpAnqoBfjU/rs:fit:1888:225:1/g:ce/aHR0cHM6Ly90c2Ux/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC5G/c3lTQ0tPYzRsamcy/aDBkczV0QmNBSGFC/MyZwaWQ9QXBp",
                    backgroundColor: "violet",
                    borderColor: "violet",
                    borderRadius: 0,
                    borderWidth: 2,
                    BGImage: null,
                },
            ],
        };
    },
    methods: {
        //todo
    },
};
