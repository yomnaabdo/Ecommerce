import { useEffect, useState } from 'react'
import Style from './Templatename.module.css'




export default function TemplateName() {
    const [counter, setCounter] = useState(0);
    useEffect(() => {
    }, []);
return (
        <>
            TemplateName
            {counter}
            {setCounter}
            {Style}
        </>
    )
}
