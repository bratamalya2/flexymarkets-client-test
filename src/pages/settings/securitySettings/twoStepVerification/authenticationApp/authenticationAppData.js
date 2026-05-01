const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

export const authenticationAppData = [
    {
        stepNo: "Step 1",
        // qr: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg",
        instruction: ["Download and install Google Authenticator on your mobile device."],
        content: "You can also use other apps similar to Google Authenticator, such as Authy. However, Google Authenticator is recommended for future use."
    },
    {
        stepNo: "Step 2",
        // qr: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg",
        instruction: [
            "Scan this QR code in your Google Authenticator or enter the security key manually.",
            "Enter the security key in your Google Authenticator."
        ],
        copy: [
            {
                key: "Account name",
                value: `${SHORT_BRAND_NAME} db61bb3f`
            },
            {
                key: "Security key",
                value: "VTGKUR5QJ6TRAWKWHGXNL3IKR4SFUTUB"
            }
        ],
        content: "Please keep the QR code and security key secure. Never share it with anyone."
    },
    {
        stepNo: "Step 3",
        instruction: ["In the confirmation box below, enter the 6-digit code that you can see in Google Authenticator."],
        OtpComponent: true
    }
]