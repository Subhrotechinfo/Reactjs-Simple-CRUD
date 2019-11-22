import { toast } from 'react-toastify';

export const notify = (msg,type) => {
    // console.log('Type -->',type);
    switch (type) {
        case 'success':
            toast.success(msg);break;
        case 'error':
            toast.error(msg);break;
        case 'warn':
            toast.warn(msg);break;
        case 'info':
            toast.info(msg); break;
        default:
            toast(msg);        
    }
}

// export { notify };
