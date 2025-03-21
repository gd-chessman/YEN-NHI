import {useEffect} from "react";
import {Dialog, DialogContent, DialogTitle} from "@mui/material";

const ModalConfirmIdentity = ({
                                  isOpening = false,
                                  setIsOpening = () => {
                                  },
                                  onModalOpen = () => {
                                  },
                                  onModalClose = () => {
                                  },
                                  onClickNext = () => {
                                  },
                              }) => {
    const handleCloseModalConfirmIdentity = () => {
        setIsOpening(false);
        onModalClose();
    };

    useEffect(() => {
        if (isOpening) {
            onModalOpen();
        }
    }, [isOpening]);

    return (
        <>
            <Dialog
                open={isOpening}
                onClose={handleCloseModalConfirmIdentity}
            >
                {/*Viết các component vào đây để xác minh danh tính, bao gồm 1 tiêu đề, một body: "Để tiếp tục, vui lòng xác minh đó là bạn", va một nút: "Tiếp tục xác nhận"*/}
                <DialogTitle>Confirm your identity</DialogTitle>
                <DialogContent>
                    <p>To continue, please confirm that it&#39;s you.</p>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ModalConfirmIdentity;