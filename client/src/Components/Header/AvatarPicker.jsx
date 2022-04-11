import React, { useEffect, useRef } from "react";
import List from "@material-ui/core/List";
import t from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Badge } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import useTheme from "@material-ui/core/styles/useTheme";

import("screw-filereader");

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        "& > *": {
            margin: theme.spacing(1)
        }
    },
    form: {
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "fit-content"
    },
    input: {
        fontSize: 15
    },
    large: {
        width: theme.spacing(25),
        height: theme.spacing(25),
        border: `4px solid ${theme.palette.primary.main}`
    }
}));

const EditIconButton = withStyles((theme) => ({
    root: {
        width: 22,
        height: 22,
        padding: 15,
        border: `2px solid ${theme.palette.primary.main}`
    }
}))(IconButton);

export const AvatarPicker = (props) => {
    const [file, setFile] = React.useState("");
    const theme = useTheme();
    const classes = useStyles();

    const imageRef = useRef();

    const { handleChangeImage, avatarImage } = props;

    useEffect(() => {
        if (!file && avatarImage) {
            setFile(URL.createObjectURL(avatarImage));
        }

        return () => {
            if (file) URL.revokeObjectURL(file);
        };
    }, [file, avatarImage]);

    const renderImage = (fileObject) => {
        fileObject.image().then((img) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const maxWidth = 256;
            const maxHeight = 256;

            const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
            const width = (img.width * ratio + 0.5) | 0;
            const height = (img.height * ratio + 0.5) | 0;

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                const resizedFile = new File([blob], file.name, fileObject);
                setFile(URL.createObjectURL(resizedFile));
                handleChangeImage(resizedFile);
            });
        });
    };

    const showOpenFileDialog = () => {
        imageRef.current.click();
    };

    const handleChange = (event) => {
        const fileObject = event.target.files[0];
        if (!fileObject) return;
        renderImage(fileObject);
    };

    return (
        <List data-testid={"image-upload"}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "20px 10px"
                }}
            >
                <div className={classes.root}>
                    <Badge
                        overlap="circle"
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right"
                        }}
                        badgeContent={
                            <EditIconButton
                                onClick={showOpenFileDialog}
                                style={{ background: theme.palette.primary.main }}
                            >
                                <EditIcon />
                            </EditIconButton>
                        }
                    >
                        <Avatar alt={"avatar"} src={file} className={classes.large} />
                    </Badge>
                    <input
                        ref={imageRef}
                        type="file"
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleChange}
                    />
                </div>
            </div>
        </List>
    );
};
AvatarPicker.propTypes = {
    handleChangeImage: t.func.isRequired,
    avatarImage: t.object
};
export default AvatarPicker;
