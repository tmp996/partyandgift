import React from "react";

const Descuentos = () => {
  return (
    <div className="bg-white pt-16 sm:pt-24">
      <div className="bg-white">
        <div className="overflow-hidden pt-32 sm:pt-14">
          <div className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative pb-16 pt-48 sm:pb-24">
                <div>
                  <h2
                    id="sale-heading"
                    className="text-4xl font-bold tracking-tight text-white md:text-5xl"
                  >
                    Descuentos de Liquidacion&nbsp; &nbsp; <br />
                    Hasta un 50%
                  </h2>
                  <div className="mt-6 text-base">
                    <a
                      href="#"
                      className="font-semibold text-white"
                    >
                      Ver Productos en Descuento
                      <span aria-hidden="true"> →</span>
                    </a>
                  </div>
                </div>

                <div className="absolute -top-32 left-1/2 -translate-x-1/2 transform sm:top-6 sm:translate-x-0">
                  <div className="ml-24 flex min-w-max space-x-6 sm:ml-3 lg:space-x-8">
                    <div className="flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                      <div className="flex-shrink-0">
                        <img
                          className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                          src="https://raw.githubusercontent.com/angeldev96/partyandgift/development/client/public/blackfriday_medium.jpg"
                          alt=""
                        />
                      </div>

                      <div className="mt-6 flex-shrink-0 sm:mt-0">
                        <img
                          className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                          src="https://raw.githubusercontent.com/angeldev96/partyandgift/development/client/public/giftblackfriday_medium.jpg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="flex space-x-6 sm:-mt-20 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                      <div className="flex-shrink-0"> </div>

                      <div className="mt-6 flex-shrink-0 sm:mt-0"> </div>
                    </div>
                    <div className="flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                      <div className="flex-shrink-0"> </div>

                      <div className="mt-6 flex-shrink-0 sm:mt-0"> </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Descuentos;
