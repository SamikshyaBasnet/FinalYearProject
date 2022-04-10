import React, { useState, useEffect } from "react";

export default function Image(props) {
    const [imageSrc, setImageSrc] = useState("");
    console.log("i am image", props.fileName, props.blob);
    useEffect(() => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(props.blob);
        reader.onloadend = function () {
            setImageSrc(reader.result);
        }
    }, [props.blob]);

    return (
        <img
            style={{ width: 150, height: "auto" }}
            src={imageSrc} alt={props.fileName} />
    )
}