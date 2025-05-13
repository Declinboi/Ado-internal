import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useVerifyEmailMutation } from "../../redux/api/userApiSlice";

const VerifyEmail = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();

  const [verifyEmail, { isLoading, error }] = useVerifyEmailMutation();

  const handleChange = (index: number, value: any) => {
    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pasted[i] || "";
      }
      setCode(newCode);

      const lastFilledIndex =
        [...code]
          .map((digit, i) => ({ digit, i }))
          .reverse()
          .find((d) => d.digit !== "")?.i ?? 0;

      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");

    try {
      await verifyEmail({ code: verificationCode }).unwrap();
      toast.success("Email verified successfully!");
      navigate("/"); // Or navigate to home
    } catch (err: any) {
      console.error("Verification Error:", err);
      toast.error(err?.data?.message || "Verification failed");
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit") as unknown as React.FormEvent);
    }
  }, [code]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center mt-10 space-y-4"
    >
      <h2 className="text-xl font-semibold">Enter Verification Code</h2>
      <div className="flex space-x-2">
        {code.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            className="w-12 h-12 text-center text-xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        ))}
      </div>

      <button
        type="submit"
        className="mt-4 bg-yellow-400 text-black font-semibold py-2 px-6 rounded hover:bg-yellow-500"
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify"}
      </button>

      {error && <p className="text-red-500 text-sm">Verification failed.</p>}
    </form>
  );
};

export default VerifyEmail;
