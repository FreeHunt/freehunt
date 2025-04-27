"use client";

function Page() {
  return (
    <div className="flex flex-col items-center gap-4 md:gap-8 lg:gap-20 my-6 md:my-10 lg:my-28">
      <div className="flex flex-col justify-center items-center gap-2 self-stretch px-4">
        <div className="flex p-3 md:p-5 justify-center items-center gap-2">
          <p className="text-xl md:text-2xl lg:text-4xl text-center font-bold">
            <span className="text-freehunt-main">Présentez</span>
            <span className="text-black font-normal">-vous !</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
