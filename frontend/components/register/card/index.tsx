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
    <button
      onClick={onClick}
      className="group w-full transform transition-all duration-200 hover:scale-105 hover:-translate-y-1"
    >
      <div className="flex flex-col justify-center items-center gap-6 h-80 bg-card text-foreground rounded-xl border border-border shadow-lg hover:shadow-xl transition-all duration-200 p-8 group-hover:border-freehunt-main/50">
        <div className="flex justify-center items-center w-20 h-20 rounded-full bg-freehunt-main/10 group-hover:bg-freehunt-main/20 transition-colors">
          {icon}
        </div>
        <div className="flex flex-col justify-center items-center gap-3 text-center">
          <h3 className="text-2xl font-bold text-freehunt-main group-hover:text-freehunt-main/90 transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-lg group-hover:text-foreground transition-colors">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

export default RegisterCard;
