function StatsCard({
    title,
    value,
    color
  }) {
  
    return (
  
      <div
        className="
        bg-white
        rounded-2xl
        shadow-sm
        p-6
        hover:shadow-lg
        transition
        border-l-4
        "
        style={{
          borderColor: color
        }}
      >
  
        <p
          className="
          text-slate-500
          "
        >
          {title}
        </p>
  
        <h2
          className="
          text-5xl
          font-bold
          mt-2
          "
        >
          {value}
        </h2>
  
      </div>
    );
  }
  
  export default StatsCard;