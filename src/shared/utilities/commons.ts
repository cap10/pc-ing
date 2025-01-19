import toast from "react-hot-toast";

// fxn to open modal
export function openModal(modal: string){
    console.log('Open modal: ' + modal);
    
    const modalWindow = document.getElementById(modal);    

    if (modalWindow?.classList.contains("hidden")) {
        modalWindow.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    } else {
        modalWindow?.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}

// fxn to close modal
export function closeModal(modal: string){
    console.log('Close modal: ' + modal);
    
    const modalWindow = document.getElementById(modal); 
    if (modalWindow?.classList.contains("hidden")) {
        modalWindow.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    } else {
        modalWindow?.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}

// fxn to show toast message
export function showToast(msg: string, typ: string){
    if(msg){

        if(typ == 'success')
            toast.success(msg, {duration: 9000});
        else if(typ == 'error')
            toast.error(msg, {duration: 9000});
        else if(typ == 'loading')
            toast.loading(msg, {duration: 9000});
        else if(typ == 'info')
            toast(msg, {style:{border: '1px solid blue'}, duration: 9000});
        else
            toast.custom(msg);

    }
}