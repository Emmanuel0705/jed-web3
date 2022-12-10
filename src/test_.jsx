import React, { useEffect, useState } from "react";
import { parentStyle, childStyle } from "./styles/index";

const ParentComponent = ({ children, width, style }) => {
    const [image, setImage] = useState("");

    const fetchImage = (callback) => {
        console.log("_________________________-----");
        fetch("https://source.unsplash.com/random/200x200?sig=2")
            .then((res) => {
                const { url } = res;

                setImage(url);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        console.log("useEffecr________--");
        fetchImage((img) => setImage(img));
    }, [width]);

    return (
        <div style={{ ...style, width: `${width}%` }}>
            <img src={image} alt="alternative" />
            {children}
        </div>
    );
};

const ChildComponent = ({ setWidth, width, style }) => {
    const handleSetWidth = () => {
        setWidth(width + 5);
    };
    return (
        <div style={style}>
            <p>
                Click the button below to change the image and the width of your
                screen
            </p>
            <button onClick={handleSetWidth}>Click me</button>
        </div>
    );
};

const MainComponent = () => {
    const [width, setWidth] = useState(50);
    return (
        <ParentComponent style={parentStyle} width={width}>
            <ChildComponent
                style={childStyle}
                width={width}
                setWidth={setWidth}
            />
        </ParentComponent>
    );
};

export default MainComponent;
