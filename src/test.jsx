import React, { useEffect, useState } from "react";
import { parentStyle, childStyle } from "./styles/index";



const ParentComponent = ({ children, style, width }) => {
    const [image, setImage] = useState("");
    const fetchImage = (callback) => {

        fetch("https://random.imagecdn.app/150/100").then((result) => {
            const { url: imageURL } = result;
            callback(imageURL);
        });
    };
    useEffect(() => {
        fetchImage((img) => setImage(img));
    }, [width]);

    return (
        <div style={{ ...style, width: `${width}%` }}>
            <img src={image} alt="alternative" />
            <div>Parent component with size of {width}%</div>
            {children}
        </div>
    );
};

const ChildComponent = ({ style, width, setWidth }) => {
    // const { width, setWidth } = useContext(ImageContext);
    function handleChange() {
        setWidth(width + 5);
    }
    return (
        <>
            <div style={style}>
                Child component with Button bellow
                <button onClick={handleChange}>Click Me</button>
            </div>
        </>
    );
};

function AppProject1() {
    const [width, setWidth] = useState(50);
    return (

        <main>
            <ParentComponent style={parentStyle} width={width} >
                <ChildComponent style={childStyle} width={width} setWidth={setWidth} />
            </ParentComponent>
        </main>

    );
}

export default AppProject1;