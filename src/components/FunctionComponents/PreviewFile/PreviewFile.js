import React, { useState, useEffect, useContext, useCallback } from 'react';
import FileViewer from 'react-file-viewer';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import Preview from 'preview-office-docs'
import { Document, Page } from 'react-pdf';
import Modal from 'react-bootstrap/Modal';

function PreviewFile(props) {
    const [show, setShow] = useState(false);
    const [fileDetails, setFileDetails] = useState(null);

    const docs = [
        {
            uri: props.uri,
            fileType: props.fileType,
            fileName: props.fileName
        }
    ];

    const handleClose = () => {
        props.close(false);
        setShow(false);
    }

    const handleCreateObjURL = () => {
        let url = URL.createObjectURL(fileDetails);
        return url
    }

    useEffect(() => {
        if (props.active === true) {
            setShow(true);
            setFileDetails(props.fileDetails);
        }
    }, [props.active])

    return (
        <Modal fullscreen={true} show={show} onHide={handleClose}>
            <Modal.Header closeButton />
            {show === true &&
                <Modal.Body>
                    <div className="user-info-container col-xs-12">
                        <div className="container" >
                            <div className="row d-flex justify-content-center form-group">
                                <div className="row">
                                    <div className='col-sm-12'>
                                        <div className='previewImage' style={{ backgroundImage: `url(${handleCreateObjURL()})`, height: '500px' }}></div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <Preview url={props.uri} height='700px' width='800px' /> */}
                    {/* <FileViewer fileType={props.type} filePath={props.uri} /> */}
                    {/* <Document file={show === true ? handleCreateObjURL() : ''} /> */}

                </Modal.Body>
            }

        </Modal>
    )
}

export default PreviewFile