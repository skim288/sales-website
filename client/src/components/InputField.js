import { useState } from "react";

export default function InputField({ type, placeholder, icon, value, onChange }) {
  // State to toggle password visibility
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  return (
    <div className="input-wrapper" style={{ 
      position: 'relative',
      marginBottom: '16px',
      width: '100%'
    }}>
      <input
        type={isPasswordShown ? "text" : type}
        placeholder={placeholder}
        className="input-field"
        value={value}
        onChange={onChange}
        required
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '4px',
          border: '1px solid #4CAF50',
          fontSize: '16px',
          paddingRight: type === 'password' ? '40px' : '12px'
        }}
      />
      {type === "password" && (
        <div
          onClick={() => setIsPasswordShown((prevState) => !prevState)}
          style={{ 
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            zIndex: 1
          }}
        >
          <img 
            src={isPasswordShown ? "/password-shown.png" : "/password-hidden.png"} 
            alt={isPasswordShown ? "Hide password" : "Show password"}
            style={{ 
              width: '24px',
              height: '24px'
            }}
          />
        </div>
      )}
    </div>
  );
}