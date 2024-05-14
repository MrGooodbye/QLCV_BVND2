import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
//import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import FileViewer from 'react-file-viewer'

import "./Document.scss";

//react pdf viewer
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const ModalPreviewDocument = (props) => {

    const { dataModalPreviewDoc, setExt } = props

    const handleCloseModalDocPreview = () => {
        props.close(false)
        props.resetdataModalPreviewDoc();
        props.resetExt();
    }

    const docs = [
        {
            uri: dataModalPreviewDoc,
            fileType: "pdf"
        }
    ]

    if (dataModalPreviewDoc && dataModalPreviewDoc.length !== 0 && setExt && setExt.length !== 0) {
        return (
            <>
                {dataModalPreviewDoc && setExt &&
                    <Modal size='xl' show={props.open}>
                        <Modal.Header closeButton onClick={() => handleCloseModalDocPreview()}></Modal.Header>
                        <Modal.Body>
                            <div className='preview'>
                                <FileViewer
                                    fileType={props.setExt}
                                    filePath={URL.createObjectURL(props.dataModalPreviewDoc)}
                                    style={{ height: "100rem" }}
                                />
                            </div>
                        </Modal.Body>
                    </Modal>
                }
            </>
        )
    }

    else if (dataModalPreviewDoc && dataModalPreviewDoc.length !== 0) {
        return (
            <>
                <Modal show={props.open} dialogClassName="modal-80mw mt-0">
                    <Modal.Header closeButton onClick={() => props.close(false)}></Modal.Header>
                    <Modal.Body>
                        <div className='preview'>
                            <DocViewer

                                //data từ local
                                // documents={dataModalPreviewDoc.map((file) => ({
                                //     uri: window.URL.createObjectURL(file),
                                //     // fileType: "application/pdf",
                                //     // fileName: file.name,
                                // }))}

                                //data từ api
                                documents={docs}
                                pluginRenderers={DocViewerRenderers}
                                style={{ height: "100rem" }}
                            />
                            {/* <Worker workerUrl='https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.min.js'>
                                <Viewer fileUrl={dataModalPreviewDoc} />;
                            </Worker> */}
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
    else {
        return (
            <></>
        )
    }
}

export default ModalPreviewDocument
