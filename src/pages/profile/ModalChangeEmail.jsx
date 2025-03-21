import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import {useEffect, useState} from "react";

const ModalChangeEmail = ({
                              isOpening = false,
                              setIsOpening = () => {
                              },
                              onModalClose = () => {
                              },
                              onModalOpen = () => {
                              },
                              onUserCancel = () => {
                              },
                              sendEmail = () => {
                              },
                          }) => {
    const [email, setEmail] = useState("");


    useEffect(() => {
        if (isOpening) {
            onModalOpen();
        }
    }, [isOpening]);

    const handleCloseChangeEmail = () => {
        setIsOpening(false);
        onModalClose();
    };

    const handleUserCancel = () => {
        onUserCancel();
        handleCloseChangeEmail();
    };

    const handleUserSendEmail = () => {
        sendEmail(email);
        handleCloseChangeEmail();
    };



    return (
        <>
            <Dialog
                open={isOpening}
                onClose={handleCloseChangeEmail}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: (event) => {
                            event.preventDefault();
                            console.log(email);
                        },
                    },
                }}
            >
                <DialogTitle>Enter the email to send</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        handleUserCancel();
                    }}>
                        Cancel
                    </Button>
                    <Button type="submit">Subscribe</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ModalChangeEmail;