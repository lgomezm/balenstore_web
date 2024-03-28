interface Errors {
    [fieldName: string]: string[];
}

interface ErrorListProps {
    error: Errors;
}

const ErrorList = ({ error }: ErrorListProps) => {
    return <div className="text-start">
        <p>Could not complete the operation. Errors:</p>
        <ul>
            {Object.entries(error).map(([fieldName, errorMessages]) => (
                <li key={`${fieldName}`}>{fieldName}: {errorMessages[0]}</li>
            ))}
        </ul>
    </div>;
};

export default ErrorList;
