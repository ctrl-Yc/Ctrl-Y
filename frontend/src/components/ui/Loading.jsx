export const Loading = ({
  text = "書き込み中...",
  className = "",
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      <div
        className={[
          "absolute bottom-10 right-10",               
          "font-mono font-extrabold whitespace-pre text-orange-100",
          "[clip-path:inset(0_3ch_0_0)]",                  
          "animate-[l4_1s_steps(4)_infinite]",             
          `text-[30px]`,                            
          className,
        ].join(" ")}
        aria-live="polite"
        aria-label={text}
      >
        {text}
      </div>
    </div>
  );
};
