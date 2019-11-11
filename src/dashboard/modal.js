//Modal 
import React from 'react';
const Modal = ({handleClose,show, children}) => {
    const shclassName = show ? "modal display-block":"modal display-none";
    return (
        <div className={shclassName}> 
            <section className="modal-main">
                {children}
                <button onClick={handleClose}>close</button>
            </section>
        </div>
    );
};

export default Modal;

