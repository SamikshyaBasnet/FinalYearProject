import React, { useEffect, useRef } from "react";
import List from "@material-ui/core/List";
import t from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Badge, Button } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import useTheme from "@material-ui/core/styles/useTheme";
import { loadUserData, uploadProfile } from '../../actions';
import { useSelector, useDispatch } from "react-redux";
import Axios from '../API/api';
import("screw-filereader");


const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "space-between",
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
        width: theme.spacing(12),
        height: theme.spacing(12),
        borderRadius: '50%',
        border: `4px solid rgb(202 167 41)`
    }
}));

const EditIconButton = withStyles((theme) => ({
    root: {
        width: 22,
        height: 22,
        padding: 15,
        border: `1px solid rgb(202 167 41)`
    }
}))(IconButton);

export const AvatarPicker = (props) => {
    const [file, setFile] = React.useState("");
    const [fileName, setFileName] = React.useState("");

    const [editPic, setEditPic] = React.useState(false);

    const dispatch = useDispatch();
    const theme = useTheme();
    const classes = useStyles();

    const imageRef = useRef();

    const { handleChangeImage, avatarImage } = props;

    const user = useSelector((state) => state.user);


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
        setFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
        setEditPic(true)
    };


    const uploadFile = async (e) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName);
        await Axios.post(
            `/uploadprofile?fileName=${fileName}&userId=${user.userId}`,
            formData
        ).then((res) => {

            dispatch(uploadProfile(res.data))
        });
    };

    return (
        <List data-testid={"image-upload"}>
            <div
                style={{
                    display: "flex",
                    margin: "-27px -16px",
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
                                style={{ background: 'rgb(202 167 41)' }}
                            >
                                <EditIcon />
                            </EditIconButton>
                        }
                    >
                        {/* {user.profile !== "" ?

                            <div className="user-profile">
                                <p className="user">
                                    {user.userName.charAt(0).toUpperCase()}

                                </p>
                            </div>
                            :

                            <div className="user-profile">
                                <p className="user">
                                    <img src={user.profile === "" ? `${user.userName.charAt(0).toUpperCase()}` : `/public/uploads/${user.profile}`} alt="" />
                                    {/* {user.userName.charAt(0).toUpperCase()} 
                                </p>
                            </div>
                        } */}
                        {user.profile === "" ?
                            <Avatar alt={"avatar"} src={editPic ? file : `/uploads/${user.profile}`}
                                className={classes.large}
                            /> :
                            <div>
                                <img className={classes.large} src={editPic ? file : `/uploads/${user.profile}`} alt="" height="20" width="20" />
                            </div>
                        }


                    </Badge>


                    <input
                        ref={imageRef}
                        type="file"
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Button className="modal-button"
                        onClick={uploadFile}
                        style={{ top: "30px", left: "60px" }}>Save</Button>
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
