function EditModal({Open, OnClose, children}){
    if(!open) return null;

    return(
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center  ${Open ? 'visible bg-black/20' : 'invisible'} `}
        onClick={OnClose}
        >
            <div 
            className={`absolute right-0 left-0 ml-auto mr-auto  top-[160px] bg-white p-7 shadow-lg rounded-sm w-80 transition-all ${Open? "scale-100 opacity-100": "scale-125 opacity-0" } `}
            onClick={(e) => e.stopPropagation()}
            >
            {children}


            </div>
            
        </div>
    )
}

export default EditModal;