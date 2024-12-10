interface ErrorMessageProps {
    message: string;
  }
  
  const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{message}</p>
    </div>
  );
  
  export default ErrorMessage;
  