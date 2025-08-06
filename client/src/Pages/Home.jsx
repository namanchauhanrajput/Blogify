export const Home = () => {
    return (
        <>
            {/* Common wrapper for same background */}
            <div className="bg-gradient-to-r from-purple-100 to-blue-100">

                {/* Section 1 */}
                <section className="min-h-screen flex items-center justify-center px-4 py-10">
                    <div className="flex flex-col-reverse md:flex-row items-center gap-10 max-w-6xl w-full">
                        {/* Left content */}
                        <div className="flex-1 space-y-6 text-center md:text-left md:pl-10">
                            <p className="text-purple-700 font-semibold text-lg">
                                We are the World's Best IT Company
                            </p>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
                                Welcome to <span className="text-purple-700">Naman Chauhan</span>
                            </h1>
                            <p className="text-gray-700 text-base md:text-lg">
                                Are you ready to take your business to the next level with cutting-edge IT solutions?
                                Look no further! At <strong>Naman Chauhan</strong>, we specialize in providing innovative
                                IT services and solutions tailored to meet your unique needs.
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-row gap-4 justify-center md:justify-start">
                                <a href="/contact">
                                    <button className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition shadow-md">
                                        Contect Now
                                    </button>
                                </a>
                                <a href="/about">
                                    <button className="bg-transparent text-purple-700 border border-purple-500 px-6 py-3 rounded-xl hover:bg-purple-50 transition shadow-md">
                                        Learn More
                                    </button>
                                </a>
                            </div>
                        </div>

                        {/* Right image */}
                        <div className="flex-1 flex justify-center">
                            <img
                                src="/images/home.png"
                                alt="coding together"
                                className="w-72 md:w-96 object-contain drop-shadow-lg"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 2 (without extra background) */}
                <section className="px-4 py-6 flex justify-center items-center mt-6 md:mt-[-40px]">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 w-full max-w-6xl flex flex-col md:flex-row items-center gap-6 md:gap-10">

                        {/* Box 1 */}
                        <div className="flex-1 text-center border-b-2 md:border-b-0 md:border-r-2 border-purple-300 px-4 pb-4 md:pb-0">
                            <h2 className="text-4xl font-bold text-purple-700 mb-1">50+</h2>
                            <p className="text-gray-700 text-base">Registered Companies</p>
                        </div>

                        {/* Box 2 */}
                        <div className="flex-1 text-center border-b-2 md:border-b-0 md:border-r-2 border-purple-300 px-4 pb-4 md:pb-0">
                            <h2 className="text-4xl font-bold text-purple-700 mb-1">100,000+</h2>
                            <p className="text-gray-700 text-base">Happy Clients</p>
                        </div>

                        {/* Box 3 */}
                        <div className="flex-1 text-center border-b-2 md:border-b-0 md:border-r-2 border-purple-300 px-4 pb-4 md:pb-0">
                            <h2 className="text-4xl font-bold text-purple-700 mb-1">500+</h2>
                            <p className="text-gray-700 text-base">Well-known Developers</p>
                        </div>

                        {/* Box 4 */}
                        <div className="flex-1 text-center px-4">
                            <h2 className="text-4xl font-bold text-purple-700 mb-1">24/7</h2>
                            <p className="text-gray-700 text-base">Services</p>
                        </div>
                    </div>
                </section>
            </div>

            <section className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-6  flex justify-center items-center">
                <div className="flex flex-col-reverse md:flex-row items-center gap-20 md:gap-40 max-w-6xl w-full mt-0 md:mt-[-100px]">


                    {/* left image */}
                    <div className="flex-1 flex justify-center">
                        <img
                            src="/images/home2.png"
                            alt="coding together"
                            className="w-72 md:w-96 object-contain drop-shadow-lg"
                        />
                    </div>

                    {/* right content */}
                    <div className="flex-1 space-y-6 text-center md:text-left md:pl-10">
                        <p className="text-purple-700 font-semibold text-lg">
                            We are here to help you
                        </p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
                            Get Started <span className="text-purple-700">Today</span>
                        </h1>
                        <p className="text-gray-700 text-base md:text-lg">
                            Ready to take the first step towards a more efficient and secure IT infrastructure?
                            Contact us today for a free consultation and let's discuss how <span className="text-purple-700">Naman Chauhan </span>
                            can help your business thrive in the digital age.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-row gap-4 justify-center md:justify-start">
                            <a href="/contact">
                                <button className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition shadow-md">
                                    Contect Now
                                </button>
                            </a>
                            <a href="/about">
                                <button className="bg-transparent text-purple-700 border border-purple-500 px-6 py-3 rounded-xl hover:bg-purple-50 transition shadow-md">
                                    Learn More
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>



        </>
    );
};
