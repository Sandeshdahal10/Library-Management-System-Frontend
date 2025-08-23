export default function BookCard() {
  return (
    <>
      <main className="min-h-screen w-full">
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4">
          <div className="border    shadow-lg w-[300px] h-[300px]  rounded-3xl ">
            {/* <img src="" alt="" className="image-fit w-full rounded-t-3xl" /> */}
            <div>
              <h3 className="py-3 text-2xl text-ternary-dark font-bold-general px-5 text-center"></h3>
              <p className="px-5 py- 2 text-xl text-slate-500 font-semibold-general text-center "></p>
              <p className="px-5 py-2 text-sm text-slate-400 font-medium-general text-center"></p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
