import Toast from "@/components/common/toast";
import { createContext, useContext, useRef, useState } from "react";
type Toast = {
    show: boolean,
    status: string | null,
    message: string | null,
    time: number,
}
type State = {
    toggleToast: (data: Toast) => Promise<void>;
}
interface ToastProviderProps {
    children: React.ReactNode
}
const ToastContext = createContext<State | undefined>(undefined)

const ToastProvider = ({ children }: ToastProviderProps) => {
    const defaultToast = {
        show: false,
        status: "",
        message: "",
        time: 3000,
    }
    const timmer: { current: NodeJS.Timeout | null } = useRef(null);
    const toast_: { current: Toast | null } = useRef(null);
    const [toast, setToast] = useState<Toast | null>(defaultToast);

    const toggleToast = async (data: Toast) => {
        timmer.current = null
        if (toast_.current?.show) {
            setToast(defaultToast);
            timmer.current = setTimeout(() => {
                toggleToast(data);
            }, 500);
            return;
        }
        const temp = { ...data };
        if (!temp.time) temp.time = 5000;
        setToast(temp);
        timmer.current = setTimeout(() => {
            setToast(defaultToast);
        }, temp.time);
    };

    const onClose = () => {
        timmer.current = null
        setToast(defaultToast);
    };

    return (
        <ToastContext.Provider value={{ toggleToast }}>
            {children}
            <Toast toast={toast} onClose={onClose} />
        </ToastContext.Provider>
    );
};


function useToast() {
    const context = useContext(ToastContext)
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
export { ToastProvider, useToast }