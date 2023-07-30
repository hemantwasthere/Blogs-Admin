'use client'

import { useEffect } from "react";

import { useStoreModal } from "@/hooks/use-store-modal";

const SetupPage = () => {
    const [isOpen, onOpen] = useStoreModal((state) => [state.isOpen, state.onOpen]);

    useEffect(() => {
        if (!isOpen) onOpen()
    }, [isOpen, onOpen])

    return null
}

export default SetupPage