'use client';

import { showToast } from "@/shared/utilities/commons";
import { useEffect } from "react";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//     title: 'Configs',
// };

export default function Configs() {

    useEffect(() => {
        showToast('Hey Configs', 'error');
    }, [])

    return (
        <h4>Configs</h4>
    );
}