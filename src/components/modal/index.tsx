import React, { useState } from "react";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { create, InstanceProps } from "react-modal-promise";

export interface ModalTypes {
    title: string;
    text: string;
}

const MyBootstrapModal: React.FC<ModalTypes & InstanceProps<unknown>> = ({
    isOpen,
    onResolve,
    title
}) => {
    const [data, setData] = useState<any | null>(null)
    const submit = () => onResolve(data);
    const onchange = (e:any)=>{
        setData(e.target.value)
    }
    return (
        <Modal isOpen={isOpen}>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Code
                    </label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email" type="text" placeholder="email"
                        onChange={onchange}
                        />
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={submit}>
                    Submit
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export const myModal = create(MyBootstrapModal);
