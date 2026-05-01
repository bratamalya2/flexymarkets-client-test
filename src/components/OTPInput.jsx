import { useState, useRef, useEffect } from "react";
import { TextField, Stack } from "@mui/material";

function OTPInput({ length = 6, value = "", onComplete }) {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (value && value !== otp.join("")) {
            const splitVal = value.split("").concat(new Array(length).fill("")).slice(0, length);
            if (JSON.stringify(splitVal) !== JSON.stringify(otp)) {
                setOtp(splitVal);
            }
        }
    }, [value]);

    useEffect(() => {
        const joined = otp.join("");
        if (joined.length === length && !otp.includes("") && joined !== value) {
            onComplete?.(joined);
        }
    }, [otp, length, value, onComplete]);

    const handleChange = (e, index) => {
        const val = e.target.value;
        if (!/^[0-9]?$/.test(val)) return;

        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);

        if (val && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <Stack direction="row" spacing={1}>
            {otp.map((digit, index) => (
                <TextField
                    key={index}
                    variant="outlined"
                    size="small"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    sx={{
                        width: "50px",
                        height: "50px",
                        "& input": {
                            textAlign: "center",
                            fontSize: "16px",
                            padding: "0px",
                            height: "50px",
                            lineHeight: "50px",
                        },
                    }}
                />
            ))}
        </Stack>
    );
}

export default OTPInput;