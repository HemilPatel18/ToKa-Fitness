import './InputBox.css'

export default function InputBox({text, placeholder, type, onChange}) {
    return(
        <>
            <div className="input-box">
                <span>{text}</span>
                <input type={type} id="" placeholder={placeholder} onChange={onChange}/>
            </div>
        </>
    )
}