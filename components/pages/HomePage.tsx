import React from 'react';

const HomePage: React.FC = () => {
  return (
    <section className="bg-blue-900 text-white py-16 min-h-[calc(100vh-64px)] flex justify-center items-center">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to ARG Bidding App</h1>
        <p className="text-xl">Start bidding on your favorite items today.</p>
        {/* <button className="mt-8 bg-yellow-400 text-blue-900 text-xl font-semibold py-2 px-4 rounded-full hover:bg-yellow-500 hover:text-blue-900 transition duration-300 ease-in-out">
          Get Started
        </button> */}
      </div>
    </section>
  );
};

export default HomePage;
