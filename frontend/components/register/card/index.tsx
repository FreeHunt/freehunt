function RegisterCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick}>
      <div
        className="flex flex-col justify-center items-center gap-4 md:gap-9 w-72 md:w-96 h-64 md:h-96 bg-slate-50 text-freehunt-black-two"
        style={{
          borderRadius: "30px",
          border: "1px solid var(--Grey-Dark, #B5B5B5)",
          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        }}
      >
        {icon}
        <div className="flex flex-col justify-center items-center gap-3 md:gap-5">
          <p className="text-2xl md:text-3xl font-semibold text-center">
            {title}
          </p>
          <p className="text-center text-lg md:text-xl">{description}</p>
        </div>
      </div>
    </button>
  );
}

export default RegisterCard;
