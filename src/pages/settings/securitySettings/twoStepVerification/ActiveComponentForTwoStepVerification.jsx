function ActiveComponentForTwoStepVerification({ selectedOption, onClose }) {
    if (!selectedOption?.component) return null;

    const Component = selectedOption.component;
    return <Component
        onClose={onClose}
    // onSetValue={onSetValue} 
    />
}

export default ActiveComponentForTwoStepVerification;