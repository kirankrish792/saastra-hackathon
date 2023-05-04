export default function Home() {
  return (
    <main class="flex flex-col   text-white mx-auto  h-full ">
      <div class="flex items-end py-28 w-full pl-28">
        <div>
          <h1 class=" md:text-8xl text-5xl tracking-widest">iNSiGHT</h1>
        </div>
        <div class="text-xl">for people</div>
      </div>

      <div
        class="max-w-7xl mx-auto md:grid grid-cols-5 p-4 min-h-[500px] items-center mix-blend-lighten"
        style={{
          "background-image": "url(globe.jpg)",
          "background-repeat": "no-repeat",
          "background-size": "fit",
          "background-position":"right center"
        }}
      >
        <div class="col-span-2">
          <div>
            <div class=" text-3xl py-4">What is iNSiGHT ?</div>
            <div class="">
              A blockchain-based system for government transaction to
              eradicating corruption by providing transperancy security and
              Immutability
            </div>
          </div>
        </div>
        {/* <div
          class="grid grid-cols-3 grid-rows-3 h-full col-span-3 "
        >
          <div class=" bg-white w-[200px] mix-blend-overlay"></div>
          <div class=""></div>
          <div class="bg-white w-[200px] bg-opacity-50 mix-blend-overlay"></div>
          <div class=""></div>
          <div class="bg-white w-[200px] bg-opacity-50 mix-blend-overlay"></div>
          <div class=""></div>
          
        </div> */}
      </div>
    </main>
  );
}
