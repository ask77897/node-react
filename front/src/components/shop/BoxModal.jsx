import React, { useContext } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BoxContext } from './BoxContext';


const BoxModal = () => {
    const {box, setBox} = useContext(BoxContext)
    const onClose = () => {
        setBox({
            ...box,
            show: false,
        })
    }
    const onConfirm = () => {
        if(box.action) {
            box.action();
        }
        onClose();
    }

    return (
        <>
            <Modal
                show={box.show}
                onHide={onClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{box.action ? "CONFIRM" : "ALERT"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {box.message}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={onConfirm}>
                        확인
                    </Button>
                    {box.action &&
                        <Button variant="secondary" onClick={onClose}>
                            취소
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default BoxModal